import mongoose,{Schema} from "mongoose";
import { title } from "process";

export interface IRoom{
  id?: string; // Optional for creation, added by DB
  title: string;
  limit: number;
  premium: boolean; // Convert 'Yes'/'No' to boolean
  type: 'PUBLIC' | 'PRIVATE';
  description: string;
  createdAt?: Date; // Optiona
}

const RoomSchema:Schema = new Schema({
  title:{type:String,require:true},
  limit: { type: Number, required: true, min: 0 },
  premium: { type: Boolean, required: true },
  type: { type: String, enum: ['PUBLIC', 'PRIVATE'], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Room = mongoose.model<IRoom>('Room',RoomSchema)