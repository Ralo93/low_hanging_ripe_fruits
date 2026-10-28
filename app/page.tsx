"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionBlock from "@/components/QuestionBlock";
import { QUESTIONS, QUESTIONS_EN } from "@/lib/questions";
import { track } from "@/lib/track";
import { useLanguage } from "@/components/LanguageContext";
import { t, SCALE_LABELS_EN, SCALE_LABELS_DE } from "@/lib/i18n";

type Answers = Record<number, number>;

function ScaleBar({ inline, lang }: { inline?: boolean; lang: "en" | "de" }) {
  const labels = lang === "en" ? SCALE_LABELS_EN : SCALE_LABELS_DE;
  if (inline) {
    return (
      <div className="scale-bar-inline">
        {labels.map(({ n, label }) => (
          <span key={n} className="scale-bar-item-label">{label}</span>
        ))}
      </div>
    );
  }
  return (
    <div className="scale-bar">
      <div className="scale-bar-track">
        {labels.map(({ n, label }) => (
          <div key={n} className="scale-bar-item">
            <span className="scale-bar-num">{n}</span>
            <span className="scale-bar-item-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = t(lang);
  const questions = lang === "en" ? QUESTIONS_EN : QUESTIONS;

  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mobileStep, setMobileStep] = useState(0);

  useEffect(() => {
    track("page_view");
  }, []);

  function updateAnswer(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function isFormComplete() {
    return questions.every((q) => typeof answers[q.id] === "number");
  }

  async function submitAnswers(finalAnswers: Answers) {
    setError("");
    setIsSubmitting(true);
    track("submitted");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: null,
          answers: finalAnswers,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Fehler beim Speichern.");
      router.push(`/results/${result.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  async function handleDesktopSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isFormComplete()) {
      setError(tr.errorAllQuestions);
      return;
    }
    await submitAnswers(answers);
  }

  function handleMobileAnswer(value: number) {
    const question = questions[mobileStep - 1];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    track("question_answered", { question_id: question.id, value });
    if (mobileStep < questions.length) {
      setMobileStep(mobileStep + 1);
    } else {
      submitAnswers(newAnswers);
    }
  }

  const currentMobileQuestion = mobileStep > 0 ? questions[mobileStep - 1] : null;

  return (
    <>
      {/* Desktop layout */}
      <main className="desktop-layout">
        <div className="hero-card">
          <h1>{tr.heroTitle}</h1>
          <p className="hero-sub">{tr.heroSub}</p>
          <p className="hero-desc">{tr.heroDesc}</p>
        </div>

        <form onSubmit={handleDesktopSubmit}>
          {error ? <div className="error-box">{error}</div> : null}

          <div className="question-list">
            {questions.map((question) => (
              <QuestionBlock
                key={question.id}
                questionNumber={question.id}
                text={question.text}
                value={answers[question.id]}
                questionLabel={tr.question}
                scaleLabels={lang === "en" ? SCALE_LABELS_EN : SCALE_LABELS_DE}
                onChange={(value) => {
                  updateAnswer(question.id, value);
                  track("question_answered", { question_id: question.id, value });
                }}
              />
            ))}
          </div>

          <div className="submit-row">
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? tr.submitting : tr.submitBtn}
            </button>
            <p className="privacy-note">{tr.privacyNote}</p>
          </div>
        </form>
        <p className="source-line">{tr.sourceLabel} Samuel D. Gosling, Peter J. Rentfrow und William B. Swann jun. „A Very Brief Measure of the Big Five Personality Domains", Journal of Research in Personality 37 (2003): 504–528</p>
      </main>

      {/* Mobile layout */}
      <main className="mobile-layout">
        {mobileStep === 0 && (
          <>
            <div className="hero-card">
              <h1>{tr.heroTitle}</h1>
              <p className="hero-sub">{tr.heroSub}</p>
              <p className="hero-desc">{tr.heroDesc}</p>
            </div>

            <div className="submit-row">
              <button className="primary" onClick={() => {
                track("started");
                setMobileStep(1);
              }}>
                {tr.startBtn}
              </button>
              <p className="privacy-note">{tr.privacyNote}</p>
            </div>
          </>
        )}

        {mobileStep > 0 && currentMobileQuestion && (
          <>
            <div className="mobile-question-header">
              <button
                className="mobile-back-btn"
                onClick={() => setMobileStep(mobileStep - 1)}
                disabled={isSubmitting}
                aria-label={tr.back}
              >
                ←
              </button>
              <span className="mobile-progress-label">
                {mobileStep} / {questions.length}
              </span>
            </div>

            <div className="mobile-progress-bar">
              <div
                className="mobile-progress-fill"
                style={{ width: `${(mobileStep / questions.length) * 100}%` }}
              />
            </div>

            {error ? <div className="error-box" style={{ marginTop: 16 }}>{error}</div> : null}

            <p className="mobile-question-text">{currentMobileQuestion.text}</p>

            <div className="answer-buttons">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  className={`answer-btn${answers[currentMobileQuestion.id] === n ? " selected" : ""}`}
                  onClick={() => handleMobileAnswer(n)}
                  disabled={isSubmitting}
                >
                  {n}
                </button>
              ))}
            </div>

            <ScaleBar inline lang={lang} />

            {isSubmitting && (
              <p style={{ textAlign: "center", marginTop: 24, opacity: 0.6 }}>
                {tr.submitting}
              </p>
            )}
          </>
        )}
        <p className="source-line">{tr.sourceLabel} Samuel D. Gosling, Peter J. Rentfrow und William B. Swann jun. „A Very Brief Measure of the Big Five Personality Domains", Journal of Research in Personality 37 (2003): 504–528</p>
      </main>
    </>
  );
}
