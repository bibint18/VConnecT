export declare class CallManager {
    private socket;
    private localStream;
    private peerConnections;
    private roomId;
    private userId;
    private onStreamUpdate;
    constructor(roomId: string, userId: string, onStreamUpdate: (streams: Map<string, MediaStream>) => void);
    startCall(): Promise<void>;
    toggleVideo(enabled: boolean): void;
    leaveCall(): Promise<void>;
    private setupSocketEvents;
    private addPeerConnection;
    private createPeerConnection;
    private removePeerConnection;
    private updateStreams;
}
