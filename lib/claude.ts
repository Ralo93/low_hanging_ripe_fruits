import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import type { Lang } from "@/lib/i18n";

const client = new Anthropic();

const REFERENCE_RANGES: Record<string, [number, number]> = {
  Offenheit:          [9,   13  ],
  Openness:           [9,   13  ],
  Gewissenhaftigkeit: [8.5, 13.5],
  Conscientiousness:  [8.5, 13.5],
  Extraversion:       [6,   12  ],
  Umgänglichkeit:     [8,   13  ],
  Agreeableness:      [8,   13  ],
  Neurotizismus:      [1,   8.5 ],
  Neuroticism:        [1,   8.5 ],
};

function loadPrompt(filename: string): string {
  return fs.readFileSync(path.join(process.cwd(), "prompts", filename), "utf-8");
}

function placement(score: number, min: number, max: number, lang: Lang): string {
  if (lang === "en") {
    if (score < min) return "below the normal range";
    if (score > max) return "above the normal range";
    return "within the normal range";
  }
  if (score < min) return "unter dem Normbereich";
  if (score > max) return "über dem Normbereich";
  return "im Normbereich";
}

function position(score: number, min: number, max: number, lang: Lang): string {
  if (score < min || score > max) return "–";
  const range = max - min;
  const relative = (score - min) / range;
  if (lang === "en") {
    if (relative <= 0.33) return "lower third (on the lower end within the norm)";
    if (relative <= 0.67) return "middle third (typical)";
    return "upper third (on the higher end within the norm)";
  }
  if (relative <= 0.33) return "unteres Drittel (eher niedrig innerhalb der Norm)";
  if (relative <= 0.67) return "mittleres Drittel (typisch)";
  return "oberes Drittel (eher hoch innerhalb der Norm)";
}

function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export async function generateAssessment(
  dimension: string,
  score: number,
  lang: Lang = "en"
): Promise<string> {
  try {
    const [min, max] = REFERENCE_RANGES[dimension] ?? [0, 14];
    const promptFile = lang === "en" ? "assessment.en.md" : "assessment.md";
    const prompt = loadPrompt(promptFile)
      .replace("{{DIMENSION}}", dimension)
      .replace("{{SCORE}}", String(score))
      .replace("{{RANGE_MIN}}", String(min))
      .replace("{{RANGE_MAX}}", String(max))
      .replace("{{PLACEMENT}}", placement(score, min, max, lang))
      .replace("{{POSITION}}", position(score, min, max, lang));

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    return extractText(message.content);
  } catch (err) {
    console.error("[generateAssessment] failed:", err);
    return "";
  }
}

export async function generatePartnerExplanation(
  scores: Record<string, number>,
  lang: Lang = "en"
): Promise<string> {
  try {
    const promptFile = lang === "en" ? "partner-explanation.en.md" : "partner-explanation.md";
    const prompt = loadPrompt(promptFile)
      .replace("{{OFFENHEIT}}", String(scores["Offenheit"]))
      .replace("{{GEWISSENHAFTIGKEIT}}", String(scores["Gewissenhaftigkeit"]))
      .replace("{{EXTRAVERSION}}", String(scores["Extraversion"]))
      .replace("{{UMGAENGLICHKEIT}}", String(scores["Umgänglichkeit"]))
      .replace("{{NEUROTIZISMUS}}", String(scores["Neurotizismus"]));

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    return extractText(message.content);
  } catch (err) {
    console.error("[generatePartnerExplanation] failed:", err);
    return "";
  }
}

export async function generatePersona(
  partnerExplanation: string
): Promise<string> {
  try {
    const prompt = loadPrompt("persona.md")
      .replace("{{PARTNER_EXPLANATION}}", partnerExplanation);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    return extractText(message.content);
  } catch (err) {
    console.error("[generatePersona] failed:", err);
    return "";
  }
}
