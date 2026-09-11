import { useState } from "react"
import { habitCategoryArray, habitFrequencyArray, type HabitCategory, type HabitFrequency } from "../types"
import axios from "axios"

type HabitFormProps = {
  onHabitCreated: () => void,
  token: string
}

export const HabitForm = (props: HabitFormProps) => {
  const { onHabitCreated, token } = props

  const [name, setName] = useState<string>('')
  const [category, setCategory] = useState<HabitCategory>('health')
  const [description, setDescription] = useState<string>('')
  const [frequency, setFrequency] = useState<HabitFrequency>('daily')

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post(
        'http://localhost:5000/api/habit',
        { name, category, description, frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onHabitCreated()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Nouvelle habitude</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Créer une habitude</h2>
          <p className="mt-1 text-sm text-gray-400">Définissez une habitude à suivre au quotidien.</p>
        </div>
        <button
          type="button"
          onClick={onHabitCreated}
          aria-label="Fermer le formulaire"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-700 text-lg text-gray-400 transition-colors hover:border-red-400 hover:bg-red-400/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          ✕
        </button>
      </div>

      {error && <div role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</div>}

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
        Nom
        <input
          type="text"
          placeholder="Ex. Lire 20 minutes"
          aria-label="Nom de l'habitude"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
        Description <span className="font-normal text-gray-500">(optionnel)</span>
        <textarea
          placeholder="Ajoutez quelques détails..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-y rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
          Catégorie
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HabitCategory)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          >
            {habitCategoryArray.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
          Fréquence
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          >
            {habitFrequencyArray.map((frequencyOption) => (
              <option key={frequencyOption} value={frequencyOption}>
                {frequencyOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center rounded-md border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 transition-colors hover:border-emerald-300 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Création...' : 'Créer l’habitude'}
      </button>
    </form>
  );
}