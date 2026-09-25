import type { IHabitLog } from "../models/HabitLog";

export function parseQueryDate(value: string): Date | null {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function calculateStreak(logs: IHabitLog[]): number {
  const sortedLogs = [...logs].sort(
    (firstLog, secondLog) => secondLog.date.getTime() - firstLog.date.getTime()
  );

  let streak = 0;
  for (const log of sortedLogs) {
    if (!log.completed) break;
    streak++;
  }

  return streak;
}

export function calculateCompletionRate(logs: IHabitLog[]): number {
  const completedLog = logs.filter((l) => l.completed === true)
  if (logs.length === 0) return 0
  return (completedLog.length / logs.length) * 100
}