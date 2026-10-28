"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";

export default function PreviewPage() {
  const [voted, setVoted] = useState(false);
  const { lang } = useLanguage();
  const tr = t(lang);

  function handleVote() {
    track("wants_full_version");
    setVoted(true);
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "0 24px", textAlign: "center" }}>
      <p style={{ fontSize: "2.5rem", marginBottom: 8 }}>👀</p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>{tr.previewTitle}</h1>
      <p style={{ color: "#aaa", marginBottom: 32, maxWidth: 360 }}>
        {tr.previewSub}
      </p>

      {voted ? (
        <p style={{ fontSize: "1.1rem", color: "#7c6af7" }}>{tr.votedMsg}</p>
      ) : (
        <button className="primary" onClick={handleVote}>
          {tr.voteBtn}
        </button>
      )}

      <button
        onClick={() => window.history.back()}
        style={{ marginTop: 32, color: "#888", fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        {lang === "en" ? "← Back to results" : "← Zurück zu deinen Ergebnissen"}
      </button>
    </main>
  );
}
