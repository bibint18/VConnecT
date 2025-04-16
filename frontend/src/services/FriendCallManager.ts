import { ChatService } from "./ChatService";

interface CallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  callId: string | null;
  remoteUserId: string | null;
}

export class FriendCallManager {
  private chatService: ChatService;
  private state: CallState = {
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    callId: null,
    remoteUserId: null,
  };
  private onStreamUpdate: (localStream: MediaStream | null, remoteStream: MediaStream | null) => void;

  constructor(chatService: ChatService, onStreamUpdate: (localStream: MediaStream | null, remoteStream: MediaStream | null) => void) {
    this.chatService = chatService;
    this.onStreamUpdate = onStreamUpdate;
    this.setupSocketEvents();
  }

  // public async startCall(receiverId: string) {
  //   console.log("Starting call to:", receiverId);
  //   try {
  //     this.state.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     this.state.callId = `call_${[this.chatService['userId'], receiverId].sort().join("_")}`;
  //     this.state.remoteUserId = receiverId;
  //     this.onStreamUpdate(this.state.localStream, null);
  //     this.chatService.startFriendCall(receiverId);
  //     console.log("Call started to:", receiverId);
  //   } catch (error) {
  //     console.error("Error starting call:", error);
  //     throw error;
  //   }
  // }

  public async startCall(receiverId: string) {
    console.log("Starting call to:", receiverId);
    try {
      // Clear any previous streams
      if (this.state.localStream) {
        this.state.localStream.getTracks().forEach(track => track.stop());
      }
      
      this.state.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Generate a unique call ID
      this.state.callId = `call_${[this.chatService['userId'], receiverId].sort().join("_")}_${Date.now()}`;
      this.state.remoteUserId = receiverId;
      
      this.onStreamUpdate(this.state.localStream, null);
      
      // Add timeout for call initiation
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Call initiation timeout")), 10000)
      );
      
      await Promise.race([
        this.chatService.startFriendCall(receiverId),
        timeout
      ]);
      
      console.log("Call started to:", receiverId);
    } catch (error) {
      console.error("Error starting call:", error);
      this.endCall();
      throw error;
    }
  }

  public async acceptCall(callId: string, remoteUserId: string) {
    try {
      this.state.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.state.callId = callId;
      this.state.remoteUserId = remoteUserId;
      console.log("callId remote userId from acceptcall",callId,remoteUserId)
      this.onStreamUpdate(this.state.localStream, null);
      this.createPeerConnection();
      this.chatService.acceptFriendCall(callId);
      console.log("Call accepted successfully");
    } catch (error) {
      console.error("Error accepting call:", error);
      throw error;
    }
  }

  public endCall() {
    if (this.state.peerConnection) {
      this.state.peerConnection.close();
    }
    if (this.state.localStream) {
      this.state.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.state.callId) {
      this.chatService.endFriendCall(this.state.callId);
    }
    this.state = { localStream: null, remoteStream: null, peerConnection: null, callId: null, remoteUserId: null };
    this.onStreamUpdate(null, null);
  }

  public toggleAudio(enabled: boolean) {
    if (this.state.localStream) {
      this.state.localStream.getAudioTracks().forEach((track) => (track.enabled = enabled));
    }
  }

  public toggleVideo(enabled: boolean) {
    if (this.state.localStream) {
      this.state.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
    }
  }

  private setupSocketEvents() {
    this.chatService['socket'].on("friend-call-accepted", async (data: { callId: string; receiverId: string }) => {
      this.state.callId = data.callId;
      this.state.remoteUserId = data.receiverId;
      this.createPeerConnection();
      const offer = await this.state.peerConnection!.createOffer();
      await this.state.peerConnection!.setLocalDescription(offer);
      this.chatService.sendFriendOffer(data.callId, offer, data.receiverId);
    });

    this.chatService['socket'].on("friend-offer", async (data: { callId: string; offer: RTCSessionDescriptionInit; from: string }) => {
      if (this.state.peerConnection) {
        await this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await this.state.peerConnection.createAnswer();
        await this.state.peerConnection.setLocalDescription(answer);
        this.chatService.sendFriendAnswer(data.callId, answer, data.from);
      }
    });

    this.chatService['socket'].on("friend-answer", async (data: { callId: string; answer: RTCSessionDescriptionInit; from: string }) => {
      if (this.state.peerConnection) {
        await this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.chatService['socket'].on("friend-ice-candidate", async (data: { callId: string; candidate: RTCIceCandidateInit; from: string }) => {
      if (this.state.peerConnection) {
        await this.state.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    this.chatService['socket'].on("friend-call-ended", () => {
      this.endCall();
    });
  }

  private createPeerConnection() {
    this.state.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    if (this.state.localStream) {
      this.state.localStream.getTracks().forEach((track) => {
        this.state.peerConnection!.addTrack(track, this.state.localStream!);
      });
    }

    // this.state.peerConnection.ontrack = (event) => {
    //   this.state.remoteStream = event.streams[0];
    //   this.onStreamUpdate(this.state.localStream, this.state.remoteStream);
    // };

    this.state.peerConnection.ontrack = (event) => {
    if (!this.state.remoteStream) {
      this.state.remoteStream = new MediaStream();
    }
    event.streams[0].getTracks().forEach(track => {
      this.state.remoteStream?.addTrack(track);
    });
    this.onStreamUpdate(this.state.localStream, this.state.remoteStream);
  };

    this.state.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.state.callId && this.state.remoteUserId) {
        this.chatService.sendFriendIceCandidate(this.state.callId, event.candidate, this.state.remoteUserId);
      }
    };

    this.state.peerConnection.onconnectionstatechange = () => {
      console.log("Peer connection state:", this.state.peerConnection!.connectionState);
      if (this.state.peerConnection!.connectionState === "failed") {
        this.endCall();
      }
    };
  }
}