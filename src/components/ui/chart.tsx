"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
} from "recharts";

interface ChartProps {
  data: { [key: string]: unknown }[];
  title: string;
  type: "line" | "bar" | "pie";
  xKey: string;
  yKey: string;
  colorKey?: string;
}

const RADIAN = Math.PI / 180;
interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function Chart({ data, title, type, xKey, yKey, colorKey }: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <XAxis
              dataKey={xKey}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={1}
              tickFormatter={(value) => value.split(":")[0]}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#adfa1d"
              strokeWidth={2}
            />
            <ReferenceLine
              x="14:00"
              stroke="red"
              label={{ value: "Game Start", fill: "red", fontSize: 12 }}
            />
            <ReferenceLine
              x="16:00"
              stroke="red"
              label={{ value: "Game End", fill: "red", fontSize: 12 }}
            />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <rect x="0" y="0" width="100%" height="100%" fill="#1a1a1a" />
            <XAxis
              dataKey={xKey}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a2a2a",
                border: "none",
                color: "white",
              }}
            />
            {data.map((entry: { [key: string]: unknown }, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey={yKey}
                fill={entry[colorKey || ""] as string}
              />
            ))}
          </BarChart>
        );
      case "pie":
        return (
          <PieChart>
            <rect x="0" y="0" width="100%" height="100%" fill="#1a1a1a" />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey={yKey}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry[colorKey || ""] as string}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a2a2a",
                border: "none",
                color: "white",
              }}
            />
          </PieChart>
        );
      default:
        return <div>No chart type specified</div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
