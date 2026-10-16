import { useState } from "react";
import { ProgressChart } from "../components/analytics/ProgressChart";
import { StatCard } from "../components/analytics/StatCard";
import type { HabitLog, HabitStats } from "../types";
import { HabitStatsTable } from "../components/analytics/HabitStatsTable";

const mockProgressChartData: HabitLog[] = [
  {
    _id: "1",
    userId: "user1",
    habitId: "habit1",
    date: new Date("2023-10-10"),
    completed: true,
  },
  {
    _id: "3",
    userId: "user1",
    habitId: "habit1",
    date: new Date("2023-10-11"),
    completed: true,
  },
  {
    _id: "4",
    userId: "user1",
    habitId: "habit2",
    date: new Date("2023-10-11"),
    completed: true,
  },
  {
    _id: "6",
    userId: "user1",
    habitId: "habit2",
    date: new Date("2023-10-12"),
    completed: true,
  },
  {
    _id: "7",
    userId: "user1",
    habitId: "habit1",
    date: new Date("2023-10-13"),
    completed: true,
  },
  {
    _id: "9",
    userId: "user1",
    habitId: "habit1",
    date: new Date("2023-10-14"),
    completed: true,
  },
  {
    _id: "10",
    userId: "user1",
    habitId: "habit2",
    date: new Date("2023-10-14"),
    completed: true,
  },
  {
    _id: "12",
    userId: "user1",
    habitId: "habit2",
    date: new Date("2023-10-15"),
    completed: true,
  },
  {
    _id: "13",
    userId: "user1",
    habitId: "habit1",
    date: new Date("2023-10-16"),
    completed: true,
  },
];

const mockHabitStatsTableData: HabitStats[] = [
  { name: "test1", habitId: "1", streak: 5, completionRate: 85 },
  { name: "test2", habitId: "2", streak: 3, completionRate: 90 },
  { name: "test3", habitId: "3", streak: 1, completionRate: 100 },
];

export const DashboardPage = () => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  return (
    <div>
      <h2>Stats Global </h2>

      <div className="grid grid-cols-2 gap-3 p-4 rounded-lg shadow-lg flex flex-row justify-center items-center mt-4">
        <StatCard label="Completion Rate" value={75} unit="%" icon="🎯" />
        <div>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "bar" | "line")}
            className="p-2 rounded-lg border border-gray-300"
          >
            <option value="bar">BarChart</option>
            <option value="line">LineChart</option>
          </select>
          <ProgressChart
            title="Derniers 7 jours"
            data={mockProgressChartData}
            chartType={chartType}
          />
        </div>
        <HabitStatsTable stats={mockHabitStatsTableData} />
      </div>
    </div>
  );
};
