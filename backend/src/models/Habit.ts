import mongoose, { Document, ObjectId, Schema } from "mongoose";

interface IHabit extends Document {
  name: string,
  userId: ObjectId,
  description: string,
  frequency: "daily" | "weekly" | "monthly"
  category: "health" | "learning" | "hobby" | "work" | "other"
  color: string,
  createdAt: Date
}

export interface CreateHabitRequest {
  name: string;
  category: "health" | "learning" | "hobby" | "work" | "other";
  description?: string; // optionnel
  frequency?: "daily" | "weekly" | "monthly"; // optionnel
  color?: string; // optionnel
}

const habitSchema = new Schema<IHabit>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  category: {
    type: String,
    enum: ['health', 'learning', 'hobby', 'work', 'other'],
    required: true
  },
  color: {
    type: String,
    default: 'gray'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IHabit>("Habit", habitSchema)