"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";

export default function HomePage() {
  const { lang } = useLanguage();
  const tr = t(lang);
  const router = useRouter();
  const [painPoint, setPainPoint] = useState("");
  const [userSolution, setUserSolution] = useState("");
  const [monthlyTime, setMonthlyTime] = useState("");
  const [frequency, setFrequency] = useState("");
  const [friction, setFriction] = useState<string[]>([]);
  const [tools, setTools] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    track("page_view");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!painPoint.trim() || !monthlyTime) {
      setError(tr.painError);
      return;
    }
    setError("");
    track("submitted");
    router.push("/overview");
  }

  function toggleFriction(value: string) {
    setFriction((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  }

  return (
    <main className="process-page">
      <section className="process-hero">
        <div className="hero-copy">
          <p className="eyebrow">{tr.painEyebrow}</p>
          <h1>{tr.painTitle}</h1>
          <p className="hero-desc">{tr.painIntro}</p>
          <div className="hero-signals" aria-label={tr.painSignalsLabel}>
            <span><strong>01</strong>{tr.painSignalOne}</span>
            <span><strong>02</strong>{tr.painSignalTwo}</span>
            <span><strong>03</strong>{tr.painSignalThree}</span>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">↗</div>
      </section>

      <section className="capture-layout">
        <form className="pain-form" onSubmit={handleSubmit}>
          <div className="section-kicker">01 / {tr.painFormKicker}</div>
          <label htmlFor="pain-point">{tr.painLabel}</label>
          <p className="field-description">{tr.painFieldDescription}</p>
          <textarea
            id="pain-point"
            value={painPoint}
            onChange={(e) => {
              setPainPoint(e.target.value);
              setError("");
            }}
            placeholder={tr.painPlaceholder}
            maxLength={2000}
            rows={9}
          />
          <div className="field-meta">
            <span>{tr.painPrompt}</span>
            <span>{painPoint.length} / 2000</span>
          </div>
          <div className="context-fields">
            <div className="context-field context-field--wide">
              <label htmlFor="monthly-time">{tr.painMonthlyTimeLabel}</label>
              <p>{tr.painMonthlyTimeDescription}</p>
              <select
                id="monthly-time"
                value={monthlyTime}
                onChange={(e) => {
                  setMonthlyTime(e.target.value);
                  setError("");
                }}
              >
                <option value="">{tr.painMonthlyTimePlaceholder}</option>
                <option value="under-1">{tr.painMonthlyTimeUnderOne}</option>
                <option value="1-3">{tr.painMonthlyTimeOneToThree}</option>
                <option value="4-8">{tr.painMonthlyTimeFourToEight}</option>
                <option value="9-20">{tr.painMonthlyTimeNineToTwenty}</option>
                <option value="over-20">{tr.painMonthlyTimeOverTwenty}</option>
              </select>
            </div>
            <div className="context-field">
              <label htmlFor="frequency">{tr.painFrequencyLabel}</label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="">{tr.painFrequencyPlaceholder}</option>
                <option value="daily">{tr.painFrequencyDaily}</option>
                <option value="weekly">{tr.painFrequencyWeekly}</option>
                <option value="monthly">{tr.painFrequencyMonthly}</option>
                <option value="irregular">{tr.painFrequencyIrregular}</option>
              </select>
            </div>
            <div className="context-field">
              <fieldset className="friction-fieldset">
                <legend>{tr.painFrictionLabel}</legend>
                <p>{tr.painFrictionDescription}</p>
                <div className="friction-options">
                  <label className="friction-option">
                    <input type="checkbox" checked={friction.includes("repetition")} onChange={() => toggleFriction("repetition")} />
                    <span>{tr.painFrictionRepetition}</span>
                  </label>
                  <label className="friction-option">
                    <input type="checkbox" checked={friction.includes("waiting")} onChange={() => toggleFriction("waiting")} />
                    <span>{tr.painFrictionWaiting}</span>
                  </label>
                  <label className="friction-option">
                    <input type="checkbox" checked={friction.includes("handoffs")} onChange={() => toggleFriction("handoffs")} />
                    <span>{tr.painFrictionHandoffs}</span>
                  </label>
                  <label className="friction-option">
                    <input type="checkbox" checked={friction.includes("errors")} onChange={() => toggleFriction("errors")} />
                    <span>{tr.painFrictionErrors}</span>
                  </label>
                  <label className="friction-option">
                    <input type="checkbox" checked={friction.includes("searching")} onChange={() => toggleFriction("searching")} />
                    <span>{tr.painFrictionSearching}</span>
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="context-field context-field--wide">
              <label htmlFor="tools">{tr.painToolsLabel}</label>
              <input
                id="tools"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder={tr.painToolsPlaceholder}
              />
            </div>
          </div>
          <label htmlFor="user-solution">{tr.painSolutionLabel}</label>
          <p className="field-description">{tr.painSolutionDescription}</p>
          <textarea
            id="user-solution"
            className="solution-textarea"
            value={userSolution}
            onChange={(e) => {
              setUserSolution(e.target.value);
            }}
            placeholder={tr.painSolutionPlaceholder}
            maxLength={1500}
            rows={5}
          />
          <div className="field-meta">
            <span>{tr.painSolutionPrompt}</span>
            <span>{userSolution.length} / 1500</span>
          </div>
          {error ? <div className="error-box">{error}</div> : null}
          <button className="primary process-submit" type="submit">
            {tr.painSubmit} <span aria-hidden="true">↗</span>
          </button>
          <p className="privacy-note">{tr.painPrivacy}</p>
        </form>
      </section>
    </main>
  );
}
