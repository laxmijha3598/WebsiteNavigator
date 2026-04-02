import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FileUpload({ onUrlsLoaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError("");
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

      onUrlsLoaded(data.urls || []);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Upload failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="file-upload-row">
        <label className="file-upload-label">
          <span className="file-upload-label-text">Choose file</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="file-upload-input"
          />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleUploadClick}
          disabled={!selectedFile || loading}
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </div>
      {selectedFile && (
        <p className="file-upload-meta">Selected: {selectedFile.name}</p>
      )}
      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
}
