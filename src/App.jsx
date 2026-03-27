import React, { useMemo, useState } from "react";

/* ─── Config ───────────────────────────────────────── */
const PRICE_GEL      = 40;
const OPEN_HOUR      = 8;
const LAST_START_HOUR = 24;
const MAX_RACKETS    = 4;
const DAILY_CAP_HOURS = 2;
const LS_KEY         = "sairme_padel_bookings_v1";

/* ─── Helpers ──────────────────────────────────────── */
const pad       = (n) => String(n).padStart(2, "0");
const timeLabel = (h) => `${pad(h % 24)}:00`;
const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey  = toDateKey(new Date());

/* ─── i18n ─────────────────────────────────────────── */
const T = {
  ka: {
    title:       "საირმე პადელი",
    subtitle:    "პრემიუმ პადელის კორტი",
    pickDate:    "თარიღი",
    yourName:    "სახელი",
    phone:       "ტელეფონი",
    rackets:     "რაკეტები",
    book:        "დაჯავშნა",
    cancel:      "გაუქმება",
    payNote:     "გადახდა ადგილზე",
    rulesNote:   `მაქს ${DAILY_CAP_HOURS} საათი / ნომერი / დღე`,
    listTitle:   "დღის ჯავშნები",
    booked:      "დაჯავშნილია",
    available:   "ხელმისაწვდომია",
    pickTime:    "დროის არჩევა",
    perHour:     "/ საათი",
    noBookings:  "ჯავშნები არ არის",
    successTitle:"ჯავშანი დადასტურდა!",
    successSub:  "გისურვებთ სახალისო თამაშს!",
    backBtn:     "უკან დაბრუნება",
    nowAvailable:"ახლა ხელმისაწვდომია",
    heroLine1:   "პადელის",
    heroLine2:   "კორტი",
    heroLine3:   "დაჯავშნა",
    heroDesc:    "დაჯავშნეთ სწრაფად და მარტივად. გადახდა ადგილზე.",
    statCourt:   "კორტი",
    statHours:   "სამუშაო საათები",
    statPrice:   "ფასი",
    statFree:    "ხელმისაწვდომი",
    formTitle:   "ჯავშნის ინფო",
    formDesc:    "შეავსეთ ველები, შემდეგ აირჩიეთ დრო",
    nextDay:     "შემდეგი დღე",
    cancelPhone: "გაუქმებისთვის შეიყვანეთ ჯავშნის ნომერი.",
    errors: {
      namePhone: "შეიყვანეთ სახელი და ტელეფონი.",
      rackets:   `მაქს ${MAX_RACKETS} რაკეტი.`,
      cap:       `ზღვარი: ${DAILY_CAP_HOURS} საათი / ნომერი / დღე.`,
      overlap:   "ეს დრო უკვე დაკავებულია.",
    },
    lang: "EN",
  },
  en: {
    title:       "Sairme Padel",
    subtitle:    "Premium Padel Court",
    pickDate:    "Date",
    yourName:    "Full Name",
    phone:       "Phone",
    rackets:     "Rackets",
    book:        "Book",
    cancel:      "Cancel",
    payNote:     "Pay on arrival",
    rulesNote:   `Max ${DAILY_CAP_HOURS} hrs / phone / day`,
    listTitle:   "Today's bookings",
    booked:      "Booked",
    available:   "Available",
    pickTime:    "Select Time",
    perHour:     "/ hour",
    noBookings:  "No bookings yet",
    successTitle:"Booking Confirmed!",
    successSub:  "Your reservation is saved. Have fun!",
    backBtn:     "Back to booking",
    nowAvailable:"Now available",
    heroLine1:   "Play",
    heroLine2:   "Padel",
    heroLine3:   "Today",
    heroDesc:    "Book your court quickly and easily. Pay on arrival.",
    statCourt:   "Court",
    statHours:   "Open hours",
    statPrice:   "Price",
    statFree:    "Available",
    formTitle:   "Booking Details",
    formDesc:    "Fill in your info, then pick a time slot",
    nextDay:     "next day",
    cancelPhone: "Enter the phone number used to book.",
    errors: {
      namePhone: "Please enter name and phone.",
      rackets:   `Max ${MAX_RACKETS} rackets.`,
      cap:       `Limit: ${DAILY_CAP_HOURS} hrs/phone/day.`,
      overlap:   "This slot is already booked.",
    },
    lang: "KA",
  },
};

/* ─── SVG Icons ────────────────────────────────────── */
const IconRacket = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="10" cy="10" rx="6" ry="7" />
    <line x1="10" y1="3" x2="10" y2="17" opacity="0.5" />
    <line x1="4" y1="10" x2="16" y2="10" opacity="0.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" strokeWidth="2.5" />
  </svg>
);

const IconClock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const IconCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 9 17 20 6" />
  </svg>
);

const IconUser = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconPhone = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/>
  </svg>
);

const IconCalendar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* ─── App ───────────────────────────────────────────── */
export default function App() {
  const [lang, setLang]       = useState("ka");
  const L                     = T[lang];

  const [date, setDate]       = useState(todayKey);
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [rackets, setRackets] = useState(0);
  const [banner, setBanner]   = useState({ type: "", msg: "" });
  const [mode, setMode]       = useState("form"); // "form" | "success"
  const [lastBooked, setLastBooked] = useState(null);

  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
    catch { return {}; }
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

  const phoneHoursForDay = (ph) => {
    const d = bookings[date] || {};
    return Object.values(d).filter((r) => r.phone === ph.trim()).length;
  };

  const handleBookSlot = (hour) => {
    if (!name.trim() || !phone.trim()) { setBanner({ type: "error", msg: L.errors.namePhone }); return; }
    if (rackets < 0 || rackets > MAX_RACKETS) { setBanner({ type: "error", msg: L.errors.rackets }); return; }
    if (phoneHoursForDay(phone) >= DAILY_CAP_HOURS) { setBanner({ type: "error", msg: L.errors.cap }); return; }
    if ((bookings[date] || {})[hour]) { setBanner({ type: "error", msg: L.errors.overlap }); return; }

    const next = { ...bookings };
    const d    = { ...(next[date] || {}) };
    d[hour]    = { name: name.trim(), phone: phone.trim(), rackets, price: PRICE_GEL, at: new Date().toISOString() };
    next[date] = d;
    save(next);
    setLastBooked({ hour, name: name.trim(), date });
    setMode("success");
    setBanner({ type: "", msg: "" });
  };

  const handleCancel = (hour) => {
    const d = { ...(bookings[date] || {}) };
    const r = d[hour];
    if (!r) return;
    if (r.phone !== phone.trim()) {
      setBanner({ type: "error", msg: L.cancelPhone });
      return;
    }
    delete d[hour];
    save({ ...bookings, [date]: d });
  };

  const bookedCount    = Object.keys(day).length;
  const availableCount = hours.length - bookedCount;

  /* ── Success screen ─────────────────────────────── */
  if (mode === "success") {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
        {/* Glow blob */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-blob"
               style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center animate-fade-in-up relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6 animate-success-pop">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 0 60px rgba(16,185,129,0.5)" }}>
              <IconCheck size={40} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            {L.successTitle}
          </h1>
          <p className="text-white/50 mb-6 text-sm">{L.successSub}</p>

          {lastBooked && (
            <div className="badge-green rounded-2xl p-5 mb-6 text-left animate-fade-in-up-d1">
              <div className="flex items-center gap-2 mb-3">
                <IconClock size={16} />
                <span className="font-semibold">
                  {timeLabel(lastBooked.hour)} – {timeLabel((lastBooked.hour + 1) % 24)}
                  {lastBooked.hour === 24 ? ` (${L.nextDay})` : ""}
                </span>
              </div>
              <div className="text-white/60 text-xs space-y-1">
                <div className="flex items-center gap-2"><IconUser size={12} />{lastBooked.name}</div>
                <div className="flex items-center gap-2"><IconCalendar size={12} />{lastBooked.date}</div>
              </div>
              <div className="mt-3 pt-3 divider flex items-center justify-between">
                <span className="text-white/40 text-xs">{lang === "ka" ? "გადახდა ადგილზე" : "Pay on arrival"}</span>
                <span className="font-bold text-emerald-300 text-lg">{PRICE_GEL} GEL</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setMode("form")}
            className="btn-emerald w-full py-4 rounded-2xl text-base"
          >
            {L.backBtn}
          </button>
        </div>
      </div>
    );
  }

  /* ── Main screen ────────────────────────────────── */
  return (
    <div className="min-h-screen mesh-bg text-white">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full animate-blob"
             style={{ background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full animate-blob"
             style={{ background: "radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)", animationDelay: "4s" }} />
      </div>

      {/* ── Header ────────────────────────────────── */}
      <header className="sticky top-0 z-50"
              style={{ background: "rgba(3,12,6,0.75)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400"
                 style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.28)" }}>
              <IconRacket size={20} />
            </div>
            <div>
              <p className="font-bold text-white leading-tight">{L.title}</p>
              <p className="text-white/35 text-xs leading-tight">{L.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => setLang((v) => (v === "ka" ? "en" : "ka"))}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.28)", color: "#6EE7B7" }}
          >
            {L.lang}
          </button>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12">
        {/* Live badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7 badge-green">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-dot-pulse" />
          {L.nowAvailable}
        </div>

        {/* Big title */}
        <div className="animate-fade-in-up-d1 mb-5">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none">
            <span className="text-white/90">{L.heroLine1} </span>
            <span className="text-gradient-shimmer">{L.heroLine2}</span>
            <br />
            <span className="text-white/90">{L.heroLine3}</span>
          </h2>
        </div>

        <p className="animate-fade-in-up-d2 text-white/45 text-base sm:text-lg max-w-lg mb-10">
          {L.heroDesc}
        </p>

        {/* Stats row */}
        <div className="animate-fade-in-up-d3 flex flex-wrap gap-3">
          {[
            { icon: "🎾", value: "1",                     label: L.statCourt },
            { icon: "⏰", value: "08:00 – 00:00",         label: L.statHours },
            { icon: "💳", value: `${PRICE_GEL} GEL/h`,   label: L.statPrice },
            { icon: "✅", value: `${availableCount} / ${hours.length}`, label: L.statFree },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                 style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-white font-semibold text-sm leading-tight">{s.value}</div>
                <div className="text-white/35 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main content ──────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-5">

          {/* ── Left: Form + reservations list ───── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Booking form card */}
            <div className="glass-card rounded-3xl overflow-hidden animate-fade-in-up-d1">
              {/* Card header */}
              <div className="px-6 py-5 divider border-b">
                <h3 className="font-semibold text-white">{L.formTitle}</h3>
                <p className="text-white/35 text-xs mt-0.5">{L.formDesc}</p>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Date */}
                <div>
                  <label className="label-upper flex items-center gap-1.5 mb-2">
                    <IconCalendar />{L.pickDate}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-dark w-full px-4 py-3 rounded-xl"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="label-upper flex items-center gap-1.5 mb-2">
                    <IconUser />{L.yourName}
                  </label>
                  <input
                    className="input-dark w-full px-4 py-3 rounded-xl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "ka" ? "სახელი გვარი" : "Full name"}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="label-upper flex items-center gap-1.5 mb-2">
                    <IconPhone />{L.phone}
                  </label>
                  <input
                    className="input-dark w-full px-4 py-3 rounded-xl"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+995 5xx xx xx xx"
                  />
                </div>

                {/* Rackets picker */}
                <div>
                  <label className="label-upper flex items-center gap-1.5 mb-2">
                    <IconRacket size={13} />{L.rackets} (0 – {MAX_RACKETS})
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRackets(r)}
                        className="py-3 rounded-xl font-bold text-sm transition-all"
                        style={{
                          background: rackets === r
                            ? "linear-gradient(135deg, #059669, #10B981)"
                            : "rgba(255,255,255,0.055)",
                          border: rackets === r
                            ? "none"
                            : "1px solid rgba(255,255,255,0.09)",
                          color: rackets === r ? "#fff" : "rgba(255,255,255,0.45)",
                          transform: rackets === r ? "scale(1.05)" : "scale(1)",
                          boxShadow: rackets === r ? "0 4px 16px rgba(16,185,129,0.4)" : "none",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner */}
                {banner.msg && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm flex items-start gap-3 animate-fade-in-up"
                    style={{
                      background: banner.type === "error" ? "rgba(239,68,68,0.10)" : "rgba(16,185,129,0.10)",
                      border:     banner.type === "error" ? "1px solid rgba(239,68,68,0.28)" : "1px solid rgba(16,185,129,0.28)",
                      color:      banner.type === "error" ? "#FCA5A5" : "#6EE7B7",
                    }}
                  >
                    <span className="mt-0.5 text-base">{banner.type === "error" ? "⚠️" : "✓"}</span>
                    <span className="leading-snug">{banner.msg}</span>
                  </div>
                )}

                {/* Fine print */}
                <div className="pt-1 space-y-1.5 divider border-t">
                  <p className="text-white/28 text-xs flex items-center gap-2">
                    <span>💳</span>{L.payNote}
                  </p>
                  <p className="text-white/28 text-xs flex items-center gap-2">
                    <span>⏱</span>{L.rulesNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Reservations list */}
            {bookedCount > 0 && (
              <div className="glass-card rounded-3xl overflow-hidden animate-fade-in-up-d2">
                <div className="px-6 py-4 divider border-b flex items-center justify-between">
                  <h3 className="text-white/70 text-sm font-semibold">{L.listTitle}</h3>
                  <span className="badge-green text-xs px-2.5 py-1 rounded-full font-semibold">{bookedCount}</span>
                </div>
                <div>
                  {Object.entries(day)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map(([h, r]) => (
                      <div key={h} className="px-6 py-4 flex items-center justify-between gap-4 divider border-b last:border-0"
                           style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <div className="min-w-0">
                          <div className="text-white/80 font-semibold text-sm flex items-center gap-2">
                            <IconClock />
                            {timeLabel(Number(h))} – {timeLabel((Number(h) + 1) % 24)}
                            {Number(h) === 24 && <span className="text-white/30 text-xs">({L.nextDay})</span>}
                          </div>
                          <div className="text-white/35 text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{r.name}</span>
                            <span>·</span>
                            <span>R{r.rackets}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">{PRICE_GEL} GEL</span>
                          <button
                            onClick={() => handleCancel(Number(h))}
                            className="btn-ghost-red px-3 py-1.5 rounded-lg text-xs font-medium"
                          >
                            {L.cancel}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Time slots grid ─────────────── */}
          <div className="lg:col-span-3 animate-fade-in-up-d2">
            <div className="glass-card rounded-3xl overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-5 divider border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{L.pickTime}</h3>
                  <p className="text-white/35 text-xs mt-0.5 flex items-center gap-1.5">
                    <IconCalendar />{date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-gradient-emerald font-bold text-2xl leading-tight">{PRICE_GEL} GEL</div>
                  <div className="text-white/35 text-xs">{L.perHour}</div>
                </div>
              </div>

              <div className="p-5">
                {/* Legend */}
                <div className="flex gap-5 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-white/40 text-xs font-medium">{L.available} ({availableCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="text-white/40 text-xs font-medium">{L.booked} ({bookedCount})</span>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {hours.map((h) => {
                    const booked   = !!day[h];
                    const isNextDay = h === 24;
                    const slotLabel = `${timeLabel(h)} – ${timeLabel((h + 1) % 24)}`;

                    return (
                      <div
                        key={h}
                        className={`rounded-2xl p-4 ${booked ? "slot-booked" : "slot-free"}`}
                      >
                        {/* Time row */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex items-center gap-1.5 ${booked ? "text-white/28" : "text-white/75"}`}>
                            <IconClock />
                            <span className="text-xs font-semibold">{slotLabel}</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${booked ? "bg-white/18" : "bg-emerald-400"}`} />
                        </div>

                        {isNextDay && (
                          <div className="text-white/25 text-xs mb-2">({L.nextDay})</div>
                        )}

                        {/* Action */}
                        {booked ? (
                          <div className="flex items-center justify-between">
                            <span className="text-white/25 text-xs font-medium">{L.booked}</span>
                            <button
                              onClick={() => handleCancel(h)}
                              className="btn-ghost-red px-2.5 py-1.5 rounded-lg text-xs font-medium"
                            >
                              {L.cancel}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBookSlot(h)}
                            className="btn-emerald w-full py-2.5 rounded-xl text-xs"
                          >
                            {L.book} · {PRICE_GEL} GEL
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="relative z-10 divider border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400"
                 style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <IconRacket size={16} />
            </div>
            <span className="text-white/30 text-sm font-semibold tracking-wide">SAIRME PADEL</span>
          </div>
          <p className="text-white/18 text-xs">© {new Date().getFullYear()} Sairme Padel · React + Tailwind</p>
        </div>
      </footer>
    </div>
  );
}
