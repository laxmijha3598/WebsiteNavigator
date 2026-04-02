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

## Notes

- Google Sheet must be publicly accessible.
- Some websites block rendering in iframes due to security headers (`X-Frame-Options` / CSP).
