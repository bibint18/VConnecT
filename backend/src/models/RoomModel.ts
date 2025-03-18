import mongoose,{Schema, Types} from "mongoose";
import { title } from "process";

export interface IRoom{
  id?: string; // Optional for creation, added by DB
  title: string;
  limit: number;
  premium: boolean; // Convert 'Yes'/'No' to boolean
  type: 'PUBLIC' | 'PRIVATE';
  description: string;
  createdAt?: Date; // Optiona
  createdBy:string;
  secretCode?:string;
  participants: Types.ObjectId[]
}

const RoomSchema:Schema = new Schema({
  title:{type:String,require:true},
  limit: { type: Number, required: true, min: 0 },
  premium: { type: Boolean, required: true },
  type: { type: String, enum: ['PUBLIC', 'PRIVATE'], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy:{type:String},
  secretCode:{type:String},
  participants:[{type:Schema.Types.ObjectId,ref:'User'}]
})

export const Room = mongoose.model<IRoom>('Room',RoomSchema)