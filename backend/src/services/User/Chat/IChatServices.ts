import { Namespace, Server,Socket } from "socket.io";
import { IChatRepository } from "../../../interfaces/user/Chat/IChatRepository";
import { IChatService } from "../../../interfaces/user/Chat/IChatService";
import { IMessage, IMessageInput } from "../../../models/MessageModel";
import mongoose, { mongo } from "mongoose";

export class ChatService implements IChatService{
  constructor(private readonly chatRepository: IChatRepository, private readonly chatIo:Namespace){
    console.log("ChatService initialized with chatIo:", chatIo ? "present" : "undefined");
  }
  
  async sendMessage(senderId: string, recieverId: string, content: string): Promise<void> {
    const message:IMessageInput = {
      // id:new Date().toISOString(),
      senderId:new mongoose.Types.ObjectId(senderId),
      receiverId:new mongoose.Types.ObjectId(recieverId),
      content:content,
      timestamp:new Date(),
      isRead:false
    };
    console.log("message from send service ",message)
    await this.chatRepository.saveMessage(message)
    this.chatIo.to(recieverId).emit("receive-message",message);
    this.chatIo.to(senderId).emit("receive-message",message)
    console.log("passed to sender and reciever")
  }

  async getChatHistory(senderId: string, recieverId: string): Promise<IMessage[]> {
    console.log("service layer history",senderId,recieverId)
    return this.chatRepository.getMessages(senderId,recieverId)
  }

  async getLastMessage(senderId: string, recieverId: string): Promise<IMessage | null> {
    return this.chatRepository.getLastMessage(senderId,recieverId)
  }

  handleSocketEvents(socket: Socket): void {

    
    socket.on('join-chat',({userId}) => {
      socket.join(userId)
      console.log(`${userId} joined chat room`)
    })

    socket.on('send-message',async ({senderId,receiverId,content}) => {
      await this.sendMessage(senderId,receiverId,content)
    })

    socket.on('disconnect',() => {
      console.log("User disconnected from chat",socket.id)
    })
  }
}