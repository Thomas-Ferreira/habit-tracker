import { StatCard } from "../components/analytics/StatCard";

export const DashboardPage = () => {
  return (
    <div>
      <h2>Dashboard </h2>

      <div>
        <StatCard label="Completion Rate" value={75} unit="%" icon="🎯" />
      </div>
    </div>
  );
}