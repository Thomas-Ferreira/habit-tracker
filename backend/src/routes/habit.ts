import express, { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import Habit, { CreateHabitRequest } from '../models/Habit';
import mongoose from 'mongoose';

type HabitRequest = AuthRequest<{}, {}, CreateHabitRequest>;

const router: Router = express.Router();

// GET HABITS
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const id = req.user.id
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const habits = await Habit.find({ userId } as any);
    res.json({ habits });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

// GET ONE HABIT WITH ID
router.get("/:habitId", authenticateToken, async (req: AuthRequest<{ habitId: string }>, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const habitId = req.params.habitId
    const userId = req.user.id

    const habit = await Habit.findById(habitId)
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    if (habit.userId.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

    res.json({ habit });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

// POST HABIT
router.post("/", authenticateToken, async (req: HabitRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const userId = req.user.id

    const { name, category, description, frequency, color } = req.body

    const habit = new Habit({ name, category, userId, description, frequency, color })
    await habit.save()

    res.status(201).json({
      message: 'habit created successfully',
      habit,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

// DELETE HABIT
router.delete("/:habitId", authenticateToken, async (req: AuthRequest<{ habitId: string }>, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const userId = req.user.id;
    const habitId = req.params.habitId;

    const habit = await Habit.findById(habitId)
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    if (habit.userId.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await Habit.deleteOne({ _id: habitId });

    res.json({ message: 'Habit deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
})

export default router;
