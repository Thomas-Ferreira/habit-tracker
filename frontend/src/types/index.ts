export type Habit = {
  _id: string,
  name: string,
  description: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  category: 'health' | 'learning' | 'hobby' | 'work' | 'other',
  color?: string,
  createdAt: Date
}
