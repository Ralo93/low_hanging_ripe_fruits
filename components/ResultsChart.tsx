"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartRow = {
  dimension: string;
  user: number;
};

type ResultsChartProps = {
  data: ChartRow[];
  lang?: "en" | "de";
};

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

export default function ResultsChart({ data, lang = "en" }: ResultsChartProps) {
  const chartData = data.map((row) => {
    const [min, max] = REFERENCE_RANGES[row.dimension] ?? [0, 0];
    return {
      ...row,
      rangeMin: min,
      rangeDiff: max - min,
    };
  });

  return (
    <div className="chart-card">
      <h2>{lang === "en" ? "Result" : "Ergebnis"}</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dimension"
              angle={-35}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12 }}
              height={70}
            />
            <YAxis domain={[0, 14]} ticks={[0, 2, 4, 6, 8, 10, 12, 14]} />
            <Tooltip formatter={(value, name) => [value, name === "user" ? (lang === "en" ? "You" : "Du") : name]} />
            <Legend formatter={(value) => (value === "user" ? (lang === "en" ? "You" : "Du") : value)} />
            {/* Grey reference band */}
            <Area
              type="monotone"
              dataKey="rangeMin"
              stackId="band"
              fill="transparent"
              stroke="none"
              legendType="none"
              tooltipType="none"
            />
            <Area
              type="monotone"
              dataKey="rangeDiff"
              stackId="band"
              fill="#c8c8c8"
              fillOpacity={0.5}
              stroke="#c8c8c8"
              strokeOpacity={0.8}
              strokeWidth={1}
              name={lang === "en" ? "Normal range" : "Normbereich"}
            />
            {/* User score line */}
            <Line
              type="monotone"
              dataKey="user"
              strokeWidth={3}
              dot={{ r: 5 }}
              stroke="#111"
              name="user"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
