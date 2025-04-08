import mongoose,{Document,Schema, Types} from "mongoose";


export interface IMessageInput {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId; 
  content: string;
  timestamp?: Date; 
  isRead?: boolean; 
}
export interface IMessage extends Document{
  senderId:Types.ObjectId;
  receiverId:Types.ObjectId;
  content:string;
  timestamp:Date;
  isRead:boolean;
}

const MessageSchema = new Schema<IMessage>({
  senderId:{type:Schema.Types.ObjectId, ref:"User",required:true
  },
  receiverId:{type:Schema.Types.ObjectId,ref:"User",required:true},
  content:{type:String,required:true},
  timestamp:{type:Date,default:Date.now},
  isRead:{type:Boolean,default:false}
})

export const Message = mongoose.model<IMessage>('Message',MessageSchema)