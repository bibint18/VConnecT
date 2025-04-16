import mongoose, { Document, Schema } from "mongoose";

export interface IReward extends Document {
  rewardId: string;
  title: string;
  description: string;
  type: "room_creation" | "bonus_points";
  value: number; // e.g., 1 for +1 room, 10 for 10 points
  requiredPoints?: number;
  requiredStreak?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted:boolean
}

const rewardSchema = new Schema<IReward>(
  {
    rewardId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["room_creation", "bonus_points"], required: true },
    value: { type: Number, required: true },
    requiredPoints: { type: Number },
    requiredStreak: { type: Number },
    isDeleted:{type:Boolean,default:false},
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Reward = mongoose.model<IReward>("Reward", rewardSchema);