import { Toaster } from "react-hot-toast"
import { HabitList } from "../components/HabitList"
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HabitForm } from "../components/HabitForm";

export const DashboardPage = () => {
  const token = useAuth().token
  const [displayForm, setDisplayForm] = useState<boolean>(false)

  const renderHabitAction = () => {
    if (displayForm) {
      return (
        <div>
          <HabitForm token={token!} onHabitCreated={() => { setDisplayForm(false) }} />
        </div>
      );
    } else {
      return (
        <div>
          <button
            onClick={() => setDisplayForm(true)}
            type="button"
            aria-label="Ajouter une habitude"
            className="group inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-950/30 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400 hover:shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <span aria-hidden="true" className="text-xl leading-none transition-transform group-hover:rotate-90">+</span>
            <span>Ajouter une habitude</span>
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Habit Tracker</h1>
          </div>
        </div>
        <div>
          Dashboard
        </div>
      </div>

      <div className="bg-gray-950 p-8">
        <div className="flex mb-6">
          {renderHabitAction()}
        </div>
        <HabitList />
      </div>
    </div>
  )
}