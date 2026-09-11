import axios from "axios";
import { useEffect, useState } from "react";
import type { Habit, HabitLog } from "../types";
import { HabitCard } from "./HabitCard";
import { useAuth } from "../hooks/useAuth";
import { loading as loadingComponent } from "../common/loading";

function getCompletedStatus(logs: HabitLog[], habitId: string): boolean {
  const log = logs.find((l) => l.habitId === habitId)
  if (log) return log.completed
  return false
}

export const HabitList = () => {

  const token = useAuth().token

  const [habits, setHabits] = useState<Habit[]>([])
  const [habitsLog, setHabitsLog] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchHabits = async () => {
    setLoading(true);
    setError("")

    try {
      const res = await axios.get('http://localhost:5000/api/habit', { headers: { Authorization: `Bearer ${token}` } });
      setHabits(res.data.habits ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const fecthHabitsLog = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await axios.get('http://localhost:5000/api/habit-log', { headers: { Authorization: `Bearer ${token}` } });
      setHabitsLog(res.data ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const refreshHabitData = async () => {
    await Promise.all([fetchHabits(), fecthHabitsLog()]);
  }

  useEffect(() => {
    if (token) {
      fetchHabits()
      fecthHabitsLog()
    }
  }, [token]);

  if (loading) return loadingComponent()
  if (error) return <div>Erreur: {error}</div>

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
              token={token!}
              onHabitUpdate={() => refreshHabitData()} />
          ))}
        </div>
      )}
    </>
  )
}