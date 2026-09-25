interface BaseStat {
  streak: number;
  completed: number;
  completionRate: number;
}

interface HabitStat extends BaseStat {
  habitId: string;
  name: string;
  category: string;
}

interface AnalyticsStats {
  overallStats: BaseStat;
  habits: HabitStat[];
}
