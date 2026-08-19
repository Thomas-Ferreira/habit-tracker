import { Toaster } from "react-hot-toast"

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Habit Tracker</h1>
          </div>
        </div>
        <div>
          Dashboard
        </div>
      </div>
    </div>
  )
}