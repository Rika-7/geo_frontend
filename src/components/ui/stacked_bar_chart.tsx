"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";

interface StackedData {
  station: string;
  町田ゼルビア: number;
  浦和レッズ: number;
  その他: number;
  total: number;
}

interface ClubColors {
  町田ゼルビア: string;
  浦和レッズ: string;
  その他: string;
}

interface StackedBarChartProps {
  data: StackedData[];
  clubColors: ClubColors;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow">
      <p className="text-white font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(1)}%
        </p>
      ))}
    </div>
  );
};

export function StackedBarChart({ data, clubColors }: StackedBarChartProps) {
  const percentageData = data.map((station) => {
    const percentages: { [key: string]: number | string } = {
      station: station.station,
    };

    const stationTotal = station.total;

    Object.keys(station).forEach((key) => {
      if (key !== "station" && key !== "total") {
        percentages[key] = Number(
          ((station[key as keyof StackedData] as number) / stationTotal) * 100
        ).toFixed(1);
      }
    });
    return percentages;
  });

  return (
    <Card className="w-full bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          経由駅・サポートクラブ別の来場者割合
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={percentageData}>
            <XAxis
              dataKey="station"
              stroke="#ffffff"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#ffffff"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#ffffff" }} />
            {(Object.keys(clubColors) as Array<keyof ClubColors>).map(
              (club) => (
                <Bar
                  key={club}
                  dataKey={club}
                  stackId="a"
                  fill={clubColors[club]}
                />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
