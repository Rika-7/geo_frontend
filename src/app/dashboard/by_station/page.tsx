// src/app/dashboard/by_station/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomBarChart from "@/components/ui/bar_charts";
import { StackedBarChart } from "@/components/ui/stacked_bar_chart";

interface StationData {
  name: string;
  value: number;
  color: string;
}

export default function DashboardByStation() {
  const stationData: StationData[] = [
    { name: "町田駅", value: 6000, color: "#8B5CF6" }, // Purple
    { name: "鶴川駅", value: 3000, color: "#EC4899" }, // Pink
    { name: "多摩駅", value: 1000, color: "#059669" }, // Emerald green
    { name: "その他", value: 1050, color: "#64748B" }, // Slate
  ];

  const stackedData = [
    {
      station: "町田駅",
      町田ゼルビア: 3150,
      浦和レッズ: 2150,
      その他: 700,
      total: 6000,
    },
    {
      station: "鶴川駅",
      町田ゼルビア: 2100,
      浦和レッズ: 800,
      その他: 100,
      total: 3000,
    },
    {
      station: "多摩駅",
      町田ゼルビア: 900,
      浦和レッズ: 62,
      その他: 38,
      total: 1000,
    },
    {
      station: "その他",
      町田ゼルビア: 912,
      浦和レッズ: 112,
      その他: 26,
      total: 1050,
    },
  ];

  const clubColors = {
    町田ゼルビア: "#36A2EB",
    浦和レッズ: "#FF6384",
    その他: "#FFCE56",
  };

  const totalVisitors = stationData.reduce(
    (sum, station) => sum + station.value,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            サッカー観戦者数　経由駅別　ダッシュボード
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                経由駅別の来場者数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stationData.map((station) => {
                  const percentage = (
                    (station.value / totalVisitors) *
                    100
                  ).toFixed(1);
                  return (
                    <li
                      key={station.name}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: station.color }}
                        ></span>
                        {station.name}
                      </span>
                      <span className="font-bold">
                        {station.value.toLocaleString()} ({percentage}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                サポートクラブ別の来場者数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(
                  Object.entries(clubColors) as [
                    keyof typeof clubColors,
                    string
                  ][]
                ).map(([club, color]) => {
                  const clubTotal = stackedData.reduce(
                    (sum, station) => sum + station[club],
                    0
                  );
                  const percentage = (
                    (clubTotal / totalVisitors) *
                    100
                  ).toFixed(1);

                  return (
                    <li
                      key={club}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: color }}
                        ></span>
                        {club}
                      </span>
                      <span className="font-bold">
                        {clubTotal.toLocaleString()} ({percentage}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Changed from grid-cols-1 to grid-cols-2 for horizontal layout */}
        <div className="grid gap-4 md:grid-cols-2">
          <CustomBarChart data={stationData} title="経由駅別の来場者数" />
          <StackedBarChart data={stackedData} clubColors={clubColors} />
        </div>
      </div>
    </div>
  );
}
