import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomBarChart from "@/components/ui/bar_charts";

export default function DashboardByStation() {
  const stationData = [
    { name: "町田駅", value: 5000, color: "#36A2EB" },
    { name: "鶴川駅", value: 3000, color: "#FF6384" },
    { name: "多摩駅", value: 2000, color: "#FFCE56" },
    { name: "その他", value: 1050, color: "#808080" },
  ];

  const stationBySupporterData = [
    // 町田駅
    { name: "町田駅 - 町田ゼルビア", value: 2500, color: "#36A2EB" },
    { name: "町田駅 - 川崎フロンターレ", value: 1000, color: "#FF6384" },
    { name: "町田駅 - 横浜F・マリノス", value: 800, color: "#FFCE56" },
    { name: "町田駅 - 鹿島アントラーズ", value: 400, color: "#4BC0C0" },
    { name: "町田駅 - その他", value: 300, color: "#808080" },
    // 鶴川駅
    { name: "鶴川駅 - 町田ゼルビア", value: 1500, color: "#36A2EB" },
    { name: "鶴川駅 - 川崎フロンターレ", value: 600, color: "#FF6384" },
    { name: "鶴川駅 - 横浜F・マリノス", value: 500, color: "#FFCE56" },
    { name: "鶴川駅 - 鹿島アントラーズ", value: 200, color: "#4BC0C0" },
    { name: "鶴川駅 - その他", value: 200, color: "#808080" },
    // 多摩駅
    { name: "多摩駅 - 町田ゼルビア", value: 1000, color: "#36A2EB" },
    { name: "多摩駅 - 川崎フロンターレ", value: 400, color: "#FF6384" },
    { name: "多摩駅 - 横浜F・マリノス", value: 300, color: "#FFCE56" },
    { name: "多摩駅 - 鹿島アントラーズ", value: 200, color: "#4BC0C0" },
    { name: "多摩駅 - その他", value: 100, color: "#808080" },
    // その他
    { name: "その他 - 町田ゼルビア", value: 400, color: "#36A2EB" },
    { name: "その他 - 川崎フロンターレ", value: 250, color: "#FF6384" },
    { name: "その他 - 横浜F・マリノス", value: 200, color: "#FFCE56" },
    { name: "その他 - 鹿島アントラーズ", value: 100, color: "#4BC0C0" },
    { name: "その他 - その他", value: 100, color: "#808080" },
  ];

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
                経由駅・サポートクラブ別の来場者数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  { name: "町田ゼルビア", color: "#36A2EB" },
                  { name: "川崎フロンターレ", color: "#FF6384" },
                  { name: "横浜F・マリノス", color: "#FFCE56" },
                  { name: "鹿島アントラーズ", color: "#4BC0C0" },
                  { name: "その他", color: "#808080" },
                ].map((club) => {
                  const clubTotal = stationBySupporterData
                    .filter((item) => item.name.includes(club.name))
                    .reduce((sum, item) => sum + item.value, 0);
                  const percentage = (
                    (clubTotal / totalVisitors) *
                    100
                  ).toFixed(1);

                  return (
                    <li
                      key={club.name}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: club.color }}
                        ></span>
                        {club.name}
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

        <div className="grid gap-4 md:grid-cols-1">
          <CustomBarChart data={stationData} title="経由駅別の来場者数" />
          <CustomBarChart
            data={stationBySupporterData}
            title="経由駅・サポートクラブ別の来場者数"
          />
        </div>
      </div>
    </div>
  );
}
