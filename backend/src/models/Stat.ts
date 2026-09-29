export interface BaseStat {
  streak: number;
  completed: number;
  completionRate: number;
}

export interface HabitStat extends BaseStat {
  habitId: string;
  name: string;
  category: string;
}

export interface AnalyticsStats {
  overallStats: BaseStat;
  habits: HabitStat[];
}
