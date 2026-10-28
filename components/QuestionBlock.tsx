type ScaleLabel = { n: number; label: string };

type QuestionBlockProps = {
  questionNumber: number;
  text: string;
  value?: number;
  onChange: (value: number) => void;
  questionLabel?: string;
  scaleLabels?: ScaleLabel[];
};

export default function QuestionBlock({
  questionNumber,
  text,
  value,
  onChange,
  questionLabel = "Question",
  scaleLabels = [],
}: QuestionBlockProps) {
  return (
    <div className="question-card">
      <div className="question-label">
        <span className="question-number">{questionLabel} {questionNumber}</span>
        <span>{text}</span>
      </div>

      <div className="desktop-answer-buttons">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const label = scaleLabels.find((s) => s.n === n)?.label ?? "";
          return (
            <button
              key={n}
              type="button"
              className={`desktop-answer-btn${value === n ? " selected" : ""}`}
              onClick={() => onChange(n)}
            >
              <span className="desktop-answer-num">{n}</span>
              {label && <span className="desktop-answer-label">{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
