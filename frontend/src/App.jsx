import { useMemo, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import WebViewer from "./components/WebViewer";
import NavButtons from "./components/NavButtons";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [urls, setUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState("");

  const currentUrl = useMemo(
    () => urls[currentIndex] || "",
    [urls, currentIndex]
  );

  const handleUrlsLoaded = (nextUrls) => {
    setUrls(nextUrls);
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, urls.length - 1));
  };

  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl.trim()) return;

    setSheetLoading(true);
    setSheetError("");
    try {
      const { data } = await axios.post(`${API_BASE}/api/google-sheet`, {
        sheetUrl: googleSheetUrl.trim()
      });
      handleUrlsLoaded(data.urls || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Google Sheet import failed.";
      setSheetError(message);
    } finally {
      setSheetLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />

      <main className="app-main">
        <div className="app-container">
          <p className="app-intro">
            Upload Excel/CSV or import a public Google Sheet with URLs, then use
            Previous and Next to browse.
          </p>

          <section className="app-section" aria-label="File upload">
            <h2 className="app-section-title">Upload spreadsheet</h2>
            <FileUpload onUrlsLoaded={handleUrlsLoaded} />
          </section>

          <section className="app-section" aria-label="Google Sheets import">
            <h2 className="app-section-title">Or import Google Sheet</h2>
            <div className="sheet-import">
              <input
                type="url"
                className="sheet-import-input"
                placeholder="Paste public Google Sheets URL"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGoogleSheetImport}
                disabled={sheetLoading}
              >
                {sheetLoading ? "Importing…" : "Import Sheet"}
              </button>
            </div>
            {sheetError && <p className="sheet-import-error">{sheetError}</p>}
          </section>

          <NavButtons
            currentIndex={currentIndex}
            total={urls.length}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          <WebViewer currentUrl={currentUrl} />
        </div>
      </main>
    </div>
  );
}
