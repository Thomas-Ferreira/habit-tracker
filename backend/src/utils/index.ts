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

function getCalendarDayNumber(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
}

function getCompletedDays(logs: IHabitLog[]): Set<number> {
  return new Set(
    logs
      .filter((log) => log.completed)
      .map((log) => getCalendarDayNumber(new Date(log.date)))
  );
}

export function calculateStreak(logs: IHabitLog[], startDate: Date, endDate: Date): number {
  const completedDays = getCompletedDays(logs);
  let currentStreak = 0;

  for (let day = getCalendarDayNumber(endDate); day >= getCalendarDayNumber(startDate); day--) {
    if (!completedDays.has(day)) break;
    currentStreak++;
  }

  return currentStreak;
}

export function calculateCompletionRate(
  logs: IHabitLog[],
  startDate: Date,
  endDate: Date,
  habitCount = 1
): number {
  const startDay = getCalendarDayNumber(startDate);
  const endDay = getCalendarDayNumber(endDate);
  if (endDay < startDay || habitCount <= 0) return 0;

  const totalDays = endDay - startDay + 1;
  const completedHabitDays = new Set<string>();
  for (const log of logs) {
    if (!log.completed) continue;
    const day = getCalendarDayNumber(new Date(log.date));
    if (day < startDay || day > endDay) continue;
    completedHabitDays.add(`${log.habitId.toString()}:${day}`);
  }

  const totalOpportunities = totalDays * habitCount;
  return Math.round((completedHabitDays.size / totalOpportunities) * 100);
}