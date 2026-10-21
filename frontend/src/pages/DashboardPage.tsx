import { useState } from "react";
import { ProgressChart } from "../components/analytics/ProgressChart";
import { StatCard } from "../components/analytics/StatCard";
import { HabitStatsTable } from "../components/analytics/HabitStatsTable";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { AnalyticsStats } from "../types";
import { fetchAnalytics } from "../api/analytics";
import { Loading } from "../common/loading";
import { CompletionRing } from "../components/analytics/CompletionRing";
import { useHabitLogs } from "../hooks/useHabitLogs";

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

  const {
    data: habitLogs = [],
    isLoading: isLoadingLogs,
    isError: isLogsError,
    error: logsError,
  } = useHabitLogs(token!, "", "");

  if (isLoading || isLoadingLogs) return <Loading />;
  if (isError)
    return <div>Erreur lors du chargement des stats : {error.message}</div>;
  if (isLogsError)
    return <div>Erreur lors du chargement des stats : {logsError.message}</div>;
  if (analytics === undefined) return <div>Statistiques non disponibles</div>;

  return (
    <div>
      <h2>Stats Global </h2>

      <div className="flex flex-col gap-3 p-4 rounded-lg shadow-lg mt-4">
        {analytics.overallStats && (
          <div className="flex flex-col gap-4 md:flex-row bg-gray-900 justify-content rounded-xl shadow-lg">
            <CompletionRing
              label="Completion"
              value={analytics.overallStats.completionRate}
              unit="%"
            />
            <StatCard
              label="completed"
              value={analytics.overallStats.completed}
              accentClass="border-gray-800"
            />
            <StatCard
              label="streak"
              value={analytics.overallStats.streak}
              accentClass="border-gray-800"
            />
          </div>
        )}
        <div className="grid grid-cols-2 mt-4">
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
            data={habitLogs}
            chartType={chartType}
          />
          <HabitStatsTable stats={analytics.habits} />
        </div>
      </div>
    </div>
  );
};
