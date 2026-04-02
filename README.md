# MERN Stack Assignment: Website Navigator

This project lets users upload Excel/CSV files or import a public Google Sheets URL, extracts website URLs, and navigates them with Previous/Next controls.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Optional (not required for current flow)

## Project Structure

- `frontend/` React UI
- `backend/` Express API for file/sheet parsing

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## API Endpoints

- `POST /upload` — assignment route; same behavior as below (form-data key `file`)
- `POST /api/upload` with form-data key `file` (`.xlsx`, `.xls`, `.csv`)
- `POST /api/google-sheet` with JSON body:

```json
{
  "sheetUrl": "https://docs.google.com/spreadsheets/d/<sheet-id>/edit"
}
```

## Deploy frontend on Vercel

The React app lives in `frontend/`. Vercel does not run your Express server long-term the same way a VPS does, so **deploy the API separately** (e.g. [Render](https://render.com), [Railway](https://railway.app)) and point the UI at it.

1. Push this repo to GitHub (if you have not already).
2. In [Vercel](https://vercel.com) → **Add New** → **Project** → **Import** your repository.
3. **Root Directory**: set to `frontend` (click Edit and choose the `frontend` folder).
4. Framework Preset should detect **Vite**. Build command `npm run build`, output `dist` — the included `frontend/vercel.json` matches this.
5. **Environment Variables** (Production):
   - `VITE_API_URL` = your backend’s public URL, e.g. `https://website-navigator-api.onrender.com`  
   - Use **https**, no trailing slash.
6. Deploy. After the API URL is known, add or update `VITE_API_URL` and **Redeploy** so the bundle is rebuilt with the correct API address.

Local check before shipping: from `frontend`, run `npm run build` with `VITE_API_URL` set the same way you will use on Vercel.

See `frontend/.env.example` for the variable name.

## Notes

- Google Sheet must be publicly accessible.
- Some websites block rendering in iframes due to security headers (`X-Frame-Options` / CSP).
