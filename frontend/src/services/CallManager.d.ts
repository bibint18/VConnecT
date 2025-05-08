export declare class CallManager {
    private socket;
    private localStream;
    private peerConnections;
    private roomId;
    private userId;
    private username;
    private onStreamUpdate;
    constructor(roomId: string, userId: string, username: string, onStreamUpdate: (streams: Map<string, {
        stream: MediaStream;
        username: string;
    }>) => void);
    sendFriendRequest(toUserId: string): void;
    startCall(audioDeviceId?: string): Promise<void>;
    getAudioDevices(): Promise<MediaDeviceInfo[]>;
    switchAudioDevice(deviceId: string): Promise<void>;
    leaveCall(): void;
    toggleAudio(enabled: boolean): void;
    toggleVideo(enabled: boolean): void;
    private setupSocketEvents;
    private addPeerConnection;
    private createPeerConnection;
    private removePeerConnection;
    private updateStreams;
    isAudioEnabled(): boolean;
}
