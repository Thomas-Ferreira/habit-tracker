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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-900 border border-gray-800 rounded-lg p-6">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <button
        type="button"
        onClick={onHabitCreated}
        aria-label="Fermer le formulaire"
        className="self-end inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-lg text-gray-400 transition-colors hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
      >
        ✕
      </button>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
      />

      <textarea
        placeholder="Description (optionnel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as HabitCategory)}
        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
      >
        {habitCategoryArray.map((categoryOption) => (
          <option key={categoryOption} value={categoryOption}>
            {categoryOption}
          </option>
        ))}
      </select>

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
      >
        {habitFrequencyArray.map((frequencyOption) => (
          <option key={frequencyOption} value={frequencyOption}>
            {frequencyOption}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded font-semibold"
      >
        {loading ? 'Créating...' : 'Créer'}
      </button>
    </form>
  );
}