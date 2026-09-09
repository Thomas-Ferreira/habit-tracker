import express, { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import HabitLog, { CreateHabitLogRequest } from "../models/HabitLog";
import mongoose from "mongoose";

type HabitLogRequest = AuthRequest<{}, {}, CreateHabitLogRequest>;

const router: Router = express.Router();

// GET HABITLOGS
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: startOfDay, $lt: startOfNextDay },
    } as any);
    res.json({ habitLogs });

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

    const { completed, date, habitId } = req.body

    const existingHabitLog = await HabitLog.findOne({ userId, habitId, date } as any)

    if (existingHabitLog) {
      existingHabitLog.completed = completed
      await existingHabitLog.save()

      return res.json({
        message: 'habitLog updated successfully',
        habitLog: existingHabitLog,
      });
    }

    const habitLog = new HabitLog({ completed, date, habitId, userId })
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