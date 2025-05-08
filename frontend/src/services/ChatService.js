import { io } from "socket.io-client";
import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
export class ChatService {
    constructor(userId, onMessageReceived) {
        Object.defineProperty(this, "socket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onMessageReceived", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "friendsCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.userId = userId;
        this.onMessageReceived = onMessageReceived;
        const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
        this.socket = io(`${socketUrl}/chat`, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ["websocket"],
            forceNew: true,
        });
        console.log("ChatService socket initialized for user:", userId, "url :", this.socket.io.opts);
        this.setupSocketEvents();
        this.joinChatRoom();
    }
    joinChatRoom() {
        console.log("Joining chat room for user:", this.userId);
        this.socket.emit("join-chat", { userId: this.userId }, (response) => {
            console.log("Join chat response for", this.userId, ":", response);
        });
    }
    static getInstance(userId, onMessageReceived) {
        if (!ChatService.instance || ChatService.instance.userId !== userId) {
            ChatService.instance = new ChatService(userId, onMessageReceived);
        }
        else {
            ChatService.instance.onMessageReceived = onMessageReceived;
        }
        return ChatService.instance;
    }
    setupSocketEvents() {
        this.socket.on("connect", () => {
            console.log("Chat socket connected for user:", this.userId, "Socket ID:", this.socket.id);
            toast("connected to chat");
        });
        this.socket.on("connect_error", (error) => {
            console.error("Chat socket connection error for user:", this.userId, "Error:", error.message);
            console.log("Connection URI:", this.socket.io.opts);
            toast.error("Chat connection failed: " + error.message);
        });
        this.socket.on('receive-message', (message) => {
            console.log("Chat message received for user:", this.userId, "Message:", message);
            console.log("listening eventttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt Recieved message", message);
            toast.success("New Message");
            this.onMessageReceived(message);
        });
        this.socket.on('disconnect', (reason) => {
            console.log("Disconnected from chat server", reason);
            toast("Disconnected from chat");
        });
        this.socket.on("friend-call-incoming", (data) => {
            console.log("Incoming call from:", data.callerId, "Call ID:", data.callId);
            this.socket.emit("join-chat", { userId: data.callId }, (response) => {
                console.log("Joined call room:", data.callId, "Response:", response);
            });
        });
        this.socket.on("friend-call-ringing", (data) => {
            console.log("Call ringing for:", data.receiverId, "Call ID:", data.callId);
            toast("Ringing...", { id: data.callId });
        });
        this.socket.on("friend-call-accepted", (data) => {
            console.log("Call accepted by:", data.receiverId, "Call ID:", data.callId);
            toast.success("Call accepted", { id: data.callId });
        });
        this.socket.on("friend-call-rejected", (data) => {
            console.log("Call rejected, Call ID:", data.callId);
            toast.error("Call rejected", { id: data.callId });
        });
        this.socket.on("friend-call-ended", (data) => {
            console.log("Call ended, Call ID:", data.callId);
            toast.success("Call ended", { id: data.callId });
        });
    }
    startFriendCall(receiverId) {
        console.log("Starting friend call to:", receiverId);
        this.socket.emit("friend-start-call", { callerId: this.userId, receiverId });
    }
    acceptFriendCall(callId) {
        console.log("Accepting friend call:", callId);
        this.socket.emit("friend-accept-call", { callId, userId: this.userId });
    }
    rejectFriendCall(callId) {
        console.log("Rejecting friend call:", callId);
        this.socket.emit("friend-reject-call", { callId, userId: this.userId });
    }
    sendFriendOffer(callId, offer, to) {
        console.log("Sending friend offer for call:", callId);
        this.socket.emit("friend-offer", { callId, offer, to });
    }
    sendFriendAnswer(callId, answer, to) {
        console.log("Sending friend answer for call:", callId);
        this.socket.emit("friend-answer", { callId, answer, to });
    }
    sendFriendIceCandidate(callId, candidate, to) {
        console.log("Sending ICE candidate for call:", callId);
        this.socket.emit("friend-ice-candidate", { callId, candidate, to });
    }
    endFriendCall(callId) {
        console.log("Ending friend call:", callId);
        this.socket.emit("friend-end-call", { callId, userId: this.userId });
    }
    async fetchFriends() {
        try {
            const response = await axiosInstance.get("/user/chat/friends");
            this.friendsCache = response.data.data;
            return this.friendsCache;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message || "Failed to fetch friends");
            }
            throw new Error("Failed to fetch friends");
        }
    }
    getFriendById(friendId) {
        console.log("Friends cache:", this.friendsCache);
        console.log("Searching for friendId:", friendId);
        const friend = this.friendsCache.find((friend) => friend.id === friendId);
        console.log("dataaaaa", friend);
        return friend;
    }
    async sendMessage(receiverId, content, mediaUrl, mediaType = 'text') {
        try {
            console.log("passed from component ", receiverId, content, mediaUrl, mediaType);
            await axiosInstance.post("/chat/send", { receiverId, content, mediaUrl, mediaType });
        }
        catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message || "Failed to send message");
            }
            throw new Error("Failed to send message");
        }
    }
    async fetchChatHistory(receiverId) {
        try {
            const response = await axiosInstance.get(`/chat/history?receiverId=${receiverId}`);
            return response.data.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message || "Failed to fetch chat history");
            }
            throw new Error("Failed to fetch chat history");
        }
    }
    async markMessageAsRead(userId, friendId) {
        try {
            await axiosInstance.post('/chat/mark-read', { userId, friendId });
        }
        catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message || "Failed to mark messages as read");
            }
            throw new Error("Failed to mark messages as read");
        }
    }
    disconnect() {
        this.socket.disconnect();
    }
}
Object.defineProperty(ChatService, "instance", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
