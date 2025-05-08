type StreamCallback = (localStream: MediaStream | null, remoteStream: MediaStream | null) => void;
export interface CallDetails {
    callerId: string;
    receiverId: string;
    status: string;
}
export declare class DirectCallManager {
    private socket;
    private peerConnection;
    private localStream;
    private remoteStream;
    private callId;
    private userId;
    private username;
    private callDetails;
    private streamCallback;
    private isCallActive;
    constructor(callId: string, userId: string, callDetails: CallDetails, streamCallback: StreamCallback);
    private setupPeerConnection;
    private setupSocketListeners;
    startCall(): Promise<void>;
    acceptCall(): Promise<void>;
    toggleVideo(enabled: boolean): void;
    toggleAudio(enabled: boolean): void;
    endCall(): void;
    isCallActiveState(): boolean;
}
export {};
