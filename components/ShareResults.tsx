"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export default function ShareResults({ lang = "en" }: { lang?: Lang }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const tr = t(lang);

  async function handleShare() {
    const url = window.location.origin;
    const shareText = lang === "en"
      ? "I just got a custom AI thinking partner built around my personality. Build yours:"
      : "Ich habe mir einen KI-Denkpartner gebaut, der meine blinden Flecken ausgleicht. Bau dir deinen:";

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Build your AI thinking partner", text: shareText, url });
        track("app_shared", { method: "native" });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    track("app_shared", { method: "clipboard" });
    setState("copied");
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button className="share-btn" onClick={handleShare}>
      {state === "copied" ? tr.shareCopied : tr.shareBtn}
    </button>
  );
}
