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
    const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL
    this.socket = io(`${socketUrl}/chat`, { 
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      forceNew: true,
    });
    this.setupSocketEvents();
    this.joinChatRoom()
  }

  private joinChatRoom() {
    this.socket.emit("join-chat", { userId: this.userId }, (response: unknown) => {
      console.log("Join chat response for", this.userId, ":", response);
    });
  }

  public static getInstance(userId: string, onMessageReceived: (message: IMessage) => void): ChatService {
    if (!ChatService.instance || ChatService.instance.userId !== userId) {
      ChatService.instance = new ChatService(userId, onMessageReceived);
    } else {
      ChatService.instance.onMessageReceived = onMessageReceived; 
    }
    return ChatService.instance;
  }

  private setupSocketEvents(){
    this.socket.on("connect",() => {
      toast("connected to chat")
    })

    this.socket.on("connect_error", (error) => {
      toast.error("Chat connection failed: " + error.message);
    });

    this.socket.on('receive-message',(message:IMessage) => {
      toast.success("New Message")
      this.onMessageReceived(message)
    })

    this.socket.on('disconnect',(reason) => {
      console.log("Disconnected from chat server",reason)
      toast("Disconnected from chat")
    })

    this.socket.on("friend-call-incoming", (data: { callId: string; callerId: string }) => {
      this.socket.emit("join-chat",{userId:data.callId},(response:unknown) => {
        console.log("Joined call room:", data.callId, "Response:", response);
      })
    });

    this.socket.on("friend-call-ringing", (data: { callId: string; receiverId: string }) => {
      toast("Ringing...", { id: data.callId });
    });

    this.socket.on("friend-call-accepted", (data: { callId: string; receiverId: string }) => {
      toast.success("Call accepted", { id: data.callId });
    });

    this.socket.on("friend-call-rejected", (data: { callId: string }) => {
      toast.error("Call rejected", { id: data.callId });
    });

    this.socket.on("friend-call-ended", (data: { callId: string }) => {
      toast.success("Call ended", { id: data.callId });
    });
  }

  public startFriendCall(receiverId: string) {
    this.socket.emit("friend-start-call", { callerId: this.userId, receiverId });
  }

  public acceptFriendCall(callId: string) {
    this.socket.emit("friend-accept-call", { callId, userId: this.userId });
  }

  public rejectFriendCall(callId: string) {
    this.socket.emit("friend-reject-call", { callId, userId: this.userId });
  }

  public sendFriendOffer(callId: string, offer: RTCSessionDescriptionInit, to: string) {
    this.socket.emit("friend-offer", { callId, offer, to });
  }

  public sendFriendAnswer(callId: string, answer: RTCSessionDescriptionInit, to: string) {
    this.socket.emit("friend-answer", { callId, answer, to });
  }

  public sendFriendIceCandidate(callId: string, candidate: RTCIceCandidateInit, to: string) {
    this.socket.emit("friend-ice-candidate", { callId, candidate, to });
  }

  public endFriendCall(callId: string) {
    this.socket.emit("friend-end-call", { callId, userId: this.userId });
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
    const friend =this.friendsCache.find((friend) => friend.id === friendId);
    return friend
  }

  public async sendMessage(receiverId: string, content?: string,mediaUrl?: string, mediaType: 'text' | 'image' | 'video' = 'text'): Promise<void> {
    try {
      await axiosInstance.post("/chat/send", { receiverId, content,mediaUrl,mediaType });
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

  public async markMessageAsRead(userId:string,friendId:string):Promise<void>{
    try {
      await axiosInstance.post('/chat/mark-read',{userId,friendId})
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message || "Failed to mark messages as read");
      }
      throw new Error("Failed to mark messages as read");
    }
  }

  public disconnect() {
    this.socket.disconnect();
  }
}