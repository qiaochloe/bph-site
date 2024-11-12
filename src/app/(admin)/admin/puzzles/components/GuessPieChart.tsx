"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { GuessWithTeam } from "./GuessStatisticsInfo";

const chartColors = [
  "#7f3c8d",
  "#11a579",
  "#3969ac",
  "#f2b701",
  "#e73f74",
  "#80ba5a",
  "#e68310",
];

interface GuessPieChartProps {
  previousGuesses: GuessWithTeam[];
}

export default function GuessPieChart({ previousGuesses }: GuessPieChartProps) {
  const totalGuesses = previousGuesses
    .map((guess) => guess.guess)
    .reduce(
      (freq, guess) => {
        freq[guess] = (freq[guess] || 0) + 1;
        return freq;
      },
      {} as { [key: string]: number },
    );

  const pieData = Object.entries(totalGuesses)
    .sort(([, valueA], [, valueB]) => (valueA > valueB ? -1 : 1))
    .map(([key, value]) => ({ name: key, value }))
    .slice(0, 7);

  const chartConfig = pieData.reduce(
    (config, pieSlice, index) => {
      config[pieSlice.name] = {
        label: pieSlice.name,
        color: chartColors[index]!,
      };
      return config;
    },
    {} as Record<string, { label: string; color: string }>,
  ) satisfies ChartConfig;
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-2/3 max-w-lg"
    >
      <PieChart>
        <ChartTooltip />
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={160}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
