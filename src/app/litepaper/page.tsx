import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Litepaper — Serenith",
  description: "Read the Serenith Technical Litepaper in the PDF viewer.",
};

const litepaperPdf = "/Serenith%20Technical%20Litepaper.pdf";

export default function Litepaper() {
  return (
    <main className="paper-page">
      <a className="back-link" href="/">
        ← Back to Serenith
      </a>
      <header className="paper-header">
        <div>
          <span className="eyebrow">SERENITH / TECHNICAL LITEPAPER</span>
          <h1>Technical litepaper</h1>
        </div>
        <div className="paper-actions">
          <a
            className="button button-secondary"
            href={litepaperPdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open PDF ↗
          </a>
          <a
            className="button button-primary"
            href={litepaperPdf}
            download="Serenith Technical Litepaper.pdf"
          >
            Download PDF ↓
          </a>
        </div>
      </header>
      <iframe
        className="paper-viewer"
        src={`${litepaperPdf}#view=FitH`}
        title="Serenith Technical Litepaper PDF viewer"
      />
      <p className="paper-viewer-help">
        If the PDF preview is unavailable in your browser, use Open PDF or
        Download PDF to read the document.
      </p>
    </main>
  );
}
