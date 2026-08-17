import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config()

const app: Express = express();

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error('❌ MongoDB error:', err))

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running ✅" })
})

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))