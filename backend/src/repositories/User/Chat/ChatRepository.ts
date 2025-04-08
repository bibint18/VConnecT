
import { IChatRepository } from "../../../interfaces/user/Chat/IChatRepository";
import { IMessage, IMessageInput, Message } from "../../../models/MessageModel";
import mongoose from "mongoose";

export class ChatRepository implements IChatRepository{
  async saveMessage(message: IMessageInput): Promise<void> {
    console.log("data from repo",message)
    const newMessage = new Message(message)
    await newMessage.save();
    console.log("saved data repo",newMessage)
  }

  async getMessages(senderId: string, recieverId: string): Promise<IMessage[]> {
    const messages = await Message.find({
      $or: [
        {senderId: new mongoose.Types.ObjectId(senderId),receiverId:new mongoose.Types.ObjectId(recieverId)},
        {senderId: new mongoose.Types.ObjectId(recieverId),receiverId:new mongoose.Types.ObjectId(senderId)}
      ]
    }).sort({timestamp:-1}).exec()
    console.log("messages from repo history",messages)
    return messages
  }

  async getLastMessage(senderId: string, recieverId: string): Promise<IMessage | null> {
    const message = Message.findOne({
      $or: [
        {senderId: new mongoose.Types.ObjectId(senderId),recieverId:new mongoose.Types.ObjectId(recieverId)},
        {senderId: new mongoose.Types.ObjectId(recieverId),recieverId:new mongoose.Types.ObjectId(senderId)}
      ]
    }).sort({timestamp:-1})
    return message
  }
}