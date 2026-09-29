import type { IHabitLog } from "../models/HabitLog";
import type { IHabit } from "../models/Habit";

type HabitFrequency = IHabit["frequency"];

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

function getPeriodNumber(date: Date, frequency: HabitFrequency): number {
  if (frequency === "daily") return getCalendarDayNumber(date);
  if (frequency === "weekly") {
    return Math.floor((getCalendarDayNumber(date) + 3) / 7);
  }
  return date.getFullYear() * 12 + date.getMonth();
}

function getExpectedPeriods(
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  frequency: HabitFrequency
): Set<number> {
  const firstDate = getCalendarDayNumber(startDate) >= getCalendarDayNumber(createdAt)
    ? startDate
    : createdAt;
  const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const lastDay = getCalendarDayNumber(endDate);
  const periods = new Set<number>();

  while (getCalendarDayNumber(cursor) <= lastDay) {
    periods.add(getPeriodNumber(cursor, frequency));
    cursor.setDate(cursor.getDate() + 1);
  }

  return periods;
}

export function calculateStreak(
  logs: IHabitLog[],
  startDate: Date,
  endDate: Date,
  frequency: HabitFrequency,
  createdAt: Date
): number {
  const startPeriod = Math.max(
    getPeriodNumber(startDate, frequency),
    getPeriodNumber(createdAt, frequency)
  );
  let endPeriod = getPeriodNumber(endDate, frequency);
  const completedPeriods = new Set<number>();
  const loggedPeriods = new Set<number>();

  for (const log of logs) {
    const date = new Date(log.date);
    const day = getCalendarDayNumber(date);
    if (day < getCalendarDayNumber(startDate) || day > getCalendarDayNumber(endDate)) continue;
    if (day < getCalendarDayNumber(createdAt)) continue;
    const period = getPeriodNumber(date, frequency);
    loggedPeriods.add(period);
    if (log.completed) completedPeriods.add(period);
  }

  const today = new Date();
  if (
    endPeriod === getPeriodNumber(today, frequency) &&
    !completedPeriods.has(endPeriod) &&
    (frequency !== "daily" || !loggedPeriods.has(endPeriod))
  ) {
    endPeriod--;
  }

  let currentStreak = 0;

  for (let period = endPeriod; period >= startPeriod; period--) {
    if (!completedPeriods.has(period)) break;
    currentStreak++;
  }

  if (endPeriod < startPeriod) return 0;

  return currentStreak;
}

export function calculateCompletionRate(
  logs: IHabitLog[],
  startDate: Date,
  endDate: Date,
  habits: IHabit[]
): number {
  const startDay = getCalendarDayNumber(startDate);
  const endDay = getCalendarDayNumber(endDate);
  if (endDay < startDay || habits.length === 0) return 0;

  const expectedPeriods = new Map<string, Set<number>>();
  const habitsById = new Map<string, IHabit>();
  for (const habit of habits) {
    const habitId = habit._id.toString();
    expectedPeriods.set(habitId, getExpectedPeriods(startDate, endDate, habit.createdAt, habit.frequency));
    habitsById.set(habitId, habit);
  }

  let totalOpportunities = 0;
  for (const periods of expectedPeriods.values()) totalOpportunities += periods.size;
  if (totalOpportunities === 0) return 0;

  const completedHabitPeriods = new Set<string>();
  for (const log of logs) {
    if (!log.completed) continue;
    const date = new Date(log.date);
    const day = getCalendarDayNumber(date);
    if (day < startDay || day > endDay) continue;

    const habitId = log.habitId.toString();
    const periods = expectedPeriods.get(habitId);
    if (!periods) continue;
    const habit = habitsById.get(habitId);
    if (!habit) continue;

    const period = getPeriodNumber(date, habit.frequency);
    if (periods.has(period)) completedHabitPeriods.add(`${habitId}:${period}`);
  }

  return Math.round((completedHabitPeriods.size / totalOpportunities) * 100);
}

export function countCompletedHabitPeriods(
  logs: IHabitLog[],
  startDate: Date,
  endDate: Date,
  habits: IHabit[]
): number {
  const startDay = getCalendarDayNumber(startDate);
  const endDay = getCalendarDayNumber(endDate);
  if (endDay < startDay) return 0;

  const habitsById = new Map(habits.map((habit) => [habit._id.toString(), habit]));
  const completedHabitPeriods = new Set<string>();

  for (const log of logs) {
    if (!log.completed) continue;
    const date = new Date(log.date);
    const day = getCalendarDayNumber(date);
    if (day < startDay || day > endDay) continue;

    const habitId = log.habitId.toString();
    const habit = habitsById.get(habitId);
    if (!habit || day < getCalendarDayNumber(habit.createdAt)) continue;
    completedHabitPeriods.add(`${habitId}:${getPeriodNumber(date, habit.frequency)}`);
  }

  return completedHabitPeriods.size;
}