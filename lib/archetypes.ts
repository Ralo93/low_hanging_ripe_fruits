export type ArchetypeKey = "Operator" | "Skeptic" | "Strategist" | "Architect" | "Calibrator";

export type Archetype = {
  key: ArchetypeKey;
  name: string;
  bias: string;
  coreQuestion: string;
  description: string;
};

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  Operator: {
    key: "Operator",
    name: "The Operator",
    bias: "Execution, speed, pragmatism",
    coreQuestion: "What's the next concrete step?",
    description:
      "Direct, action-oriented, low tolerance for overthinking. Cuts through abstraction and pushes toward shipping. Forces decisions, reduces analysis paralysis, converts thinking into action.",
  },
  Skeptic: {
    key: "Skeptic",
    name: "The Skeptic",
    bias: "Critical thinking, falsification",
    coreQuestion: "What's wrong or missing here?",
    description:
      "Calm, sharp, slightly contrarian. Not negative — actively looking for weak points, blind spots, and hidden assumptions. Introduces friction, surfaces risks and edge cases, prevents naive decisions.",
  },
  Strategist: {
    key: "Strategist",
    name: "The Strategist",
    bias: "Long-term thinking, positioning",
    coreQuestion: "What actually matters over time?",
    description:
      "Zooms out, connects dots, thinks in systems, leverage, and second-order effects. Expands perspective, aligns decisions with long-term goals, reduces reactive thinking.",
  },
  Architect: {
    key: "Architect",
    name: "The Architect",
    bias: "Structure, clarity, systems",
    coreQuestion: "How do we make this coherent and repeatable?",
    description:
      "Organized, structured, turns messy ideas into usable systems. Imposes order, breaks things into steps, creates clarity and sequence.",
  },
  Calibrator: {
    key: "Calibrator",
    name: "The Calibrator",
    bias: "Balance, realism, emotional regulation",
    coreQuestion: "How big is this really, and what's proportional?",
    description:
      "Grounded, composed, not easily thrown off. Reduces emotional noise, reframes pressure, keeps decisions proportional.",
  },
};

// Midpoints of each dimension's norm range
const MIDPOINTS: Record<string, number> = {
  Offenheit:          11,   // norm 9–13
  Gewissenhaftigkeit: 11,   // norm 8.5–13.5
  Extraversion:       9,    // norm 6–12
  "Umgänglichkeit":   10.5, // norm 8–13
  Neurotizismus:      5,    // norm 1–9
};

export function selectArchetypes(
  scores: Record<string, number>
): [ArchetypeKey, ArchetypeKey] {
  const points: Record<ArchetypeKey, number> = {
    Operator:   0,
    Skeptic:    0,
    Strategist: 0,
    Architect:  0,
    Calibrator: 0,
  };

  if (scores["Offenheit"] > MIDPOINTS["Offenheit"]) {
    points.Operator++;
    points.Architect++;
  } else {
    points.Strategist++;
  }

  if (scores["Gewissenhaftigkeit"] > MIDPOINTS["Gewissenhaftigkeit"]) {
    points.Operator++;
  } else {
    points.Architect++;
  }

  if (scores["Umgänglichkeit"] > MIDPOINTS["Umgänglichkeit"]) {
    points.Skeptic++;
  } else {
    points.Calibrator++;
  }

  if (scores["Neurotizismus"] > MIDPOINTS["Neurotizismus"]) {
    points.Calibrator++;
  } else {
    points.Skeptic++;
  }

  if (scores["Extraversion"] > MIDPOINTS["Extraversion"]) {
    points.Skeptic++;
  } else {
    points.Operator++;
  }

  const sorted = (Object.entries(points) as [ArchetypeKey, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return [sorted[0][0], sorted[1][0]];
}
