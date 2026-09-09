import axios from "axios";
import { useEffect, useState } from "react";
import type { Habit } from "../types";
import { HabitCard } from "./HabitCard";
import { HabitForm } from "./HabitForm";
import { useNavigate } from "react-router-dom";

export const HabitList = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token")

  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [displayForm, setDisplayForm] = useState<boolean>(false)

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

  useEffect(() => {
    fetchHabits();
  }, []);

  if (!token) return navigate('/login');
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  const renderHabitAction = () => {
    if (displayForm) {
      return (
        <div>
          <HabitForm token={token} onHabitCreated={() => { setDisplayForm(false); fetchHabits() }} />
        </div>
      );
    } else {
      return (
        <div>
          <button
            onClick={() => setDisplayForm(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-white w-12 h-12 rounded-lg font-semibold text-2xl flex items-center justify-center"
          >
            +
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">Mes Habitudes</h1>
      </div>

      <div className="flex mb-6">
        {renderHabitAction()}
      </div>

      {habits.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-center text-gray-400">
          Aucune habitude pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map(habit => (
            <HabitCard key={habit._id} habit={habit} token={token} onHabitDeleted={() => fetchHabits()} />
          ))}
        </div>
      )}
    </div>
  )
}