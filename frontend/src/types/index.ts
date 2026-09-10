export type Habit = {
  _id: string,
  name: string,
  description: string,
  frequency: HabitFrequency,
  category: HabitCategory,
  color?: string,
  createdAt: Date
}

export type HabitLog = {
  _id: string,
  userId: string,
  habitId: string,
  date: Date,
  completed: boolean,
}

export const habitFrequencyArray = ['daily', 'weekly', 'monthly'] as const
export type HabitFrequency = typeof habitFrequencyArray[number]

export const habitCategoryArray = ['health', 'learning', 'hobby', 'work', 'other'] as const
export type HabitCategory = typeof habitCategoryArray[number]
