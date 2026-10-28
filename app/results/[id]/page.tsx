import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { buildChartData } from "@/lib/scoring";
import { generateAssessment, generatePersona, generatePartnerExplanation } from "@/lib/claude";
import ResultsChart from "@/components/ResultsChart";
import ResultsDetail from "@/components/ResultsDetail";
import PartnerExplanation from "@/components/PartnerExplanation";
import FullTestCTA from "@/components/FullTestCTA";
import type { DimensionScores } from "@/lib/scoring";
import { DIMENSION_LABELS_EN } from "@/lib/questions";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type ResultPageProps = {
  params: Promise<{ id: string }>;
};

type CachedContent = {
  partner_explanation: string;
  persona: string;
  assessments: Record<string, string>;
};

const DIMENSION_NAMES_DE = [
  "Offenheit",
  "Gewissenhaftigkeit",
  "Extraversion",
  "Umgänglichkeit",
  "Neurotizismus",
] as const;

const DIMENSION_NAMES_EN = [
  "Openness",
  "Conscientiousness",
  "Extraversion",
  "Agreeableness",
  "Neuroticism",
] as const;

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;
  const tr = t(lang);

  const { data: submission, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !submission) notFound();

  const userScores: DimensionScores = {
    dimension1: Number(submission.dimension1_score),
    dimension2: Number(submission.dimension2_score),
    dimension3: Number(submission.dimension3_score),
    dimension4: Number(submission.dimension4_score),
    dimension5: Number(submission.dimension5_score),
  };

  const scoresByNameDE: Record<string, number> = {
    Offenheit:          userScores.dimension1,
    Gewissenhaftigkeit: userScores.dimension2,
    Extraversion:       userScores.dimension3,
    "Umgänglichkeit":   userScores.dimension4,
    Neurotizismus:      userScores.dimension5,
  };

  const dimensionNames = lang === "en" ? DIMENSION_NAMES_EN : DIMENSION_NAMES_DE;
  const dimLabels = lang === "en" ? DIMENSION_LABELS_EN : undefined;
  const chartData = buildChartData(userScores, dimLabels);

  const scoresByDimName: Record<string, number> = {
    [dimensionNames[0]]: userScores.dimension1,
    [dimensionNames[1]]: userScores.dimension2,
    [dimensionNames[2]]: userScores.dimension3,
    [dimensionNames[3]]: userScores.dimension4,
    [dimensionNames[4]]: userScores.dimension5,
  };

  // --- LLM cache ---
  const cached: CachedContent | undefined = submission.generated_content?.[lang];

  let partnerExplanation: string;
  let persona: string;
  let assessments: Record<string, string>;

  if (cached?.partner_explanation && cached?.persona && cached?.assessments) {
    partnerExplanation = cached.partner_explanation;
    persona = cached.persona;
    assessments = cached.assessments;
  } else {
    const [assessmentTexts, generatedExplanation] = await Promise.all([
      Promise.all(dimensionNames.map((dim) => generateAssessment(dim, scoresByDimName[dim], lang))),
      generatePartnerExplanation(scoresByNameDE, lang),
    ]);

    partnerExplanation = generatedExplanation;
    persona = await generatePersona(partnerExplanation);

    assessments = {};
    dimensionNames.forEach((dim, i) => {
      assessments[dim] = assessmentTexts[i];
    });

    // Store in cache (fire-and-forget — don't block the response)
    const existingContent = submission.generated_content ?? {};
    supabase.from("submissions").update({
      generated_content: {
        ...existingContent,
        [lang]: { partner_explanation: partnerExplanation, persona, assessments },
      },
    }).eq("id", id).then(() => {});
  }

  return (
    <main>
      <div className="result-intro">
        <h1>{tr.resultTitle}</h1>
      </div>

      {/* 1. Visual chart */}
      <ResultsChart data={chartData} lang={lang} />

      {/* 2. How your AI complements you — the core value */}
      <PartnerExplanation explanation={partnerExplanation} lang={lang} />

      {/* 3. Your thinking partner prompt + scores accordion */}
      <ResultsDetail
        chartData={chartData}
        assessments={assessments}
        persona={persona}
        lang={lang}
      />

      {/* 4. Demand capture */}
      <FullTestCTA lang={lang} />

      <p className="source-line">{tr.sourceLabel} Samuel D. Gosling, Peter J. Rentfrow und William B. Swann jun. „A Very Brief Measure of the Big Five Personality Domains", Journal of Research in Personality 37 (2003): 504–528</p>
    </main>
  );
}
