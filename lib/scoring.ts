import { DIMENSION_LABELS, DimensionKey } from "@/lib/questions";

export type Answers = Record<number, number>;

export type DimensionScores = Record<DimensionKey, number>;

export type ChartRow = {
  dimension: string;
  user: number;
};

const DIMENSIONS: DimensionKey[] = [
  "dimension1",
  "dimension2",
  "dimension3",
  "dimension4",
  "dimension5",
];

export function calculateDimensionScores(answers: Answers): DimensionScores {
  return {
    dimension1: answers[5]  + (8 - answers[10]), // Offenheit
    dimension2: answers[3]  + (8 - answers[8]),  // Gewissenhaftigkeit
    dimension3: answers[1]  + (8 - answers[6]),  // Extraversion
    dimension4: answers[7]  + (8 - answers[2]),  // Umgänglichkeit
    dimension5: answers[4]  + (8 - answers[9]),  // Neurotizismus
  };
}

export function buildChartData(
  userScores: DimensionScores,
  labels?: Partial<Record<DimensionKey, string>>
): ChartRow[] {
  return DIMENSIONS.map((dimension) => ({
    dimension: labels?.[dimension] ?? DIMENSION_LABELS[dimension],
    user: roundToOne(userScores[dimension]),
  }));
}

export function roundToOne(value: number): number {
  return Math.round(value * 10) / 10;
}
