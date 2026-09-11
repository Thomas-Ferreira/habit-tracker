import type { Habit, HabitLog } from "../types";
import { HabitCard } from "./HabitCard";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../common/loading";
import { useQuery } from '@tanstack/react-query'
import { fecthHabitsLog, fetchHabits } from "../api/habit";

function getCompletedStatus(logs: HabitLog[], habitId: string): boolean {
  const log = logs.find((l) => l.habitId === habitId)
  if (log) return log.completed
  return false
}

export const HabitList = () => {

  const token = useAuth().token

  const { data: habits = [], isLoading: isLoadingHabits, isError: isHabitsError, error: habitsError, } = useQuery<Habit[]>({
    queryKey: ["habits", token],
    queryFn: () => fetchHabits(token!),
    enabled: Boolean(token),
  })

  const { data: habitsLog = [], isLoading: isLoadingLogs, isError: isLogsError, error: logsError, } = useQuery<HabitLog[]>({
    queryKey: ["habitsLog", token],
    queryFn: () => fecthHabitsLog(token!),
    enabled: Boolean(token),
  })

  if (isLoadingHabits || isLoadingLogs) return <Loading />

  if (isHabitsError) return <div>Erreur lors du chargement des habitudes : {habitsError.message}</div>

  if (isLogsError) return <div>Erreur lors du chargement des statuts : {logsError.message}</div>

  return (
    <>
      {habits.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-center text-gray-400">
          Aucune habitude pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map(habit => (
            <HabitCard
              key={habit._id}
              habit={habit}
              completed={getCompletedStatus(habitsLog, habit._id)}
              token={token!} />
          ))}
        </div>
      )}
    </>
  )
}