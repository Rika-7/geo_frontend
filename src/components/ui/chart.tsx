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
  index: number;
  payload: { group: string; visitors: number };
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
}: CustomizedLabelProps) => {
  const isLargeSegment = percent > 0.15;
  const adjustedMidAngle = midAngle < 0 ? midAngle + 360 : midAngle;

  // Slightly increased base radius for better spacing
  const radius = isLargeSegment
    ? innerRadius + (outerRadius - innerRadius) * 0.5
    : outerRadius * 1.5; // Increased from 1.4 to 1.5 for slightly more space

  // Calculate initial x and y
  let x = cx + radius * Math.cos(-midAngle * RADIAN);
  let y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Modest adjustments for better separation
  let verticalOffset = 0;
  let horizontalOffset = 0;

  if (!isLargeSegment) {
    if (adjustedMidAngle >= 0 && adjustedMidAngle < 90) {
      // Top right
      verticalOffset = -25 * (1 + (index % 2)); // Slightly increased from -20
      horizontalOffset = 15; // Slightly increased from 10
    } else if (adjustedMidAngle >= 90 && adjustedMidAngle < 180) {
      // Bottom right
      verticalOffset = 25 * (1 + (index % 2));
      horizontalOffset = 15;
    } else if (adjustedMidAngle >= 180 && adjustedMidAngle < 270) {
      // Bottom left
      verticalOffset = 25 * (1 + (index % 2));
      horizontalOffset = -15;
    } else {
      // Top left
      verticalOffset = -25 * (1 + (index % 2));
      horizontalOffset = -15;
    }

    x += horizontalOffset;
    y += verticalOffset;
  }

  let textAnchor = "middle";
  if (x > cx) {
    textAnchor = "start";
  } else if (x < cx) {
    textAnchor = "end";
  }

  const formattedPercent = (percent * 100).toFixed(0);
  const labelText = `${payload.group} ${formattedPercent}%`;

  const labelLine = !isLargeSegment ? (
    <path
      d={`M${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${
        cy + outerRadius * Math.sin(-midAngle * RADIAN)
      }L${x},${y}`}
      stroke="white"
      fill="none"
    />
  ) : null;

  return (
    <>
      {labelLine}
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {labelText}
      </text>
    </>
  );
};

export function Chart({ data, title, type, xKey, yKey, colorKey }: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <rect width="100%" height="100%" fill="#1f2937" />
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
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                color: "white",
              }}
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
            <rect width="100%" height="100%" fill="#1f2937" />
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
                backgroundColor: "#1f2937",
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
            <rect width="100%" height="100%" fill="#1f2937" />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey={yKey}
              nameKey={xKey}
              startAngle={90}
              endAngle={-270}
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
                backgroundColor: "#1f2937",
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
    <Card className="w-full bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={500}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
