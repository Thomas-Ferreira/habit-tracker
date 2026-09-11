import axios from "axios";
import type { Habit, HabitCategory, HabitFrequency, HabitLog } from "../types";

const HABIT_BASE_URL = "http://localhost:5000/api/habit"
const HABIT_LOG_BASE_URL = "http://localhost:5000/api/habit-log"

//HABITS

export async function fetchHabits(token: string | null): Promise<Habit[]> {
  const response = await axios.get<{ habits: Habit[] }>(HABIT_BASE_URL, { headers: { Authorization: `Bearer ${token}` } })
  return response.data.habits
}

export async function createHabit(
  token: string | null,
  name: string,
  category: HabitCategory,
  description: string,
  frequency: HabitFrequency
): Promise<Habit> {
  const response = await axios.post<{ habit: Habit }>(
    HABIT_BASE_URL,
    { name, category, description, frequency },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data.habit
}

export async function deleteHabit(token: string | null, habitId: string): Promise<void> {
  await axios.delete(`${HABIT_BASE_URL}/${habitId}`, { headers: { Authorization: `Bearer ${token}` } })
}

//HABITS LOG

export async function fecthHabitsLog(token: string | null): Promise<HabitLog[]> {
  const response = await axios.get<HabitLog[]>(HABIT_LOG_BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
  return response.data
}

export async function createHabitLog(token: string | null, habitId: string, completed: boolean): Promise<HabitLog> {
  const response = await axios.post<{ habitLog: HabitLog }>(
    HABIT_LOG_BASE_URL,
    { habitId, completed },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data.habitLog
}