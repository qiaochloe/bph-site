"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  hints: {
    label: "Hints",
    // color: "#fb923c",
  },
  guesses: {
    label: "Guesses",
    // color: "#4CAF50",
  },
} satisfies ChartConfig;

export type ActivityItem = { hour: number; hints: number; guesses: number };

type ChartProps = {
  activityData: ActivityItem[];
};

export function ActivityChart({ activityData }: ChartProps) {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={activityData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value * 1000).getDate().toString()}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="hints"
          type="monotone"
          stroke="#4CAF50"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="guesses"
          type="monotone"
          stroke="#fb923c"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
