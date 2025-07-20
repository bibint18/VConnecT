
import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

type StreamCallback = (localStream: MediaStream | null, remoteStream: MediaStream | null) => void;

export interface CallDetails {
  callerId: string;
  receiverId: string;
  status: string;
}

export class DirectCallManager {
  private socket: Socket;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callId: string;
  private userId: string;
  private username: string;
  private callDetails: CallDetails; // CHANGE: Added callDetails property
  private streamCallback: StreamCallback;
  private isCallActive: boolean = false;

  constructor(callId: string, userId: string, callDetails: CallDetails, streamCallback: StreamCallback) {
    this.callId = callId;
    this.userId = userId;
    this.username = userId; 
    this.callDetails = callDetails; 
    this.streamCallback = streamCallback;
    const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL
    console.log("socket url",socketUrl)
    this.socket = io(socketUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to signaling server");
      // this.socket.emit("join-call", { roomId: this.callId, userId: this.userId, username: this.username });
      this.socket.emit("directCall:join", { callId: this.callId, userId: this.userId });
      console.log(`Joined call room: ${this.callId}`);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Failed to connect to call server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason !== "io client disconnect") {
        toast.error("Disconnected from call server, trying to reconnect...");
      }
    });

    this.socket.on("reconnect", () => {
      console.log("Socket reconnected");
      toast.success("Reconnected to call server");
      this.socket.emit("join-call", { roomId: this.callId, userId: this.userId, username: this.username });
      this.socket.emit("directCall:join", { callId: this.callId, userId: this.userId });
      console.log(`Rejoined call room: ${this.callId}`);
    });

    this.socket.on("reconnect_failed", () => {
      console.log("Socket reconnection failed");
      toast.error("Failed to reconnect to call server");
      if (this.isCallActive) {
        this.endCall();
      }
    });

    this.setupSocketListeners();
  }

  private async setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        this.socket.emit("directCall:ice-candidate", {
          callId: this.callId,
          candidate: event.candidate,
          to: this.userId === this.callDetails.callerId ? this.callDetails.receiverId : this.callDetails.callerId, 
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log("Received remote track");
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
      this.remoteStream.addTrack(event.track);
      this.streamCallback(this.localStream, this.remoteStream);
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }
  }

  private setupSocketListeners() {

    this.socket.on("directCall:offer", async ({ offer, from }) => {
      console.log("Received offer:", { offer, from });
      try {
        if (!this.peerConnection) {
          console.error("Peer connection not initialized");
          return;
        }
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        console.log("Emitting answer for call:", this.callId);
        this.socket.emit("directCall:answer", {
          callId: this.callId,
          answer,
          to: from,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    this.socket.on("directCall:answer", async ({ answer, from }) => {
      if (!this.peerConnection) {
        console.log("Peer connection not initialized for answer");
        return;
      }
      console.log("Received answer from:", from);
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socket.on("directCall:ice-candidate", async ({ candidate, from }) => {
      if (!this.peerConnection) {
        console.log("Peer connection not initialized for ICE candidate");
        return;
      }
      console.log("Received ICE candidate from:", from);
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.socket.on("directCall:ended", () => {
      console.log("Call ended by peer");
      this.endCall();
      toast("Call ended by the other user");
    });

    this.socket.on("directCall:error", ({ message }) => {
      console.error("Call error:", message);
      toast.error(message);
      this.endCall();
    });
  }

  async startCall() {
    try {
      this.isCallActive = true;
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("start call reached hereeeeeeeee")
      this.streamCallback(this.localStream, this.remoteStream);
      await this.setupPeerConnection();
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      console.log("Emitting offer for call:", this.callId);
      this.socket.emit("directCall:offer", {
        callId: this.callId,
        offer,
        to: this.userId === this.callDetails.callerId ? this.callDetails.receiverId : this.callDetails.callerId, 
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call");
      this.endCall();
    }
  }

  async acceptCall() {
    try {
      this.isCallActive = true;
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.streamCallback(this.localStream, this.remoteStream);
      await this.setupPeerConnection();
      console.log("Call accepted, waiting for offer");
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Failed to accept call");
      this.endCall();
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
      console.log("Video toggled:", enabled);
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
      console.log("Audio toggled:", enabled);
    }
  }

  endCall() {
    if (!this.isCallActive) {
      console.log("Call already ended or not active");
      return;
    }
    this.isCallActive = false;
    console.log("Ending call");
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.streamCallback(null, null);
    this.socket.emit("directCall:end", { callId: this.callId, userId: this.userId });
    this.socket.disconnect();
  }

  isCallActiveState(): boolean {
    return this.isCallActive;
  }
}