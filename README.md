# Sairme Padel — React + Tailwind (Vite)

A ready-to-deploy web app for booking the Sairme padel court.

## Quick start (local)

1. Install Node.js 18+ from https://nodejs.org
2. In a terminal, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the shown local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
```
This will create a `dist/` folder.

## Deploy (no coding)

### Option A — Vercel (easiest)
1. Create a free account at https://vercel.com
2. Click "New Project" → "Import" → then choose:
   - **From Git**: push this folder to a GitHub repo and import it
   - **Or** "Deploy from Link": drag-and-drop this folder in Vercel CLI, or use the Vercel Desktop app.
3. Framework presets: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click Deploy. Done! Your app gets a public URL (you can add your custom domain).

### Option B — Netlify (also easy)
1. Create a free account at https://netlify.com
2. "Add new site" → "Import an existing project" (from GitHub) OR use "Deploy manually"
   - For manual: run `npm run build` locally, then drag the **dist/** folder into Netlify Drop https://app.netlify.com/drop
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy. Netlify gives you a public URL + custom domain support.

### Custom domain (e.g., padel.sairme.ge)
- On Vercel/Netlify project settings, add your domain.
- Create a CNAME DNS record pointing to your provider's target (Vercel/Netlify will show instructions).
- DNS can take 5–30 minutes to propagate.

## Notes
- This project bundles your uploaded `sairme_padel_full_web_app_react_tailwind.jsx` as the main app (see `src/App.jsx`).
- No server required; it’s a static SPA, perfect for Vercel/Netlify.
