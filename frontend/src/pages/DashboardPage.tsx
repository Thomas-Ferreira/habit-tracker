import { useState } from "react";
import { ProgressChart } from "../components/analytics/ProgressChart";
import { StatCard } from "../components/analytics/StatCard";
import { HabitStatsTable } from "../components/analytics/HabitStatsTable";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { AnalyticsStats } from "../types";
import { fetchAnalytics } from "../api/analytics";
import { Loading } from "../common/loading";

export const DashboardPage = () => {
  const token = useAuth().token;
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const {
    data: analytics,
    isLoading: isLoading,
    isError: isError,
    error: error,
  } = useQuery<AnalyticsStats>({
    queryKey: ["analytics", token],
    queryFn: () => fetchAnalytics(token!),
    enabled: Boolean(token),
  });

  if (isLoading) return <Loading />;
  if (isError)
    return <div>Erreur lors du chargement des stats : {error.message}</div>;
  if (analytics === undefined) return <div>Statistiques non disponibles</div>;

  console.log(analytics);

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
            data={[]}
            chartType={chartType}
          />
        </div>
        <HabitStatsTable stats={analytics.habits} />
      </div>
    </div>
  );
};
