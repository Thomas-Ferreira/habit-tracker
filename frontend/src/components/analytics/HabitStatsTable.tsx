import type { HabitStats } from "../../types";

interface HabitStatsTableProps {
  stats?: HabitStats[];
}

export const HabitStatsTable = (props: HabitStatsTableProps) => {
  const { stats = [] } = props;

  return (
    <div className=" rounded-xl border border-gray-800 bg-gray-900 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-950">
            <th className="border-b border-gray-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Habit Name
            </th>
            <th className="border-b border-gray-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Completion Rate
            </th>
            <th className="border-b border-gray-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Streak
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((habit) => (
            <tr
              key={habit.habitId}
              className="hover:bg-gray-800/50 transition-colors last:border:0"
            >
              <td className="border-b border-gray-800 p-3 text-sm text-gray-300">
                {habit.name}
              </td>
              <td
                className={`border-b border-gray-800 p-3 text-sm text-gray-300 ${habit.completionRate >= 70 ? "text-green-500" : "text-red-500"}`}
              >
                {habit.completionRate}%
              </td>
              <td className="border-b border-gray-800 p-3 text-sm text-gray-300">
                {habit.streak}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
