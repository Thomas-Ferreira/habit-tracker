import { ProgressChart } from "../components/analytics/ProgressChart";
import { StatCard } from "../components/analytics/StatCard";
import type { HabitLog } from "../types";

const mockData: HabitLog[] = [
  { _id: '1', userId: 'user1', habitId: 'habit1', date: new Date('2023-10-10'), completed: true },
  { _id: '3', userId: 'user1', habitId: 'habit1', date: new Date('2023-10-11'), completed: true },
  { _id: '4', userId: 'user1', habitId: 'habit2', date: new Date('2023-10-11'), completed: true },
  { _id: '6', userId: 'user1', habitId: 'habit2', date: new Date('2023-10-12'), completed: true },
  { _id: '7', userId: 'user1', habitId: 'habit1', date: new Date('2023-10-13'), completed: true },
  { _id: '9', userId: 'user1', habitId: 'habit1', date: new Date('2023-10-14'), completed: true },
  { _id: '10', userId: 'user1', habitId: 'habit2', date: new Date('2023-10-14'), completed: true },
  { _id: '12', userId: 'user1', habitId: 'habit2', date: new Date('2023-10-15'), completed: true },
  { _id: '13', userId: 'user1', habitId: 'habit1', date: new Date('2023-10-16'), completed: true },
];

export const DashboardPage = () => {

  return (
    <div>
      <h2>Dashboard </h2>

      <div>
        <StatCard label="Completion Rate" value={75} unit="%" icon="🎯" />
      </div>
      <div>
        <ProgressChart title="Derniers 7 jours" data={mockData}/>
      </div>
    </div>
  );
}