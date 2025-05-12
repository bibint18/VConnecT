// frontend/src/services/CallManager.ts
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { createTurnConfig } from "@/utils/createTurnServer";

interface PeerConnection {
  pc: RTCPeerConnection;
  userId: string;
  socketId: string;
  username: string;
  stream?: MediaStream;
}

export class CallManager {
  private socket: Socket;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private roomId: string;
  private userId: string;
  private username: string;
  private onStreamUpdate: (
    streams: Map<string, { stream: MediaStream; username: string }>
  ) => void;

  constructor(
    roomId: string,
    userId: string,
    username: string,
    onStreamUpdate: (
      streams: Map<string, { stream: MediaStream; username: string }>
    ) => void
  ) {
    this.roomId = roomId;
    this.userId = userId;
    this.username = username;
    this.onStreamUpdate = onStreamUpdate;
    const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
    this.socket = io(socketUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    this.setupSocketEvents();
    this.socket.emit("register-user", { userId: this.userId });
  }
  public sendFriendRequest(toUserId: string) {
    this.socket.emit(
      "send-friend-request",
      { to: toUserId },
      (response: { success?: boolean; error?: string }) => {
        if (response.success) {
          toast.success("Friend request sent!");
        } else {
          toast.error(response.error || "Failed to send friend request");
        }
      }
    );
  }

  public async startCall(audioDeviceId?: string) {
    try {
      if (!this.localStream) {
        const constarints = {
          video: true,
          audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        };
        this.localStream = await navigator.mediaDevices.getUserMedia(
          constarints
        );
        console.log(
          "local streams acquired with constraints",
          constarints,
          this.localStream
        );
      }
      this.updateStreams();
      this.socket.emit("join-call", {
        roomId: this.roomId,
        userId: this.userId,
        username: this.username,
      });
    } catch (error) {
      console.log("Error starting call", error);
      toast.error("Failed to access Media devices");
    }
  }

  public async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("devices ", devices);
      return devices.filter((device) => device.kind === "audioinput");
    } catch (error) {
      console.log("error enumurating devices", error);
      toast.error("Failed to list audio devices");
      return [];
    }
  }

  public async switchAudioDevice(deviceId: string) {
    if (!this.localStream) return;
    this.localStream.getTracks().forEach((track) => track.stop());
    await this.startCall(deviceId);
    this.peerConnections.forEach((peer) => {
      peer.pc.getSenders().forEach((sender) => peer.pc.removeTrack(sender));
      this.localStream!.getTracks().forEach((track) =>
        peer.pc.addTrack(track, this.localStream!)
      );
      console.log("switched audio device to ", deviceId);
    });
  }
  public leaveCall() {
    this.socket.emit("leave-call", {
      roomId: this.roomId,
      userId: this.userId,
    });
    this.peerConnections.forEach((peer) => peer.pc.close());
    this.peerConnections.clear();
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.socket.disconnect();
    this.updateStreams();
    console.log("Call left");
  }

  public toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
        console.log(
          `Audio track ${enabled ? "enabled" : "disabled"} for user ${
            this.userId
          }`
        );
      });
    }
  }

  public toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = enabled));
    }
  }

  private setupSocketEvents() {
    this.socket.on("connect", () => {
      console.log("Connected to signaling server");
    });
    this.socket.on(
      "friend-request-received",
      (data: { requestId: string; from: string }) => {
        toast.info(`Friend request received from user ${data.from}`);
      }
    );

    this.socket.on("friend-request-sent", (data: { to: string }) => {
      console.log(`Friend request sent to ${data.to}`);
    });

    this.socket.on("friend-request-accepted", (data: { by: string }) => {
      toast.success(`Friend request accepted by user ${data.by}`);
    });

    this.socket.on("friend-request-rejected", (data: { by: string }) => {
      toast.info(`Friend request rejected by user ${data.by}`);
    });

    this.socket.on("reconnect", () => {
      console.log("Reconnected to signaling server");
      if (this.localStream) {
        this.socket.emit("join-call", {
          roomId: this.roomId,
          userId: this.userId,
          username: this.username,
        });
      }
    });

    this.socket.on(
      "user-joined",
      (data: { userId: string; socketId: string; username: string }) => {
        console.log("User joined:", data);
        if (data.socketId !== this.socket.id) {
          this.addPeerConnection(data.userId, data.socketId, data.username);
        }
      }
    );

    this.socket.on(
      "user-left",
      (data: { userId: string; socketId: string }) => {
        console.log("User left:", data);
        this.removePeerConnection(data.socketId);
      }
    );

    this.socket.on(
      "offer",
      async (data: {
        offer: RTCSessionDescriptionInit;
        from: string;
        username: string;
      }) => {
        console.log("Received offer from:", data.from, data.offer);
        const { offer, from, username } = data;
        let peer = this.peerConnections.get(from);
        if (!peer) {
          peer =await this.createPeerConnection(from, from, username); // Use socketId as userId for uniqueness
          this.peerConnections.set(from, peer);
        } else if (peer.username !== username) {
          peer.username = username;
          this.updateStreams();
        }
        try {
          await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.pc.createAnswer();
          await peer.pc.setLocalDescription(answer);
          this.socket.emit("answer", {
            roomId: this.roomId,
            answer,
            to: from,
            username: this.username,
          });
          console.log("Sent answer to:", from, answer);
        } catch (err) {
          console.error("Error handling offer:", err);
        }
      }
    );

    this.socket.on(
      "answer",
      async (data: {
        answer: RTCSessionDescriptionInit;
        from: string;
        username: string;
      }) => {
        console.log("Received answer from:", data.from, data.answer);
        const { answer, from, username } = data;
        const peer = this.peerConnections.get(from);
        if (peer) {
          if (peer.username !== username) {
            peer.username = username;
            this.updateStreams();
          }
          if (peer.pc.signalingState === "have-local-offer") {
            try {
              await peer.pc.setRemoteDescription(
                new RTCSessionDescription(answer)
              );
            } catch (err) {
              console.error("Error setting remote answer:", err);
            }
          }
        }
      }
    );

    this.socket.on(
      "ice-candidate",
      async (data: { candidate: RTCIceCandidateInit; from: string }) => {
        console.log("Received ICE candidate from:", data.from, data.candidate);
        const { candidate, from } = data;
        const peer = this.peerConnections.get(from);
        if (peer && peer.pc.remoteDescription) {
          try {
            await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("ICE error:", err);
          }
        } else {
          console.log(
            "Skipping ICE candidate - no remote description yet for:",
            from
          );
        }
      }
    );

    this.socket.on("error", (data: { message: string }) => {
      console.error("Server error:", data.message);
      toast.error(data.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      // toast.warn('Disconnected from server, attempting to reconnect...');
    });
  }

  private async addPeerConnection(
    userId: string,
    socketId: string,
    username: string
  ) {
    if (this.peerConnections.has(socketId) || !this.localStream) {
      console.log("Skipping peer connection:", {
        userId,
        socketId,
        reason: "Already exists or no local stream",
      });
      return;
    }

    const peer =await this.createPeerConnection(userId, socketId, username);
    this.peerConnections.set(socketId, peer);

    try {
      const offer = await peer.pc.createOffer();
      await peer.pc.setLocalDescription(offer);
      this.socket.emit("offer", {
        roomId: this.roomId,
        offer,
        to: socketId,
        username: this.username,
      });
      console.log("Sent offer to:", socketId, offer);
    } catch (err) {
      console.error("Offer creation error:", err);
    }
  }

  private async createPeerConnection(
    userId: string,
    socketId: string,
    username: string
  ): Promise<PeerConnection> {
    const turnServer = await createTurnConfig();
    console.log("Turn server: ", turnServer)
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },turnServer
        // {
        //   urls: 'turn:vconnect.app.bibin.online:3478?transport=udp',
        //   username: 'bibin',
        //   credential: 'strongpassword123'
        // },
        // {
        //   urls: 'turn:vconnect.app.bibin.online:5349?transport=tcp',
        //   username: 'bibin',
        //   credential: 'strongpassword123'
        // }
      ],
      // iceTransportPolicy: "all",
      // bundlePolicy: "max-bundle",
    });

    this.localStream!.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream!);
      console.log("Added track to peer:", {
        userId,
        socketId,
        track: track.kind,
      });
    });

    pc.ontrack = (event) => {
      const peer = this.peerConnections.get(socketId);
      if (peer) {
        peer.stream = event.streams[0];
        console.log("Remote stream received for:", socketId, peer.stream);
        this.updateStreams();
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", {
          roomId: this.roomId,
          candidate: event.candidate,
          to: socketId,
        });
        console.log("Sent ICE candidate to:", socketId, event.candidate);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(
        "Peer connection state for",
        socketId,
        ":",
        pc.connectionState
      );
      if (pc.connectionState === "connected") {
        this.updateStreams();
      } else if (pc.connectionState === "failed") {
        console.error("Peer connection failed for:", socketId);
        this.removePeerConnection(socketId);
        console.log("Peer connection failed");
        // toast.error('A peer connection failed');
      } else if (pc.connectionState === "disconnected") {
        console.warn("Peer temporarily disconnected for:", socketId);
        // Don’t remove immediately; wait for persistent failure
      }
    };

    return { pc, userId, socketId, username };
  }

  private removePeerConnection(socketId: string) {
    const peer = this.peerConnections.get(socketId);
    if (peer) {
      peer.pc.close();
      this.peerConnections.delete(socketId);
      this.updateStreams();
    }
  }

  private updateStreams() {
    const streams = new Map<
      string,
      { stream: MediaStream; username: string }
    >();
    if (this.localStream)
      streams.set(this.userId, {
        stream: this.localStream,
        username: this.username,
      });
    this.peerConnections.forEach((peer) => {
      if (peer.stream)
        streams.set(peer.userId, {
          stream: peer.stream,
          username: peer.username,
        });
    });
    console.log("Streams updated:", Array.from(streams.entries()));
    this.onStreamUpdate(streams);
  }

  public isAudioEnabled(): boolean {
    return this.localStream
      ? this.localStream.getAudioTracks().some((track) => track.enabled)
      : false;
  }
}
