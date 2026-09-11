import axios from "axios";
import type { Habit, HabitLog } from "../types";

const HABIT_BASE_URL = "http://localhost:5000/api/habit"
const HABIT_LOG_BASE_URL = "http://localhost:5000/api/habit-log"

export async function fetchHabits(token: string | null): Promise<Habit[]> {
  const response = await axios.get<{ habits: Habit[] }>(HABIT_BASE_URL, { headers: { Authorization: `Bearer ${token}` } })
  return response.data.habits
}

export async function fecthHabitsLog(token: string | null): Promise<HabitLog[]> {
  const response = await axios.get<HabitLog[]>(HABIT_LOG_BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
  return response.data
}