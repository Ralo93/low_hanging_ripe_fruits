"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { track } from "@/lib/track";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import ShareResults from "@/components/ShareResults";

type DimensionRow = {
  dimension: string;
  user: number;
};

type ResultsDetailProps = {
  chartData: DimensionRow[];
  assessments: Record<string, string>;
  persona: string;
  lang?: Lang;
};

export default function ResultsDetail({
  chartData,
  assessments,
  persona,
  lang = "en",
}: ResultsDetailProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const tr = t(lang);

  useEffect(() => {
    track("results_viewed");
    const enteredAt = Date.now();
    function handleExit() {
      const seconds = Math.round((Date.now() - enteredAt) / 1000);
      track("results_exit", { time_on_page: seconds });
    }
    window.addEventListener("beforeunload", handleExit);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleExit();
    });
    return () => {
      window.removeEventListener("beforeunload", handleExit);
    };
  }, []);

  function toggle(dimension: string) {
    setOpen((prev) => (prev === dimension ? null : dimension));
  }

  async function copyPersona() {
    await navigator.clipboard.writeText(persona);
    track("prompt_copied");
    setCopied(true);
  }

  return (
    <>
      {/* Prompt section — primary action, shown first */}
      {persona && (
        <div className="stats-card complement-card" style={{ marginTop: 16 }}>
          <h2>{tr.yourThinkingPartner}</h2>
          <p className="complement-intro">{tr.promptIntro}</p>
          <div className="complement-text">
            <ReactMarkdown>{persona}</ReactMarkdown>
          </div>
          <button
            className={`copy-prompt-btn${copied ? " copied" : ""}`}
            onClick={copyPersona}
          >
            {copied ? tr.copiedBtn : `📋 ${tr.copyBtn}`}
          </button>
          <p className="privacy-note" style={{ marginTop: 10 }}>
            {tr.englishNote}
          </p>

          {/* Share nudge appears after copy */}
          {copied && (
            <div className="share-nudge">
              <p className="share-nudge-text">{tr.shareNudge}</p>
              <ShareResults lang={lang} />
            </div>
          )}
        </div>
      )}

      {/* Scores accordion — secondary detail */}
      <div className="stats-card" style={{ marginTop: 16 }}>
        <h2>{tr.yourScores}</h2>
        <div className="stats-grid">
          {chartData.map((row) => (
            <div key={row.dimension}>
              <button
                className="dimension-row-btn"
                onClick={() => toggle(row.dimension)}
                aria-expanded={open === row.dimension}
              >
                <span>{row.dimension}</span>
                <span className="dimension-row-right">
                  <strong>{row.user}</strong>
                  <span className="dimension-chevron">
                    {open === row.dimension ? "▲" : "▼"}
                  </span>
                </span>
              </button>

              {open === row.dimension && (
                <div className="dimension-assessment">
                  {assessments[row.dimension]
                    ? <ReactMarkdown>{assessments[row.dimension]}</ReactMarkdown>
                    : <span style={{ opacity: 0.5 }}>{lang === "en" ? "No assessment available." : "Keine Einschätzung verfügbar."}</span>
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
