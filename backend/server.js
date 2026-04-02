import express from "express";
import cors from "cors";
import multer from "multer";
import XLSX from "xlsx";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const normalizeUrl = (raw) => {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return null;
};

const extractUrlsFromRows = (rows) => {
  const urls = [];
  for (const row of rows) {
    const cells = Object.values(row);
    for (const cell of cells) {
      if (typeof cell === "string") {
        const maybe = normalizeUrl(cell);
        if (maybe) urls.push(maybe);
      }
    }
  }

  return [...new Set(urls)];
};

const parseWorkbookBuffer = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
  return extractUrlsFromRows(rows);
};

const toGoogleSheetCsvUrl = (inputUrl) => {
  try {
    const parsed = new URL(inputUrl);
    if (!parsed.hostname.includes("docs.google.com")) return null;
    const match = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
    if (!match) return null;
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  } catch {
    return null;
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required." });
  }

  try {
    const urls = parseWorkbookBuffer(req.file.buffer);
    return res.json({ urls });
  } catch (error) {
    return res.status(400).json({ message: "Unable to parse file.", error: error.message });
  }
};

app.post("/api/upload", upload.single("file"), handleFileUpload);
app.post("/upload", upload.single("file"), handleFileUpload);

app.post("/api/google-sheet", async (req, res) => {
  const { sheetUrl } = req.body;
  if (!sheetUrl) {
    return res.status(400).json({ message: "sheetUrl is required." });
  }

  const csvUrl = toGoogleSheetCsvUrl(sheetUrl);
  if (!csvUrl) {
    return res.status(400).json({ message: "Invalid Google Sheets URL." });
  }

  try {
    const response = await axios.get(csvUrl, { responseType: "arraybuffer" });
    const urls = parseWorkbookBuffer(Buffer.from(response.data));
    return res.json({ urls });
  } catch (error) {
    return res.status(400).json({ message: "Unable to fetch/parse Google Sheet.", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
