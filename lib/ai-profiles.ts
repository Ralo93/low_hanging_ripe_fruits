// Approximate Big Five profiles for major AI assistants (scale 2–14)
// Based on observable traits: verbosity, agreeableness, creativity, structure, stability

export type AiProfile = {
  id: string;
  name: string;
  emoji: string;
  scores: {
    Offenheit: number;
    Gewissenhaftigkeit: number;
    Extraversion: number;
    Umgänglichkeit: number;
    Neurotizismus: number;
  };
};

export const AI_PROFILES: AiProfile[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    emoji: "🤖",
    scores: {
      Offenheit:          11,
      Gewissenhaftigkeit: 11,
      Extraversion:       12,
      Umgänglichkeit:     13,
      Neurotizismus:       2,
    },
  },
  {
    id: "gemini",
    name: "Gemini",
    emoji: "✦",
    scores: {
      Offenheit:          13,
      Gewissenhaftigkeit: 10,
      Extraversion:       10,
      Umgänglichkeit:     11,
      Neurotizismus:       2,
    },
  },
  {
    id: "claude",
    name: "Claude",
    emoji: "◆",
    scores: {
      Offenheit:          12,
      Gewissenhaftigkeit: 12,
      Extraversion:        8,
      Umgänglichkeit:     10,
      Neurotizismus:       2,
    },
  },
];

const DIMS = ["Offenheit", "Gewissenhaftigkeit", "Extraversion", "Umgänglichkeit", "Neurotizismus"] as const;
const MAX_DISTANCE = Math.sqrt(DIMS.length * 12 * 12); // max possible Euclidean distance

export type AiMatch = {
  profile: AiProfile;
  similarity: number; // 0–100
  role: "similar" | "complement" | null;
};

export function computeAiMatches(userScores: Record<string, number>): AiMatch[] {
  const matches = AI_PROFILES.map((ai) => {
    const distSq = DIMS.reduce((sum, dim) => {
      return sum + Math.pow((userScores[dim] ?? 7) - ai.scores[dim], 2);
    }, 0);
    const similarity = Math.round((1 - Math.sqrt(distSq) / MAX_DISTANCE) * 100);
    return { profile: ai, similarity, role: null as AiMatch["role"] };
  });

  // Sort by similarity descending
  matches.sort((a, b) => b.similarity - a.similarity);
  matches[0].role = "similar";
  matches[matches.length - 1].role = "complement";

  return matches;
}
