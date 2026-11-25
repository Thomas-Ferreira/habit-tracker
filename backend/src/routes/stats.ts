import express, { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import HabitLog, { IHabitLog } from "../models/HabitLog";
import Habit, { IHabit } from "../models/Habit";
import { getDateRange } from "../utils/dateRange";
import {
  calculateCompletionRate,
  calculateHabitStats,
  calculateOverallStats,
  calculateStreak,
  countCompletedHabitPeriods,
} from "../utils/habitStats";
import { HabitStat, AnalyticsStats } from "../models/Stat";

const router: Router = express.Router();

//GET STATS
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: "login required" });
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const dateRange = getDateRange(req.query.startDate, req.query.endDate);
    if ("error" in dateRange && dateRange.error === "invalid-date") {
      return res.status(400).json({
        error: "startDate and endDate must be single valid date strings",
      });
    }
    if ("error" in dateRange) {
      return res
        .status(400)
        .json({ error: "startDate must be before or equal to endDate" });
    }
    const { start, end, endExclusive } = dateRange;

    const filter: Record<string, unknown> = {
      userId,
      date: { $gte: start, $lt: endExclusive },
    };
    const habitLogs: IHabitLog[] = await HabitLog.find(filter as any);
    const habits: IHabit[] = await Habit.find({ userId } as any);

    // STAT PER HABIT
    const habitStats: HabitStat[] = calculateHabitStats(
      habits,
      habitLogs,
      start,
      end,
    );

    //OVERALLSTATS
    const overallStats = calculateOverallStats(
      habitLogs,
      start,
      end,
      habits,
      habitStats.map((habit) => habit.streak),
    );

    const result: AnalyticsStats = {
      overallStats,
      habits: habitStats,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//GET STATS FOR ONE HABIT BY ID
router.get(
  "/:habitId",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(400).json({ error: "login required" });
      const userId = new mongoose.Types.ObjectId(req.user.id);
      const habitId = req.params.habitId;

      const dateRange = getDateRange(req.query.startDate, req.query.endDate);
      if ("error" in dateRange && dateRange.error === "invalid-date") {
        return res.status(400).json({
          error: "startDate and endDate must be single valid date strings",
        });
      }
      if ("error" in dateRange) {
        return res
          .status(400)
          .json({ error: "startDate must be before or equal to endDate" });
      }
      const { start, end, endExclusive } = dateRange;

      const filter: Record<string, unknown> = {
        userId,
        habitId,
        date: { $gte: start, $lt: endExclusive },
      };
      const habitLogs = await HabitLog.find(filter as any);
      const habit = await Habit.findById(habitId);
      if (!habit) return res.status(404).json({ error: "Habit not found" });
      if (habit.userId.toString() !== userId.toString())
        return res.status(403).json({ error: "Unauthorized" });

      const logs: IHabitLog[] = habitLogs.filter(
        (log) => log.habitId.toString() === habit._id.toString(),
      );
      const streak = calculateStreak(
        logs,
        start,
        end,
        habit.frequency,
        habit.createdAt,
      );
      const completionRate = calculateCompletionRate(logs, start, end, [habit]);

      const result: HabitStat = {
        habitId,
        name: habit.name,
        category: habit.category,
        completed: countCompletedHabitPeriods(logs, start, end, [habit]),
        completionRate,
        streak,
      };

      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

export default router;
