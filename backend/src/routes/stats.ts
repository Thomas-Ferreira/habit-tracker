import express, { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import HabitLog, { IHabitLog } from "../models/HabitLog";
import Habit from "../models/Habit";
import { calculateCompletionRate, calculateStreak, parseQueryDate } from "../utils";

const router: Router = express.Router();

//GET STATS
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({ error: 'startDate and endDate are required together' });
    }

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const defaultStartDate = new Date(todayDate);
    defaultStartDate.setDate(defaultStartDate.getDate() - 6);
    const start = startDate ? parseQueryDate(startDate) : defaultStartDate;
    const end = endDate ? parseQueryDate(endDate) : todayDate;

    if (!start || !end) {
      return res.status(400).json({ error: 'startDate and endDate must be valid dates' });
    }
    if (start > end) {
      return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
    }

    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayAfterEnd = new Date(end);
    startOfDayAfterEnd.setHours(0, 0, 0, 0);
    startOfDayAfterEnd.setDate(startOfDayAfterEnd.getDate() + 1);

    const filter: Record<string, unknown> = {
      userId,
      date: { $gte: startOfDay, $lt: startOfDayAfterEnd },
    };
    const habitLogs = await HabitLog.find(filter as any)
    const habits = await Habit.find({ userId } as any)

    const habitStats: HabitStat[] = []

    //OVERALLSTATS
    const overallStats: BaseStat = {
      completed: habitLogs.filter((h) => h.completed === true).length,
      completionRate: calculateCompletionRate(habitLogs),
      streak: calculateStreak(habitLogs)
    }

    // STATS PER HABIT
    for (const habit of habits) {
      const logs: IHabitLog[] = habitLogs.filter((log) => log.habitId.toString() === habit._id.toString());
      const streak = calculateStreak(logs);
      const completionRate = calculateCompletionRate(logs)

      habitStats.push({
        habitId: habit._id.toString(),
        name: habit.name,
        category: habit.category,
        completed: logs.filter((l) => l.completed === true).length,
        completionRate,
        streak
      })
    }

    const result: AnalyticsStats = {
      overallStats,
      habits: habitStats
    }

    res.json({ result })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

export default router