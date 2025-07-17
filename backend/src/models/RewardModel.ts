import mongoose, { Document, Schema } from "mongoose";

export interface IReward extends Document{
  rewardId: string;
  title: string;
  description: string;
  type: "room_creation" | "bonus_points";
  value: number; 
  requiredPoints?: number;
  requiredStreak?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted:boolean;
  isUnlocked?:boolean;
  isClaimed?:boolean;
}

export interface IRewardDocument extends IReward,Document{}

const rewardSchema = new Schema<IRewardDocument>(
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