import React from "react";

export const visitorsByGroup = [
  { group: "町田ゼルビアサポーター", visitors: 7062, color: "#36A2EB" },
  { group: "川崎フロンターレサポーター", visitors: 3124, color: "#FF6384" },
  { group: "横浜F・マリノスサポーター", visitors: 594, color: "#FFCE56" },
  { group: "鹿島アントラーズサポーター", visitors: 70, color: "#4BC0C0" },
  { group: "その他", visitors: 200, color: "#808080" },
];

const VisitorLegend = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md text-sm">
      <h3 className="font-semibold mb-2 text-gray-800">サポーター分布</h3>
      <div className="space-y-2">
        {visitorsByGroup.map(({ group, visitors, color }) => (
          <div key={group} className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className="inline-block w-4 h-4 mr-2 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span className="text-gray-800">{group}</span>
            </div>
            <span className="text-gray-600 text-xs">
              {visitors.toLocaleString()}人
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorLegend;
