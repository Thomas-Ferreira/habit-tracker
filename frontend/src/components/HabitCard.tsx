import { useEffect, useState } from "react"
import type { Habit } from "../types"
import axios from "axios";

type HabitCardProps = {
  habit: Habit,
  token: string,
  completed: boolean,
  onHabitUpdate: (habitId: string) => void;
}

export const HabitCard = (props: HabitCardProps) => {
  const { habit, token, onHabitUpdate } = props

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(props.completed);

  useEffect(() => {
    setCompleted(props.completed)
  }, [props.completed])

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/habit/${habit._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onHabitUpdate(habit._id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleted = async () => {
    if (isUpdating) return;
    const nextCompleted = !completed;
    setIsUpdating(true);
    setCompleted(nextCompleted);
    try {
      await axios.post(
        "http://localhost:5000/api/habit-log",
        { habitId: habit._id, completed: nextCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onHabitUpdate(habit._id);
    } catch (err) {
      setCompleted(completed);
      console.error('Update failed:', err);
    } finally {
      console.log(completed);
      setIsUpdating(false);
    }
  }

  return (
    <div className={`rounded-lg border border-gray-800 border-l-4 p-4 flex flex-col gap-3 ${completed ? "border-l-emerald-500 bg-emerald-950/20" : "border-l-gray-600 bg-gray-900"}`}>

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{habit.name}</h3>
          <p className="text-xs text-gray-400 mt-1">{habit.description}</p>
        </div>
        <div className="flex justify-between gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${completed ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-800 text-gray-400"}`}>
            <span aria-hidden="true">{completed ? "✓" : "○"}</span>
            {completed ? "Terminée" : "À faire"}
          </span>
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            aria-label={`Supprimer ${habit.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-lg text-gray-400 transition-colors hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
          >
            {isUpdating ? '...' : '✕'}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
          {habit.frequency}
        </span>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
          {habit.category}
        </span>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={completed}
          className="w-4 h-4 rounded"
          disabled={isUpdating}
          aria-label={`Marquer ${habit.name} comme ${completed ? "non terminée" : "terminée"}`}
          onChange={handleCompleted}
        />
        <span className="text-xs text-gray-400">
          {isUpdating ? "Mise à jour..." : "Complétée aujourd’hui"}
        </span>
      </label>
    </div>
  )
}