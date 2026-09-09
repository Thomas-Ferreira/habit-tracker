export type Habit = {
  _id: string,
  name: string,
  description: string,
  frequency: HabitFrequency,
  category: HabitCategory,
  color?: string,
  createdAt: Date
}

export const habitFrequencyArray = ['daily', 'weekly', 'monthly'] as const
export type HabitFrequency = typeof habitFrequencyArray[number]

export const habitCategoryArray = ['health', 'learning', 'hobby', 'work', 'other'] as const
export type HabitCategory = typeof habitCategoryArray[number]
