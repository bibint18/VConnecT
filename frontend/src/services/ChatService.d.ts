import { IMessage } from "@/components/User/Chat/ChatBox";
import { IFriend } from "./UserFriendService";
export declare class ChatService {
    private static instance;
    private socket;
    private userId;
    private onMessageReceived;
    private friendsCache;
    constructor(userId: string, onMessageReceived: (message: IMessage) => void);
    private joinChatRoom;
    static getInstance(userId: string, onMessageReceived: (message: IMessage) => void): ChatService;
    private setupSocketEvents;
    startFriendCall(receiverId: string): void;
    acceptFriendCall(callId: string): void;
    rejectFriendCall(callId: string): void;
    sendFriendOffer(callId: string, offer: RTCSessionDescriptionInit, to: string): void;
    sendFriendAnswer(callId: string, answer: RTCSessionDescriptionInit, to: string): void;
    sendFriendIceCandidate(callId: string, candidate: RTCIceCandidateInit, to: string): void;
    endFriendCall(callId: string): void;
    fetchFriends(): Promise<IFriend[]>;
    getFriendById(friendId: string): IFriend | undefined;
    sendMessage(receiverId: string, content?: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video'): Promise<void>;
    fetchChatHistory(receiverId: string): Promise<IMessage[]>;
    markMessageAsRead(userId: string, friendId: string): Promise<void>;
    disconnect(): void;
}
