import mongoose, { Document, ObjectId, Schema } from "mongoose"

interface IHabitLog extends Document {
  userId: ObjectId,
  habitId: ObjectId,
  date: Date,
  completed: boolean,
  createdAt: Date
}

export interface CreateHabitLogRequest {
  date: Date,
  habitId: string,
  completed: boolean,
}

const habitLogSchema = new Schema<IHabitLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  habitId: {
    type: Schema.Types.ObjectId,
    ref: "Habit",
    required: true
  },
  date: {
    type: Date,
    default: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

habitLogSchema.index({ userId: 1, habitId: 1, date: 1 });

export default mongoose.model<IHabitLog>("HabitLog", habitLogSchema)