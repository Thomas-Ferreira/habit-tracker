import express, { Response, Router } from "express";
import { getOllamaResponse } from "../services/llm/ollma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import HabitLog from "../models/HabitLog";
import Habit from "../models/Habit";
import {
  calculateHabitStats,
  calculateOverallStats,
  calculateStreak,
} from "../utils/habitStats";
import { getDateRange } from "../utils/dateRange";
import { buildCoachPrompt } from "../utils/buildCoachPrompt";

const router: Router = express.Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: "login required" });

    const model = req.query.model;
    if (typeof model !== "string" || model.trim() === "") {
      return res
        .status(400)
        .json({ error: "model must be a non-empty string" });
    }
    const selectedModel = model.trim();

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const dateRange = getDateRange();
    if ("error" in dateRange)
      throw new Error("Unable to create the default date range");
    const { start, end, endExclusive } = dateRange;

    const [habits, logs] = await Promise.all([
      Habit.find({ userId } as any),
      HabitLog.find({
        userId,
        date: { $gte: start, $lt: endExclusive },
      } as any),
    ]);

    if (habits.length === 0) {
      return res.status(400).json({ error: "No habits found" });
    }

    const streaks = habits.map((habit) =>
      calculateStreak(
        logs.filter((log) => log.habitId.toString() === habit._id.toString()),
        start,
        end,
        habit.frequency,
        habit.createdAt,
      ),
    );
    const habitStats = calculateHabitStats(habits, logs, start, end);
    const overallStats = calculateOverallStats(
      logs,
      start,
      end,
      habits,
      streaks,
    );
    const contextualPrompt = buildCoachPrompt({
      overallStats: overallStats,
      habits: habitStats,
    });

    const response = await getOllamaResponse(contextualPrompt, selectedModel);
    return res.json({ response });
  } catch (error) {
    console.error("Ollama request failed:", error);
    return res
      .status(502)
      .json({ error: "Unable to get a response from Ollama" });
  }
});

export default router;
