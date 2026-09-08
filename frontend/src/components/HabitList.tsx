import axios from "axios";
import { useEffect, useState } from "react";
import type { Habit } from "../types";

export const HabitList = () => {

  const token = localStorage.getItem("token")

  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchHabits = async () => {
    setLoading(true);
    setError("")

    try {
      const res = await axios.get('http://localhost:5000/api/habit', { headers: { Authorization: `Bearer ${token}` } });
      setHabits(res.data.habits);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Mes Habitudes</h1>
      {habits.map(habit => (
        <div key={habit._id}>{habit.name}</div>
      ))}
    </div>
  )
}