import mongoose,{Schema, Types} from "mongoose";
import { title } from "process";
import { IUser } from "./User";

export interface IParticipant {
  userId: Types.ObjectId;
  firstJoin: Date;
  lastJoin: Date;
  lastLeave: Date | null;
  totalDuration: number; // In milliseconds
}
export interface IRoom{
  id?: string; 
  title: string;
  limit: number;
  premium: boolean; 
  type: 'PUBLIC' | 'PRIVATE';
  description: string;
  createdAt?: Date; 
  createdBy:Partial<IUser>;
  secretCode?:string;
  participants: IParticipant[]
  isDeleted:boolean;
  isBlocked:boolean
}
const participantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", },
  firstJoin: { type: Date},
  lastJoin: { type: Date},
  lastLeave: { type: Date, default: null },
  totalDuration: { type: Number, default: 0 }, 
});

const RoomSchema:Schema = new Schema({
  title:{type:String,require:true},
  limit: { type: Number, required: true, min: 0 },
  premium: { type: Boolean, required: true },
  type: { type: String, enum: ['PUBLIC', 'PRIVATE'], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy:{ type: Schema.Types.ObjectId, ref: "User", required: true },
  secretCode:{type:String},
  participants:[participantSchema],
  isDeleted:{type:Boolean,default:false},
  isBlocked:{type:Boolean,default:false}
})

export const Room = mongoose.model<IRoom>('Room',RoomSchema)