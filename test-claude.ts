/**
 * Run with:  npx tsx test-claude.ts
 */
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// Load .env.local (Next.js doesn't do this for standalone scripts)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODELS = [
  "claude-opus-4-6",
];

const SAMPLE_SCORES = {
  Offenheit: 11,
  Gewissenhaftigkeit: 10,
  Extraversion: 8,
  "Umgänglichkeit": 9,
  Neurotizismus: 5,
};

const REFERENCE_RANGES: Record<string, [number, number]> = {
  Offenheit:          [9,   13  ],
  Gewissenhaftigkeit: [8.5, 13.5],
  Extraversion:       [6,   12  ],
  "Umgänglichkeit":   [8,   13  ],
  Neurotizismus:      [1,   8.5 ],
};

function pass(msg: string) { console.log(`  ✓ ${msg}`); }
function fail(msg: string) { console.log(`  ✗ ${msg}`); }
function section(msg: string) { console.log(`\n── ${msg}`); }

// ─── 1. Env var ────────────────────────────────────────────────────────────
section("1. Environment");
if (process.env.ANTHROPIC_API_KEY) {
  pass(`ANTHROPIC_API_KEY present (${process.env.ANTHROPIC_API_KEY.slice(0, 16)}…)`);
} else {
  fail("ANTHROPIC_API_KEY missing");
  process.exit(1);
}

// ─── 2. Prompt files ───────────────────────────────────────────────────────
section("2. Prompt files");
for (const file of ["assessment.md", "persona.md"]) {
  const p = path.join(process.cwd(), "prompts", file);
  if (fs.existsSync(p)) {
    pass(`prompts/${file} exists`);
  } else {
    fail(`prompts/${file} MISSING`);
  }
}

async function runTests() {
  // ─── 3. Model availability ─────────────────────────────────────────────────
  section("3. Model availability (ping each model)");
  for (const model of MODELS) {
    try {
      const res = await client.messages.create({
        model,
        max_tokens: 10,
        messages: [{ role: "user", content: "Say OK" }],
      });
      pass(`${model} → "${res.content.map((b: Anthropic.ContentBlock) => b.type === "text" ? b.text : "").join("").trim()}"`);
    } catch (err: unknown) {
      const e = err as { status?: number; error?: unknown; message?: string };
      fail(`${model} → status=${e.status} error=${JSON.stringify(e.error)} message=${e.message}`);
    }
  }

  // ─── 4. Assessment generation ──────────────────────────────────────────────
  section("4. generateAssessment (Offenheit, score=11)");
  try {
    const [min, max] = REFERENCE_RANGES["Offenheit"];
    const score = SAMPLE_SCORES["Offenheit"];

    function placement(s: number, mn: number, mx: number) {
      if (s < mn) return "unter dem Normbereich";
      if (s > mx) return "über dem Normbereich";
      return "im Normbereich";
    }
    function position(s: number, mn: number, mx: number) {
      if (s < mn || s > mx) return "–";
      const rel = (s - mn) / (mx - mn);
      if (rel <= 0.33) return "unteres Drittel";
      if (rel <= 0.67) return "mittleres Drittel";
      return "oberes Drittel";
    }

    const prompt = fs.readFileSync(path.join(process.cwd(), "prompts", "assessment.md"), "utf-8")
      .replace("{{DIMENSION}}", "Offenheit")
      .replace("{{SCORE}}", String(score))
      .replace("{{RANGE_MIN}}", String(min))
      .replace("{{RANGE_MAX}}", String(max))
      .replace("{{PLACEMENT}}", placement(score, min, max))
      .replace("{{POSITION}}", position(score, min, max));

    const msg = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content.filter((b: Anthropic.ContentBlock) => b.type === "text").map((b: Anthropic.ContentBlock) => (b as Anthropic.TextBlock).text).join("");
    pass(`Got response (${text.split(" ").length} words):\n\n${text}\n`);
  } catch (err: unknown) {
    const e = err as { status?: number; error?: unknown; message?: string };
    fail(`status=${e.status}\nerror=${JSON.stringify(e.error, null, 2)}\nmessage=${e.message}`);
  }

  // ─── 5. Persona generation ─────────────────────────────────────────────────
  section("5. generatePersona (Operator + Skeptic)");
  try {
    const prompt = fs.readFileSync(path.join(process.cwd(), "prompts", "persona.md"), "utf-8")
      .replace("{{PRIMARY_NAME}}", "The Operator")
      .replace("{{PRIMARY_BIAS}}", "Execution, speed, pragmatism")
      .replace("{{PRIMARY_QUESTION}}", "What's the next concrete step?")
      .replace("{{PRIMARY_DESCRIPTION}}", "Direct, action-oriented, low tolerance for overthinking.")
      .replace("{{SECONDARY_NAME}}", "The Skeptic")
      .replace("{{SECONDARY_BIAS}}", "Critical thinking, falsification")
      .replace("{{SECONDARY_QUESTION}}", "What's wrong or missing here?")
      .replace("{{SECONDARY_DESCRIPTION}}", "Calm, sharp, slightly contrarian.")
      .replace("{{OFFENHEIT}}", String(SAMPLE_SCORES["Offenheit"]))
      .replace("{{GEWISSENHAFTIGKEIT}}", String(SAMPLE_SCORES["Gewissenhaftigkeit"]))
      .replace("{{EXTRAVERSION}}", String(SAMPLE_SCORES["Extraversion"]))
      .replace("{{UMGAENGLICHKEIT}}", String(SAMPLE_SCORES["Umgänglichkeit"]))
      .replace("{{NEUROTIZISMUS}}", String(SAMPLE_SCORES["Neurotizismus"]));

    const msg = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content.filter((b: Anthropic.ContentBlock) => b.type === "text").map((b: Anthropic.ContentBlock) => (b as Anthropic.TextBlock).text).join("");
    pass(`Got response (${text.split(" ").length} words):\n\n${text}\n`);
  } catch (err: unknown) {
    const e = err as { status?: number; error?: unknown; message?: string };
    fail(`status=${e.status}\nerror=${JSON.stringify(e.error, null, 2)}\nmessage=${e.message}`);
  }

  console.log("\nDone.\n");
}

runTests();
