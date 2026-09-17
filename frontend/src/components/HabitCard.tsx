import { useEffect, useState } from "react"
import type { Habit } from "../types"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabitLog, deleteHabit } from "../api/habit";

type HabitCardProps = {
  habit: Habit,
  token: string,
  completed: boolean,
}

export const HabitCard = (props: HabitCardProps) => {
  const queryClient = useQueryClient()

  const { habit, token } = props

  const [completed, setCompleted] = useState<boolean>(props.completed);

  useEffect(() => {
    setCompleted(props.completed)
  }, [props.completed])

  const deleteHabitMutation = useMutation({
    mutationFn: () => deleteHabit(token, habit._id),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["habits", token] }) }
  })

  const createHabitLogMutation = useMutation({
    mutationFn: (nextCompleted: boolean) => createHabitLog(token, habit._id, nextCompleted),
    onError: () => setCompleted(completed),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["habitsLog", token] }) }
  })

  const handleCompleted = () => {
    if (deleteHabitMutation.isPending || createHabitLogMutation.isPending) return;
    const nextCompleted = !completed;
    setCompleted(nextCompleted);
    createHabitLogMutation.mutate(nextCompleted)
  }

  const isUpdating = deleteHabitMutation.isPending || createHabitLogMutation.isPending;

  return (
    <div className={`flex flex-col gap-4 rounded-xl border p-4 transition-all ${completed ? "border-emerald-500/40 bg-emerald-950/10" : "border-gray-800 bg-gray-900/80"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
          <p className="mt-1 text-sm text-gray-400">{habit.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${completed ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-800 text-slate-300"}`}>
            <span aria-hidden="true">{completed ? "✓" : "○"}</span>
            {completed ? "Terminée" : "À faire"}
          </span>

          <button
            onClick={() => deleteHabitMutation.mutate()}
            disabled={isUpdating}
            aria-label={`Supprimer ${habit.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-lg text-gray-400 transition-colors hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
          >
            {deleteHabitMutation.isPending ? '...' : '✕'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] uppercase tracking-wide text-emerald-300">
          {habit.frequency}
        </span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] uppercase tracking-wide text-emerald-300">
          {habit.category}
        </span>
      </div>

      <label className="mt-auto flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-800 bg-slate-950/30 px-3 py-2">
        <span className="text-sm text-gray-300">
          {isUpdating ? "Mise à jour..." : completed ? "Complétée aujourd’hui" : "À compléter aujourd’hui"}
        </span>
        <input
          type="checkbox"
          checked={completed}
          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
          disabled={isUpdating}
          aria-label={`Marquer ${habit.name} comme ${completed ? "non terminée" : "terminée"}`}
          onChange={handleCompleted}
        />
      </label>
    </div>
  )
}