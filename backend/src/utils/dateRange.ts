import { parseQueryDate } from "./date";

type DateRangeResult =
  | { start: Date; end: Date; endExclusive: Date }
  | { error: "invalid-date" | "start-after-end" };

export function getDateRange(startDate?: unknown, endDate?: unknown): DateRangeResult {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parsedStartDate = typeof startDate === "string" ? parseQueryDate(startDate) : null;
  const parsedEndDate = typeof endDate === "string" ? parseQueryDate(endDate) : null;

  if (
    (startDate !== undefined && (typeof startDate !== "string" || !parsedStartDate)) ||
    (endDate !== undefined && (typeof endDate !== "string" || !parsedEndDate))
  ) {
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
