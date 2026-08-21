import express, { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import Habit, { CreateHabitRequest } from '../models/Habit';

type HabitRequest = AuthRequest<{}, {}, CreateHabitRequest>;

const router: Router = express.Router();

// GET HABITS
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(400).json({ error: 'login required' });
    const id = req.user.id

    const habits = Habit.find().where("userId").equals(id)
    res.json({ habits });

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
router.delete("/", authenticateToken, async (req: HabitRequest, res: Response) => {

})

export default router;
