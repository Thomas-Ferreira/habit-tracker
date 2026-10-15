import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HabitLog } from '../../types';

interface ProgressChartProps {
  data: HabitLog[];
  title: string;
}

export const ProgressChart = (props: ProgressChartProps) => {
  const { data, title } = props;
  const chartData: { date: string; completed: number }[] = [];

  const uniqueDates: string[] = Array.from(new Set(data.map(log => log.date.toISOString())));

  for (const date of uniqueDates) {
    const completedHabits = data.filter(log => log.date.toISOString() === date && log.completed).length;
    chartData.push({ date, completed: completedHabits });
  }

  return (
    <div className="bg-gray-950 p-4 rounded-lg shadow-lg">
      <h3 className="text-emerald-400 text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" tickLine={false} />
          <YAxis type="number" tickLine={false} allowDecimals={false} />
          <Bar dataKey="completed" fill="#34D399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};