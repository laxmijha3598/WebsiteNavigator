export default function WebViewer({ currentUrl }) {
  if (!currentUrl) {
    return (
      <div className="web-viewer web-viewer--empty">
        <p className="web-viewer-placeholder">
          Upload a file or import a Google Sheet to preview a website. Try{" "}
          <code>https://example.com</code> or <code>https://github.com</code> in
          your sheet — some sites block iframe embedding.
        </p>
      </div>
    );
  }

  return (
    <div className="web-viewer">
      <iframe
        title="Website preview"
        src={currentUrl}
        className="web-viewer-iframe"
      />
    </div>
  );
}
