"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  explanation: string;
  lang?: "en" | "de";
};

export default function PartnerExplanation({ explanation, lang = "en" }: Props) {
  if (!explanation) return null;

  return (
    <div className="stats-card" style={{ marginTop: 16 }}>
      <h2>{lang === "en" ? "Which AI fits you?" : "Welche KI passt zu dir?"}</h2>
      <div className="partner-explanation">
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
}
