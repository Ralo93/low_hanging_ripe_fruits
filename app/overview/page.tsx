"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";

const points = [
  ["cluster-a", "18%", "48%"],
  ["cluster-a", "22%", "41%"],
  ["cluster-a", "26%", "55%"],
  ["cluster-a", "30%", "35%"],
  ["cluster-a", "34%", "46%"],
  ["cluster-a", "38%", "58%"],
  ["cluster-a", "42%", "39%"],
  ["cluster-a", "46%", "51%"],
  ["cluster-b", "52%", "26%"],
  ["cluster-b", "57%", "35%"],
  ["cluster-b", "62%", "22%"],
  ["cluster-b", "66%", "42%"],
  ["cluster-b", "70%", "31%"],
  ["cluster-b", "75%", "48%"],
  ["cluster-c", "25%", "74%"],
  ["cluster-c", "34%", "79%"],
  ["cluster-c", "43%", "70%"],
  ["cluster-c", "51%", "82%"],
  ["cluster-c", "59%", "73%"],
  ["cluster-c", "65%", "85%"],
] as const;

export default function OverviewPage() {
  const { lang } = useLanguage();
  const tr = t(lang);
  const chartGroups = [
    {
      title: tr.overviewTimeChart,
      color: "a",
      items: [
        { label: tr.painMonthlyTimeUnderOne, value: 8 },
        { label: tr.painMonthlyTimeOneToThree, value: 15 },
        { label: tr.painMonthlyTimeFourToEight, value: 18 },
        { label: tr.painMonthlyTimeNineToTwenty, value: 11 },
        { label: tr.painMonthlyTimeOverTwenty, value: 5 },
      ],
    },
    {
      title: tr.overviewFrequencyChart,
      color: "b",
      items: [
        { label: tr.painFrequencyDaily, value: 9 },
        { label: tr.painFrequencyWeekly, value: 26 },
        { label: tr.painFrequencyMonthly, value: 15 },
        { label: tr.painFrequencyIrregular, value: 7 },
      ],
    },
    {
      title: tr.overviewFrictionChart,
      color: "c",
      items: [
        { label: tr.painFrictionRepetition, value: 38 },
        { label: tr.painFrictionWaiting, value: 22 },
        { label: tr.painFrictionHandoffs, value: 29 },
        { label: tr.painFrictionErrors, value: 17 },
        { label: tr.painFrictionSearching, value: 34 },
      ],
    },
  ];

  return (
    <main className="overview-page">
      <header className="overview-header">
        <div>
          <div className="section-kicker">{tr.overviewKicker}</div>
          <h1>{tr.overviewTitle}</h1>
          <p>{tr.overviewDescription}</p>
        </div>
        <Link className="secondary overview-new-entry" href="/">
          <span aria-hidden="true">+</span>
          {tr.overviewNewEntry}
        </Link>
      </header>

      <section className="overview-summary" aria-label={tr.overviewMapLabel}>
        <div className="overview-summary-item">
          <strong>57</strong>
          <span>{tr.overviewEntries}</span>
        </div>
        <div className="overview-summary-item">
          <strong>3</strong>
          <span>{tr.overviewClusters}</span>
        </div>
        <div className="overview-summary-note">{tr.overviewNote}</div>
      </section>

      <section className="overview-map-section">
        <div className="overview-map" role="img" aria-label={tr.overviewMapLabel}>
          <span className="overview-axis overview-axis--x">{tr.overviewAxisX}</span>
          <span className="overview-axis overview-axis--y">{tr.overviewAxisY}</span>
          <span className="overview-cluster-label overview-cluster-label--a">{tr.overviewClusterOne}</span>
          <span className="overview-cluster-label overview-cluster-label--b">{tr.overviewClusterTwo}</span>
          <span className="overview-cluster-label overview-cluster-label--c">{tr.overviewClusterThree}</span>
          {points.map(([cluster, left, top], index) => (
            <i
              className={`overview-point ${cluster}`}
              key={`${cluster}-${index}`}
              style={{ left, top }}
            />
          ))}
        </div>

        <div className="overview-stat-charts">
          {chartGroups.map((group) => {
            const maxValue = Math.max(...group.items.map((item) => item.value));

            return (
              <section className="overview-chart" key={group.title}>
                <h2>{group.title}</h2>
                {group.items.map((item) => (
                  <div className="overview-bar-row" key={item.label}>
                    <div className="overview-bar-label">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="overview-bar-track" aria-hidden="true">
                      <div
                        className={`overview-bar-fill overview-bar-fill--${group.color}`}
                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
