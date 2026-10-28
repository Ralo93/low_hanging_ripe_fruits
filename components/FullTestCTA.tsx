"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export default function FullTestCTA({ lang = "en" }: { lang?: Lang }) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const tr = t(lang);

  function handleExpand() {
    track("full_test_cta_clicked");
    setExpanded(true);
  }

  function handleVote() {
    track("wants_full_version");
    setVoted(true);
  }

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setEmailState("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      track("email_submitted");
      setEmailState("success");
    } catch {
      setEmailState("error");
    }
  }

  return (
    <div className="full-test-cta-card">
      <p className="full-test-note">{tr.fullTestNote}</p>

      {!expanded ? (
        <button className="full-test-expand-btn" onClick={handleExpand}>
          {tr.fullTestCTA}
        </button>
      ) : (
        <div className="full-test-expanded">
          <p className="full-test-expanded-title">{tr.fullTestExpanded}</p>
          <p className="full-test-expanded-sub">{tr.fullTestExpandedSub}</p>

          {!voted && (
            <button className="full-test-vote-btn" onClick={handleVote}>
              {tr.fullTestVoteBtn}
            </button>
          )}
          {voted && <p className="full-test-voted">{tr.fullTestVoted}</p>}

          {emailState === "success" ? (
            <p className="full-test-voted" style={{ marginTop: 12 }}>{tr.notifySuccess}</p>
          ) : (
            <form className="waitlist-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                className="waitlist-input"
                placeholder={tr.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailState === "submitting"}
              />
              <button
                type="submit"
                className="waitlist-submit-btn"
                disabled={emailState === "submitting" || !email.includes("@")}
              >
                {emailState === "submitting" ? tr.notifySubmitting : tr.notifyBtn}
              </button>
              {emailState === "error" && (
                <p className="waitlist-error">{tr.notifyError}</p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
