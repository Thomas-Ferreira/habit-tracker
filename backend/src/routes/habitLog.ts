import express, { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import HabitLog, { CreateHabitLogRequest } from "../models/HabitLog";
import mongoose from "mongoose";
import Habit from "../models/Habit";
import { parseQueryDate } from "../utils";

type HabitLogRequest = AuthRequest<{}, {}, CreateHabitLogRequest>;

const router: Router = express.Router();

// GET HABITLOGS
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { startDate, endDate, habitId } = req.query as {
      startDate?: string;
      endDate?: string;
      habitId?: string;
    };

    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({ error: 'startDate and endDate are required together' });
    }

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = startDate ? parseQueryDate(startDate) : todayDate;
    const end = endDate ? parseQueryDate(endDate) : todayDate;

    if (!start || !end) {
      return res.status(400).json({ error: 'startDate and endDate must be valid dates' });
    }

    if (start > end) {
      return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
    }

    if (habitId && !mongoose.Types.ObjectId.isValid(habitId)) {
      return res.status(400).json({ error: 'habitId must be a valid id' });
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

    if (habitId) filter.habitId = new mongoose.Types.ObjectId(habitId);

    const habitLogs = await HabitLog.find(filter as any);
    res.json(habitLogs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

// POST HABITLOG
router.post("/", authenticateToken, async (req: HabitLogRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const { completed, habitId } = req.body
    if (!habitId || !mongoose.Types.ObjectId.isValid(habitId)) {
      return res.status(400).json({ error: 'habitId must be a valid id' });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }

    const habit = await Habit.findOne({
      _id: new mongoose.Types.ObjectId(habitId),
      userId,
    } as any);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfNextDay = new Date(startOfDay)
    startOfNextDay.setDate(startOfNextDay.getDate() + 1)
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)

    const existingHabitLog = await HabitLog.findOne({
      userId,
      habitId,
      date: { $gte: startOfDay, $lt: startOfNextDay },
    } as any)

    if (existingHabitLog) {
      existingHabitLog.completed = completed
      await existingHabitLog.save()

      return res.json({
        message: 'habitLog updated successfully',
        habitLog: existingHabitLog,
      });
    }

    const habitLog = new HabitLog({ completed, habitId, userId, date })
    await habitLog.save()

    res.status(201).json({
      message: 'habitLog created successfully',
      habitLog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

export default router