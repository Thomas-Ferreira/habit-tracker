import { useState } from "react"
import type { Habit } from "../types"
import axios from "axios";

type HabitCardProps = {
  habit: Habit,
  token: string,
  onHabitDeleted: (habitId: string) => void;
}

export const HabitCard = (props: HabitCardProps) => {
  const { habit, token, onHabitDeleted } = props

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/habit/${habit._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onHabitDeleted(habit._id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-3">

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{habit.name}</h3>
          <p className="text-xs text-gray-400 mt-1">{habit.description}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-lg text-gray-400 transition-colors hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
        >
          {isDeleting ? '...' : '✕'}
        </button>
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
          defaultChecked={false}
          className="w-4 h-4 rounded"
        />
        <span className="text-xs text-gray-400">Completed today</span>
      </label>
    </div>
  )
}