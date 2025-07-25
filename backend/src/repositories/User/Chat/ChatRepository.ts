
import { IChatRepository } from "../../../interfaces/user/Chat/IChatRepository.js";
import { IMessage, IMessageInput, Message } from "../../../models/MessageModel.js";
import mongoose from "mongoose";

export class ChatRepository implements IChatRepository{
  async saveMessage(message: IMessageInput): Promise<void> {
    const newMessage = new Message(message)
    await newMessage.save();
  }

  async getMessages(senderId: string, recieverId: string): Promise<IMessage[]> {
    const messages = await Message.find({
      $or: [
        {senderId: new mongoose.Types.ObjectId(senderId),receiverId:new mongoose.Types.ObjectId(recieverId)},
        {senderId: new mongoose.Types.ObjectId(recieverId),receiverId:new mongoose.Types.ObjectId(senderId)}
      ]
    }).sort({timestamp:-1}).exec()
    return messages
  }

  async getLastMessage(senderId: string, recieverId: string): Promise<IMessage | null> {
    const message =await Message.findOne({
      $or: [
        {senderId: new mongoose.Types.ObjectId(senderId),receiverId:new mongoose.Types.ObjectId(recieverId)},
        {senderId: new mongoose.Types.ObjectId(recieverId),receiverId:new mongoose.Types.ObjectId(senderId)}
      ]
    }).sort({timestamp:-1})
    console.log("repo lastMessage",message)
    return message
  }

  async getUnreadMessageCount(userId:string,friendId:string):Promise<number>{
    const count = await Message.countDocuments({
      senderId:new mongoose.Types.ObjectId(friendId),
      receiverId:new mongoose.Types.ObjectId(userId),
      isRead:false
    })
    console.log("repo count",count)
    return count
  }

  async markMessageAsRead(userId:string,friendId:string):Promise<void>{
    await Message.updateMany({senderId:new mongoose.Types.ObjectId(friendId),receiverId:new mongoose.Types.ObjectId(userId),isRead:false},{$set:{isRead:true}})
  }
}