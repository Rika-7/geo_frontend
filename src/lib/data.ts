// Time-based visitor data throughout the day
export const visitorData = [
  { time: "08:00", visitors: 1000 },
  { time: "08:30", visitors: 2000 },
  { time: "09:00", visitors: 3000 },
  { time: "09:30", visitors: 4000 },
  { time: "10:00", visitors: 5000 },
  { time: "10:30", visitors: 6000 },
  { time: "11:00", visitors: 7000 },
  { time: "11:30", visitors: 8000 },
  { time: "12:00", visitors: 9000 },
  { time: "12:30", visitors: 10000 },
  { time: "13:00", visitors: 10500 },
  { time: "13:30", visitors: 10800 },
  { time: "14:00", visitors: 11050 }, // Game starts
  { time: "14:30", visitors: 11020 }, // Stable during game
  { time: "15:00", visitors: 11000 }, // Stable during game
  { time: "15:30", visitors: 11000 }, // Stable during game
  { time: "16:00", visitors: 10950 }, // Game ends
  { time: "16:30", visitors: 9000 },
  { time: "17:00", visitors: 7000 },
  { time: "17:30", visitors: 5000 },
  { time: "18:00", visitors: 3000 },
  { time: "18:30", visitors: 2000 },
  { time: "19:00", visitors: 1500 },
  { time: "19:30", visitors: 1000 },
  { time: "20:00", visitors: 500 },
];

// Visitor data by group with associated colors
export const visitorsByGroup = [
  { group: "町田ゼルビアサポーター", visitors: 7062, color: "#36A2EB" },
  { group: "川崎フロンターレサポーター", visitors: 3124, color: "#FF6384" },
  { group: "横浜F・マリノスサポーター", visitors: 594, color: "#FFCE56" },
  { group: "鹿島アントラーズサポーター", visitors: 70, color: "#4BC0C0" },
  { group: "その他", visitors: 200, color: "#808080" },
];

// Calculate total visitors across all groups
export const totalVisitors = visitorsByGroup.reduce(
  (sum, group) => sum + group.visitors,
  0
);
