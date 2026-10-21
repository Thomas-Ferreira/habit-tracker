import { useQuery } from "@tanstack/react-query";
import { fecthHabitsLogs } from "../api/habit";
import type { HabitLog } from "../types";

export function useHabitLogs(token: string | null, startDate: string, endDate: string){
    return useQuery<HabitLog[]>({
    queryKey: ["habitsLogs", token],
    queryFn: () => fecthHabitsLogs(token!, startDate, endDate),
    enabled: Boolean(token),
  })
}