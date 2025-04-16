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
    this.socket = io("http://localhost:3000/chat", { 
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      forceNew: true,
    });
    console.log("ChatService socket initialized for user:", userId, "url :",this.socket.io.opts);
    this.setupSocketEvents();
    this.joinChatRoom()
  }

  private joinChatRoom() {
    console.log("Joining chat room for user:", this.userId);
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
      console.log("Chat socket connected for user:", this.userId, "Socket ID:", this.socket.id);
      toast("connected to chat")
    })

    this.socket.on("connect_error", (error) => {
      console.error("Chat socket connection error for user:", this.userId, "Error:", error.message);
      console.log("Connection URI:", this.socket.io.opts);
      toast.error("Chat connection failed: " + error.message);
    });

    this.socket.on('receive-message',(message:IMessage) => {
      console.log("Chat message received for user:", this.userId, "Message:", message);
      console.log("listening eventttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt Recieved message",message);
      toast.success("New Message")
      this.onMessageReceived(message)
    })

    this.socket.on('disconnect',(reason) => {
      console.log("Disconnected from chat server",reason)
      toast("Disconnected from chat")
    })

    this.socket.on("friend-call-incoming", (data: { callId: string; callerId: string }) => {
      console.log("Incoming call from:", data.callerId, "Call ID:", data.callId);
      // toast(`Incoming call from ${data.callerId}`, {
      //   id: data.callId,
      //   duration: Infinity,
      //   position: "top-center",
      //   buttons: [
      //     ["Accept", () => this.acceptFriendCall(data.callId)],
      //     ["Reject", () => this.rejectFriendCall(data.callId)],
      //   ],
      // });
    });

    this.socket.on("friend-call-ringing", (data: { callId: string; receiverId: string }) => {
      console.log("Call ringing for:", data.receiverId, "Call ID:", data.callId);
      toast("Ringing...", { id: data.callId });
    });

    this.socket.on("friend-call-accepted", (data: { callId: string; receiverId: string }) => {
      console.log("Call accepted by:", data.receiverId, "Call ID:", data.callId);
      toast.success("Call accepted", { id: data.callId });
    });

    this.socket.on("friend-call-rejected", (data: { callId: string }) => {
      console.log("Call rejected, Call ID:", data.callId);
      toast.error("Call rejected", { id: data.callId });
    });

    this.socket.on("friend-call-ended", (data: { callId: string }) => {
      console.log("Call ended, Call ID:", data.callId);
      toast.success("Call ended", { id: data.callId });
    });
  }

  public startFriendCall(receiverId: string) {
    console.log("Starting friend call to:", receiverId);
    this.socket.emit("friend-start-call", { callerId: this.userId, receiverId });
  }

  public acceptFriendCall(callId: string) {
    console.log("Accepting friend call:", callId);
    this.socket.emit("friend-accept-call", { callId, userId: this.userId });
  }

  public rejectFriendCall(callId: string) {
    console.log("Rejecting friend call:", callId);
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
    console.log("Ending friend call:", callId);
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