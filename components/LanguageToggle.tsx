"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      className="lang-toggle"
      onClick={() => setLang(lang === "en" ? "de" : "en")}
      aria-label="Toggle language"
    >
      {lang === "en" ? "DE" : "EN"}
    </button>
  );
}
