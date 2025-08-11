import React, { useMemo, useState } from "react";

/** Config */
const PRICE_GEL = 40;
const OPEN_HOUR = 8;           // 08:00
const LAST_START_HOUR = 24;    // 24:00 means 00:00 next-day start
const MAX_RACKETS = 4;
const DAILY_CAP_HOURS = 2;
const LS_KEY = "sairme_padel_bookings_v1";

/** Helpers */
const pad = (n) => String(n).padStart(2, "0");
const timeLabel = (h) => `${pad(h % 24)}:00`;
const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const todayKey = (() => {
  const d = new Date();
  return toDateKey(d);
})();

/** i18n (KA default, EN toggle) */
const T = {
  ka: {
    title: "საირმე – პადელის კორტი",
    subtitle: `დარბადი 1 საათით • ${PRICE_GEL} ₾`,
    pickDate: "აირჩიეთ თარიღი",
    yourName: "თქვენი სახელი",
    phone: "ტელეფონის ნომერი",
    rackets: `რაკეტები (მაქს ${MAX_RACKETS})`,
    book: "დაჯავშნა",
    cancel: "გაუქმება",
    payNote: "გადახდა ადგილზე. 1-საათიანი სლოტები.",
    rulesNote: `ერთი მომხმარებელი ერთ დღეში მაქს ${DAILY_CAP_HOURS} საათი.`,
    listTitle: "დღის ჯავშნები",
    booked: "დაჯავშნილია",
    successTitle: "გმადლობთ ჯავშნისთვის. გაერთეთ!",
    errors: {
      namePhone: "შეიყვანეთ სახელი და ტელეფონის ნომერი.",
      rackets: `მაქს ${MAX_RACKETS} რაკეტი.`,
      cap: `ზღვარი: ერთ დღეში მაქს ${DAILY_CAP_HOURS} საათი თითო ნომერზე.`,
      overlap: "ეს დრო უკვე დაკავებულია.",
    },
    lang: "EN",
  },
  en: {
    title: "Sairme – Padel Court",
    subtitle: `Rent a court for 1 hour • ${PRICE_GEL} GEL`,
    pickDate: "Select date",
    yourName: "Your name",
    phone: "Phone number",
    rackets: `Padel rackets (max ${MAX_RACKETS})`,
    book: "Book",
    cancel: "Cancel",
    payNote: "Payment on-site. 1-hour slots only.",
    rulesNote: `Limit: max ${DAILY_CAP_HOURS} hours per phone per day.`,
    listTitle: "Today's reservations",
    booked: "Booked",
    successTitle: "Thank you for your booking. Have fun!",
    errors: {
      namePhone: "Please enter your name and phone.",
      rackets: `Max ${MAX_RACKETS} rackets.`,
      cap: `Limit is ${DAILY_CAP_HOURS} hours per phone per day.`,
      overlap: "Selected time is already booked.",
    },
    lang: "KA",
  },
};

export default function App() {
  const [lang, setLang] = useState("ka");
  const L = T[lang];

  const [date, setDate] = useState(todayKey);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rackets, setRackets] = useState(0);
  const [banner, setBanner] = useState({ type: "", msg: "" });
  const [mode, setMode] = useState("form"); // 'form' | 'success'

  // bookings stored as { [dateKey]: { [hour]: { name, phone, rackets, price, at } } }
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
  });

  const hours = useMemo(() => {
    const arr = [];
    for (let h = OPEN_HOUR; h <= LAST_START_HOUR; h++) arr.push(h);
    return arr;
  }, []);

  const day = bookings[date] || {};

  const save = (next) => {
    setBookings(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const phoneHoursForDay = (phoneValue) => {
    const d = bookings[date] || {};
    let count = 0;
    Object.values(d).forEach((r) => { if (r.phone === phoneValue.trim()) count += 1; });
    return count;
  };

  const handleBookSlot = (hour) => {
    if (!name.trim() || !phone.trim()) { setBanner({ type: "error", msg: L.errors.namePhone }); return; }
    if (rackets < 0 || rackets > MAX_RACKETS) { setBanner({ type: "error", msg: L.errors.rackets }); return; }

    const already = phoneHoursForDay(phone);
    if (already >= DAILY_CAP_HOURS) { setBanner({ type: "error", msg: L.errors.cap }); return; }

    // overlap
    if ((bookings[date] || {})[hour]) { setBanner({ type: "error", msg: L.errors.overlap }); return; }

    const next = { ...bookings };
    const d = { ...(next[date] || {}) };
    d[hour] = { name: name.trim(), phone: phone.trim(), rackets, price: PRICE_GEL, at: new Date().toISOString() };
    next[date] = d;
    save(next);

    setMode("success");
    setBanner({ type: "", msg: "" });
  };

  const handleCancel = (hour) => {
    const d = { ...(bookings[date] || {}) };
    const r = d[hour];
    if (!r) return;
    if (r.phone !== phone.trim()) { // require same phone
      setBanner({ type: "error", msg: lang === 'ka' ? 'გაუქმებისთვის შეიყვანეთ ის ნომერი, რითიც დაჯავშნეთ.' : 'Enter the same phone you used to book.' });
      return;
    }
    delete d[hour];
    const next = { ...bookings, [date]: d };
    save(next);
  };

  const entriesForDay = Object.entries(day).map(([h, r]) => ({ hour: Number(h), ...r })).sort((a, b) => a.hour - b.hour);

  if (mode === "success") {
    return (
      <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center">
        <div className="bg-white border rounded-2xl shadow-sm p-6 w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-[#1B4D3E] mb-2">{L.successTitle}</h1>
          <p className="text-slate-600 mb-6">{lang === 'ka' ? 'თქვენი ჯავშანი შენახულია თქვენს მოწყობილობაზე.' : 'Your booking has been saved in your browser.'}</p>
          <button onClick={() => setMode('form')} className="px-4 py-2 rounded-xl text-white" style={{ backgroundColor: '#1B4D3E' }}>OK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-slate-900">
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B4D3E]">{L.title}</h1>
          <p className="text-sm text-slate-600">{L.subtitle}</p>
        </div>
        <button onClick={() => setLang((v) => (v === 'ka' ? 'en' : 'ka'))} className="bg-[#3C8D89] text-white px-3 py-1.5 rounded-lg text-sm hover:opacity-95">{L.lang}</button>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-10 grid md:grid-cols-5 gap-6">
        {/* Left: Form */}
        <section className="md:col-span-2 bg-white rounded-2xl shadow-sm border p-4 space-y-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">{L.pickDate}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">{L.yourName}</label>
            <input className="w-full px-3 py-2 rounded-xl border border-slate-200" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ka' ? 'სახელი და გვარი' : 'Name and surname'} />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">{L.phone}</label>
            <input className="w-full px-3 py-2 rounded-xl border border-slate-200" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+995 5xx xx xx xx" />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">{L.rackets}</label>
            <input type="number" min={0} max={MAX_RACKETS} className="w-full px-3 py-2 rounded-xl border border-slate-200" value={rackets} onChange={(e) => setRackets(Number(e.target.value) || 0)} />
          </div>

          {banner.msg && (
            <div className={`rounded-lg px-3 py-2 text-sm border ${banner.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{banner.msg}</div>
          )}
          <p className="text-xs text-slate-500">{L.payNote}</p>
          <p className="text-xs text-slate-500">{L.rulesNote}</p>
        </section>

        {/* Right: Slots grid + list */}
        <section className="md:col-span-3 bg-white rounded-2xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">{lang === 'ka' ? 'აირჩიეთ დრო' : 'Pick a time'}</div>
            <div className="text-sm">{PRICE_GEL} GEL / {lang === 'ka' ? 'საათი' : 'hour'}</div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {hours.map((h) => {
              const booked = !!day[h];
              const slotText = `${timeLabel(h)} – ${timeLabel((h + 1) % 24)}${h === 24 ? (lang === 'ka' ? ' (შემდეგი დღე)' : ' (next day)') : ''}`;
              return (
                <div key={h} className={`rounded-xl border p-3 flex items-center justify-between ${booked ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
                  <div className="text-sm">
                    <div className="font-medium">{slotText}</div>
                    {booked && <div className="text-xs text-slate-500">{L.booked}</div>}
                  </div>
                  {booked ? (
                    <button onClick={() => handleCancel(h)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm">{L.cancel}</button>
                  ) : (
                    <button onClick={() => handleBookSlot(h)} className="px-3 py-1.5 rounded-lg text-white text-sm hover:opacity-95" style={{ backgroundColor: '#1B4D3E' }}>{L.book}</button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-600">{L.listTitle}</h3>
            {Object.keys(day).length === 0 ? (
              <div className="text-sm text-slate-500 py-2">{lang === 'ka' ? 'ჯავშნები არ არის.' : 'No reservations yet.'}</div>
            ) : (
              <div className="mt-1 divide-y">
                {Object.entries(day).sort((a,b)=>Number(a[0])-Number(b[0])).map(([h, r]) => (
                  <div key={h} className="py-2 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{timeLabel(Number(h))} – {timeLabel((Number(h)+1)%24)} {Number(h)===24 ? (lang==='ka'?'(შემდეგი დღე)':'(next day)') : ''}</span>
                      <span className="text-slate-500"> • {r.name}</span>
                      <span className="text-slate-400"> • {r.phone}</span>
                      <span className="text-slate-500"> • (R {r.rackets})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{PRICE_GEL} GEL</span>
                      <button onClick={() => handleCancel(Number(h))} className="text-xs px-2 py-1 rounded-lg border border-slate-300 hover:bg-slate-100">{L.cancel}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-xs text-slate-500">© {new Date().getFullYear()} Sairme Padel — React + Tailwind.</div>
      </footer>
    </div>
  );
}
