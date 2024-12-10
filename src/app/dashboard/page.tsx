import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { visitorData, visitorsByGroup, totalVisitors } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            サッカー観戦者数　ダッシュボード
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                全来場者数　（町田ゼルビア vs 川崎フロンターレ）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalVisitors}</div>
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
                {visitorsByGroup.map((group) => {
                  const percentage = (
                    (group.visitors / totalVisitors) *
                    100
                  ).toFixed(1);
                  return (
                    <li
                      key={group.group}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: group.color }}
                        ></span>
                        {group.group}
                      </span>
                      <span className="font-bold">
                        {group.visitors} ({percentage}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Chart
            data={visitorData}
            title="Visitors Over Time (8:00 - 20:00)"
            type="line"
            xKey="time"
            yKey="visitors"
          />
          <div className="flex items-center justify-center">
            <Chart
              data={visitorsByGroup}
              title="Total Visitors by Group"
              type="pie"
              xKey="group"
              yKey="visitors"
              colorKey="color"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
