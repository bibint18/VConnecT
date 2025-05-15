import {  Namespace, Socket } from "socket.io";
import { IChatRepository } from "../../../interfaces/user/Chat/IChatRepository.js";
import { IChatService } from "../../../interfaces/user/Chat/IChatService.js";
import { IMessage, IMessageInput } from "../../../models/MessageModel.js";
import mongoose  from "mongoose";
import { IFriendCallRepository } from "../../../interfaces/user/Call/IFriendCallRepository.js";
import { ICallInput } from "../../../models/CallModel.js";
import { ISubscriptionRepository } from "../../../repositories/User/SubscriptionRepository.js";
import { sendPush,PushPayload } from "../../../utils/push.js";
import { User } from "../../../models/User.js";
export class ChatService implements IChatService{
  private activeCallRequests = new Set<string>();
  constructor(private readonly chatRepository: IChatRepository, private readonly chatIo:Namespace,private readonly callRepository:IFriendCallRepository,private readonly subscriptionRepository:ISubscriptionRepository){
    console.log("ChatService initialized with chatIo:", chatIo ? "present" : "undefined");
    this.setupSocketEvents()
  }
  
  async sendMessage(senderId: string, recieverId: string, content?: string,mediaUrl?: string, mediaType: 'text' | 'image' | 'video' = 'text'): Promise<void> {
    const message:IMessageInput = {
      senderId:new mongoose.Types.ObjectId(senderId),
      receiverId:new mongoose.Types.ObjectId(recieverId),
      content:content,
      mediaUrl,
      mediaType,
      timestamp:new Date(),
      isRead:false
    };
    console.log("message from send service ",message)
    await this.chatRepository.saveMessage(message)
    this.chatIo.to(recieverId).emit("receive-message",message);
    this.chatIo.to(senderId).emit("receive-message",message)
    console.log("passed to sender and reciever")

    const subscription = await this.subscriptionRepository.getSubscriptionByUserId(recieverId);
    if (subscription) {
      const sender = await User.findById(senderId);
      const payload: PushPayload = {
        title: `New Message from ${sender?.name || 'Friend'}`,
        body: content || (mediaType === 'image' ? 'Sent an image' : 'Sent a video'),
        url: `/friends?friendId=${senderId}`, 
      };
      await sendPush(subscription.subscription, payload);
    }

    const lastMessage = await this.chatRepository.getLastMessage(senderId,recieverId);
    console.log("service last Message",lastMessage)
    const unreadCountSender = await this.chatRepository.getUnreadMessageCount(senderId,recieverId)
    console.log("service unread sender count",unreadCountSender)
    const unreadCountReceiver = await this.chatRepository.getUnreadMessageCount(recieverId,senderId)
    console.log("service unread receiever count",unreadCountReceiver)
    this.chatIo.to(senderId).emit('update-last-message',{
      friendId:recieverId,lastMessage,unreadCount:unreadCountSender
    })
    this.chatIo.to(recieverId).emit('update-last-message',{
      friendId:senderId,lastMessage,unreadCount:unreadCountReceiver
    })
  }

  

  async getChatHistory(senderId: string, recieverId: string): Promise<IMessage[]> {
    return this.chatRepository.getMessages(senderId,recieverId)
  }

  async getLastMessage(senderId: string, recieverId: string): Promise<IMessage | null> {
    const lastMessage = await this.chatRepository.getLastMessage(senderId,recieverId)
    console.log("get Lastmessafe",lastMessage)
    return lastMessage
  }

  async getUnreadMessageCount(userId:string,friendId:string):Promise<number>{
    const count =await this.chatRepository.getUnreadMessageCount(userId,friendId)
    console.log("geyUnread count",count)
    return count
  }

  handleSocketEvents(socket: Socket): void {
    socket.on('join-chat', ({ userId }, callback) => {
      console.log(`User ${userId} joining chat with socket ${socket.id}`);
      socket.data.userId = userId;
      socket.join(userId);
      if (callback) {
        callback({ status: 'success', rooms: Array.from(socket.rooms),socketId:socket.id });
      }
    });

    socket.on('send-message',async ({senderId,receiverId,content,mediaUrl,mediaType}) => {
      await this.sendMessage(senderId,receiverId,content,mediaUrl,mediaType)
    })

    socket.on('disconnect',() => {
      console.log("User disconnected from chat",socket.id)
    })
  }

  private setupSocketEvents() {
    this.chatIo.on("connection", (socket: Socket) => {
      console.log(`New connection ${socket.id} from user ${socket.handshake.auth?.userId}`);

      socket.use(([event, ...args], next) => {
        console.log(`Socket event: ${event}`);
        next();
      });

      socket.on("join-chat", ({ userId }, callback) => {
        console.log(`User ${userId} joining with socket ${socket.id}`);
        socket.data.userId = userId;
        socket.join(userId);
        if (callback) {
          callback({ 
            status: "success", 
            rooms: Array.from(socket.rooms),
            socketId: socket.id 
          });
        }
      });

      socket.on("friend-start-call", async ({ callerId, receiverId }) => {
        const requestKey = `${callerId}_${receiverId}`;
        if (this.activeCallRequests.has(requestKey)) {
          console.log(`Ignoring duplicate friend-start-call: ${requestKey}`);
          return;
        }
        this.activeCallRequests.add(requestKey);
        try {
          console.count("Processing friend-start-call");
          console.log("Received friend-start-call:", { callerId, receiverId });
          await this.startFriendCall(callerId, receiverId);
        } catch (error) {
          console.error("Error in friend-start-call:", error);
          this.chatIo.to(callerId).emit("friend-call-error", { message: "Failed to start call" });
        } finally {
          this.activeCallRequests.delete(requestKey);
        }
      });

      socket.on("friend-accept-call", async ({ callId, userId }) => {
        console.log("Received friend-accept-call:", { callId, userId });
        await this.acceptFriendCall(callId, userId,socket);
      });

      socket.on("friend-reject-call", async ({ callId, userId }) => {
        console.log("Received friend-reject-call:", { callId, userId });
        await this.rejectFriendCall(callId, userId);
      });

      socket.on("friend-offer", ({ callId, offer, to }) => {
        console.log("Received friend-offer:", { callId, to });
        this.chatIo.to(to).emit("friend-offer", { callId, offer, from: socket.id });
      });

      socket.on("friend-answer", ({ callId, answer, to }) => {
        console.log("Received friend-answer:", { callId, to });
        this.chatIo.to(callId).emit("friend-answer", { callId, answer, from: socket.id });
      });

      socket.on("friend-ice-candidate", ({ callId, candidate, to }) => {
        console.log("Received friend-ice-candidate:", { callId, to });
        this.chatIo.to(callId).emit("friend-ice-candidate", { callId, candidate, from: socket.id });
      });

      socket.on("friend-end-call", async ({ callId, userId }) => {
        console.log("Received friend-end-call:", { callId, userId });
        await this.endFriendCall(callId, userId);
      });
    });
  }

  async startFriendCall(callerId: string, receiverId: string): Promise<void> {
    const uniqueSuffix = Date.now().toString();
    const callId = `call_${[callerId, receiverId].sort().join("_")}_${uniqueSuffix}`;
    const call:ICallInput = {
      callerId,
      receiverId,
      callId,
      startTime: new Date(),
      status: "INITIATED",
    };
    console.log("Creating new call:", callId);
    await this.callRepository.createCall(call);
    const receiverSocket = await this.isUserConnected(receiverId);
    if (!receiverSocket) {
      throw new Error("Receiver is not connected");
    }
  
    console.log("Call initiated:", callId);
    console.log(`Emitting friend-call-incoming to receiver: ${receiverId}`);
    this.chatIo.to(receiverId).emit("friend-call-incoming", { callId, callerId });
    console.log(`Emitted friend-call-incoming to receiver: ${receiverId}`);
    console.log(`Emitting friend-call-ringing to caller: ${callerId}`);
    this.chatIo.to(callerId).emit("friend-call-ringing", { callId, receiverId });
    console.log(`Emitted friend-call-ringing to caller: ${callerId}`);
  }

  private async isUserConnected(userId: string): Promise<boolean> {
    try {
      // This is more reliable than checking sockets directly
      const sockets = await this.chatIo.in(userId).allSockets();
      return sockets.size > 0;
    } catch (error) {
      console.error("Error checking user connection:", error);
      return false;
    }
  }

  async acceptFriendCall(callId: string, userId: string,socket:Socket): Promise<void> {
    const call = await this.callRepository.findCallById(callId);
    if (call && call.status === "INITIATED") {
      await this.callRepository.updateCall(callId, { status: "ACCEPTED" });
      socket.join(callId)
      this.chatIo.in(call.callerId.toString()).socketsJoin(callId);
      this.chatIo.to(callId).emit("friend-call-accepted", { callId, receiverId: userId });
      console.log(`${userId} accepted call: ${callId}`);
    }
  }

  async rejectFriendCall(callId: string, userId: string): Promise<void> {
    const call = await this.callRepository.findCallById(callId);
    if (call && call.status === "INITIATED") {
      await this.callRepository.updateCall(callId, { status: "REJECTED", endTime: new Date() });
      this.chatIo.to(call.callerId.toString()).emit("friend-call-rejected", { callId });
      console.log(`${userId} rejected call: ${callId}`);
    }
  }

  async endFriendCall(callId: string, userId: string): Promise<void> {
    const call = await this.callRepository.findCallById(callId);
    if (call && (call.status === "ACCEPTED" || call.status === "INITIATED")) {
      const newStatus = call.status === "ACCEPTED" ? "COMPLETED" : "MISSED";
      const endTime = new Date();
      await this.callRepository.updateCall(callId, { status: newStatus, endTime });

      const message: IMessageInput = {
        senderId: call.callerId,
        receiverId: call.receiverId,
        content: `Call ${newStatus} at ${endTime.toLocaleTimeString()}`,
        timestamp: endTime,
        isRead: false,
      };
      const savedMessage = await this.chatRepository.saveMessage(message);
      this.chatIo.to(call.callerId.toString()).emit("receive-message", savedMessage);
      this.chatIo.to(call.receiverId.toString()).emit("receive-message", savedMessage);

      this.chatIo.to(callId).emit("friend-call-ended", { callId });
      console.log(`Call ended: ${callId} by ${userId}`);
    }
  }

  async markMessagesAsRead(userId:string,friendId:string):Promise<void>{
    await this.chatRepository.markMessageAsRead(userId,friendId)
  }
}