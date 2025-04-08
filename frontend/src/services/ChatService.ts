import { io,Socket } from "socket.io-client";
import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
import { IMessage } from "@/components/User/Chat/ChatBox";
import { IFriend } from "./UserFriendService";
import toast from "react-hot-toast";

export class ChatService {
  private static instance: ChatService | null = null;
  private socket:Socket;
  private userId:string;
  private onMessageReceived: (message:IMessage) => void
  private friendsCache:IFriend[] = []
  constructor(userId:string,onMessageReceived:(message:IMessage) => void){
    this.userId=userId;
    this.onMessageReceived=onMessageReceived;
    // this.socket = io("http://localhost:3000", {
    //   path: "/socket.io/chat",
    //   withCredentials: true,
    // });
    this.socket = io("http://localhost:3000/chat", { // Connect to /chat namespace
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    console.log("ChatService socket initialized, connecting to:", "http://localhost:3000/socket.io/chat");
    this.setupSocketEvents();
    this.socket.emit('join-chat',{userId:this.userId})
  }

  public static getInstance(userId: string, onMessageReceived: (message: IMessage) => void): ChatService {
    if (!ChatService.instance || ChatService.instance.userId !== userId) {
      ChatService.instance = new ChatService(userId, onMessageReceived);
    }
    return ChatService.instance;
  }

  private setupSocketEvents(){
    this.socket.on("connect",() => {
      console.log("Connected to chat Server")
      toast("connected to chat")
    })

    this.socket.on('receive-message',(message:IMessage) => {
      console.log("listening eventttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt Recieved message",message);
      toast.success("New Message")
      this.onMessageReceived(message)
    })

    this.socket.on('disconnect',() => {
      console.log("Disconnected from chat server")
      toast("Disconnected from chat")
    })
  }

  public async fetchFriends(): Promise<IFriend[]> {
    try {
      const response = await axiosInstance.get("/user/chat/friends");
      this.friendsCache = response.data.data
      return this.friendsCache
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message || "Failed to fetch friends");
      }
      throw new Error("Failed to fetch friends");
    }
  }

  public getFriendById(friendId: string): IFriend | undefined {
    console.log("Friends cache:", this.friendsCache);
    console.log("Searching for friendId:", friendId);
    const friend =this.friendsCache.find((friend) => friend.id === friendId);
    console.log("dataaaaa",friend)
    return friend
  }

  public async sendMessage(receiverId: string, content: string): Promise<void> {
    try {
      console.log("passed from component ",receiverId,content)
      await axiosInstance.post("/chat/send", { receiverId, content });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message || "Failed to send message");
      }
      throw new Error("Failed to send message");
    }
  }

  public async fetchChatHistory(receiverId: string): Promise<IMessage[]> {
    try {
      const response = await axiosInstance.get(`/chat/history?receiverId=${receiverId}`);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message || "Failed to fetch chat history");
      }
      throw new Error("Failed to fetch chat history");
    }
  }

  public disconnect() {
    this.socket.disconnect();
  }
}