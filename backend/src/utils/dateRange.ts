import { parseQueryDate } from "./date";

type DateRangeResult =
  | { start: Date; end: Date; endExclusive: Date }
  | { error: "invalid-date" | "start-after-end" };

export function getDateRange(startDate?: string, endDate?: string): DateRangeResult {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parsedStartDate = startDate ? parseQueryDate(startDate) : null;
  const parsedEndDate = endDate ? parseQueryDate(endDate) : null;

  if ((startDate !== undefined && !parsedStartDate) || (endDate !== undefined && !parsedEndDate)) {
    return { error: "invalid-date" };
  }

  const start = parsedStartDate ?? new Date(parsedEndDate ?? todayDate);
  const end = parsedEndDate ?? new Date(todayDate);
  if (!parsedStartDate) start.setDate(start.getDate() - 6);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  if (start > end) return { error: "start-after-end" };

  const endExclusive = new Date(end);
  endExclusive.setDate(endExclusive.getDate() + 1);
  return { start, end, endExclusive };
}
