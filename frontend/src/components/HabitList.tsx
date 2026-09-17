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

  const completedHabits = habits.filter((habit) =>
    getCompletedStatus(habitsLog, habit._id)
  ).length;

  const completionRate = habits.length
    ? Math.round((completedHabits / habits.length) * 100)
    : 0;

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
        <div className="flex flex-col gap-6">

          <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Today
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Mes habitudes aujourd&apos;hui
                </h2>
              </div>
              <span className="text-sm font-medium text-gray-300">
                {completedHabits}/{habits.length} complétées
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {habits.map(habit => (
              <HabitCard
                key={habit._id}
                habit={habit}
                completed={getCompletedStatus(habitsLog, habit._id)}
                token={token!} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}