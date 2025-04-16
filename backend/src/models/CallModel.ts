import mongoose,{Schema,Document, mongo} from "mongoose";

export interface ICall extends Document{
  callerId:mongoose.Types.ObjectId;
  receiverId:mongoose.Types.ObjectId;
  callId:string;
  startTime:Date;
  endTime?:Date;
  status: "INITIATED" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "MISSED";
}
export interface ICallInput {
  callerId: string | mongoose.Types.ObjectId;
  receiverId: string | mongoose.Types.ObjectId;
  callId: string;
  startTime: Date;
  endTime?:Date;
  status: "INITIATED" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "MISSED";
}
const CallSchema:Schema = new Schema<ICall>({
  callerId:{type:Schema.Types.ObjectId,ref:"User",required:true},
  receiverId:{type:Schema.Types.ObjectId,ref:"User",required:true},
  callId:{type:String,required:true,unique:true},
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ["INITIATED", "ACCEPTED", "REJECTED", "COMPLETED", "MISSED"],
    required: true,
  },
})

export const Call = mongoose.model<ICall>('Call',CallSchema)