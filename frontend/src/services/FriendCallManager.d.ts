import { ChatService } from "./ChatService";
export declare class FriendCallManager {
    private chatService;
    private state;
    private onStreamUpdate;
    constructor(chatService: ChatService, onStreamUpdate: (localStream: MediaStream | null, remoteStream: MediaStream | null) => void);
    startCall(receiverId: string): Promise<void>;
    acceptCall(callId: string, remoteUserId: string): Promise<void>;
    endCall(): void;
    toggleAudio(enabled: boolean): void;
    toggleVideo(enabled: boolean): void;
    private setupSocketEvents;
    private createPeerConnection;
}
