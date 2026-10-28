import type { AiMatch } from "@/lib/ai-profiles";

type Props = {
  matches: AiMatch[];
};

export default function AiComparison({ matches }: Props) {
  return (
    <div className="stats-card ai-comparison" style={{ marginTop: 16 }}>
      <h2>Welche KI passt zu dir?</h2>
      <p className="complement-intro">
        Ähnliche KIs eignen sich gut für persönliche Themen. Ergänzende KIs fordern dein Denken heraus.
      </p>
      <div className="ai-cards">
        {matches.map(({ profile, similarity, role }) => (
          <div key={profile.id} className={`ai-card${role ? ` ai-card--${role}` : ""}`}>
            <div className="ai-card-header">
              <span className="ai-card-emoji">{profile.emoji}</span>
              <span className="ai-card-name">{profile.name}</span>
              {role === "similar" && <span className="ai-badge ai-badge--similar">Ähnlich</span>}
              {role === "complement" && <span className="ai-badge ai-badge--complement">Ergänzend</span>}
            </div>
            <div className="ai-card-bar-wrap">
              <div className="ai-card-bar" style={{ width: `${similarity}%` }} />
            </div>
            <span className="ai-card-pct">{similarity}% Übereinstimmung</span>
            <p className="ai-card-hint">
              {role === "similar"
                ? "Für persönliche Aufgaben, Ideen & alltägliche Fragen."
                : role === "complement"
                ? "Für Problemlösung & kritisches Denken."
                : "Ausgewogene Mischung aus beidem."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
