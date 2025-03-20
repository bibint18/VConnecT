// // frontend/src/services/CallManager.ts
// import { io, Socket } from 'socket.io-client';
// import { toast } from 'react-toastify';

// interface PeerConnection {
//   pc: RTCPeerConnection;
//   userId: string;
//   socketId: string;
//   stream?: MediaStream;
// }

// export class CallManager {
//   private socket: Socket;
//   private localStream: MediaStream | null = null;
//   private peerConnections: Map<string, PeerConnection> = new Map();
//   private roomId: string;
//   private userId: string;
//   private onStreamUpdate: (streams: Map<string, MediaStream>) => void;

//   constructor(roomId: string, userId: string, onStreamUpdate: (streams: Map<string, MediaStream>) => void) {
//     this.roomId = roomId;
//     this.userId = userId;
//     this.onStreamUpdate = onStreamUpdate;
//     this.socket = io('http://localhost:3000', { withCredentials: true }); // Adjust URL as needed
//     this.setupSocketEvents();
//   }

//   public async startCall() {
//     try {
//       this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       console.log('Local stream acquired:', this.localStream);
//       this.updateStreams();
//       this.socket.emit('join-call', { roomId: this.roomId, userId: this.userId });
//     } catch (error) {
//       console.error('Error starting call:', error);
//       toast.error('Failed to access media devices');
//     }
//   }

//   public leaveCall() {
//     this.socket.emit('leave-call', { roomId: this.roomId, userId: this.userId });
//     this.peerConnections.forEach((peer) => peer.pc.close());
//     this.peerConnections.clear();
//     if (this.localStream) {
//       this.localStream.getTracks().forEach((track) => track.stop());
//       this.localStream = null;
//     }
//     this.socket.disconnect();
//     this.updateStreams();
//     console.log('Call left');
//   }

//   private setupSocketEvents() {
//     this.socket.on('connect', () => {
//       console.log('Connected to signaling server');
//     });

//     this.socket.on('user-joined', (data: { userId: string; socketId: string }) => {
//       console.log('User joined:', data);
//       this.addPeerConnection(data.userId, data.socketId);
//     });

//     this.socket.on('user-left', (data: { userId: string; socketId: string }) => {
//       console.log('User left:', data);
//       this.removePeerConnection(data.socketId);
//     });

//     this.socket.on('offer', async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
//       console.log('Received offer from:', data.from, data.offer);
//       const { offer, from } = data;
//       let peer = this.peerConnections.get(from);
//       if (!peer) {
//         peer = await this.createPeerConnection(from, from);
//         this.peerConnections.set(from, peer);
//       }
//       if (peer.pc.signalingState === 'stable') {
//         await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await peer.pc.createAnswer();
//         await peer.pc.setLocalDescription(answer);
//         this.socket.emit('answer', { roomId: this.roomId, answer, from: this.socket.id });
//         console.log('Sent answer to:', from, answer);
//       } else {
//         console.log('Ignoring offer due to signaling state:', peer.pc.signalingState);
//       }
//     });

//     this.socket.on('answer', async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
//       console.log('Received answer from:', data.from, data.answer);
//       const { answer, from } = data;
//       const peer = this.peerConnections.get(from);
//       if (peer && peer.pc.signalingState === 'have-local-offer') {
//         await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
//       } else {
//         console.log('Ignoring answer due to signaling state:', peer?.pc.signalingState);
//       }
//     });

//     this.socket.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit; from: string }) => {
//       console.log('Received ICE candidate from:', data.from, data.candidate);
//       const { candidate, from } = data;
//       const peer = this.peerConnections.get(from);
//       if (peer) {
//         await peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
//           console.error('ICE error:', err)
//         );
//       }
//     });

//     this.socket.on('error', (data: { message: string }) => {
//       console.log('Received error from server:', data.message);
//       toast.error(data.message);
//     });
//   }

//   private async addPeerConnection(userId: string, socketId: string) {
//     if (this.peerConnections.has(socketId) || !this.localStream || socketId === this.socket.id) {
//       console.log('Skipping peer connection:', { userId, socketId, reason: 'Already exists or self' });
//       return;
//     }

//     const peer = await this.createPeerConnection(userId, socketId);
//     this.peerConnections.set(socketId, peer);

//     if (peer.pc.signalingState === 'stable') {
//       const offer = await peer.pc.createOffer();
//       await peer.pc.setLocalDescription(offer);
//       this.socket.emit('offer', { roomId: this.roomId, offer, from: this.socket.id });
//       console.log('Sent offer to:', socketId, offer);
//     }
//   }

//   private async createPeerConnection(userId: string, socketId: string): Promise<PeerConnection> {
//     const pc = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:stun1.l.google.com:19302' },
//       ],
//     });

//     this.localStream!.getTracks().forEach((track) => {
//       pc.addTrack(track, this.localStream!);
//       console.log('Added track to peer:', { userId, socketId, track: track.kind });
//     });

//     pc.ontrack = (event) => {
//       const peer = this.peerConnections.get(socketId);
//       if (peer) {
//         peer.stream = event.streams[0];
//         console.log('Remote stream received for:', socketId, peer.stream);
//         this.updateStreams();
//       }
//     };

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.socket.emit('ice-candidate', { roomId: this.roomId, candidate: event.candidate, from: this.socket.id });
//         console.log('Sent ICE candidate:', event.candidate);
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       console.log('Peer connection state for', socketId, ':', pc.connectionState);
//       if (pc.connectionState === 'connected') {
//         this.updateStreams();
//       } else if (pc.connectionState === 'failed') {
//         console.log('Peer connection failed for:', socketId);
//         this.removePeerConnection(socketId);
//       }
//     };

//     return { pc, userId, socketId };
//   }

//   private removePeerConnection(socketId: string) {
//     const peer = this.peerConnections.get(socketId);
//     if (peer) {
//       peer.pc.close();
//       this.peerConnections.delete(socketId);
//       this.updateStreams();
//     }
//   }

//   private updateStreams() {
//     const streams = new Map<string, MediaStream>();
//     if (this.localStream) streams.set(this.userId, this.localStream);
//     this.peerConnections.forEach((peer) => {
//       if (peer.stream) streams.set(peer.userId, peer.stream);
//     });
//     console.log('Streams updated:', Array.from(streams.entries()));
//     this.onStreamUpdate(streams);
//   }

//   public toggleVideo(enabled: boolean) {
//     if (this.localStream) {
//       this.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
//     }
//   }
// }





// frontend/src/services/CallManager.ts
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface PeerConnection {
  pc: RTCPeerConnection;
  userId: string;
  socketId: string;
  stream?: MediaStream;
}

export class CallManager {
  private socket: Socket;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private roomId: string;
  private userId: string;
  private onStreamUpdate: (streams: Map<string, MediaStream>) => void;

  constructor(roomId: string, userId: string, onStreamUpdate: (streams: Map<string, MediaStream>) => void) {
    this.roomId = roomId;
    this.userId = userId;
    this.onStreamUpdate = onStreamUpdate;
    this.socket = io('http://localhost:3000', { withCredentials: true }); // Adjust URL
    this.setupSocketEvents();
  }

  public async startCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Local stream acquired:', this.localStream);
      this.updateStreams();
      this.socket.emit('join-call', { roomId: this.roomId, userId: this.userId });
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to access media devices');
    }
  }

  public leaveCall() {
    this.socket.emit('leave-call', { roomId: this.roomId, userId: this.userId });
    this.peerConnections.forEach((peer) => peer.pc.close());
    this.peerConnections.clear();
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.socket.disconnect();
    this.updateStreams();
    console.log('Call left');
  }

  public toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
    }
  }

  private setupSocketEvents() {
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('user-joined', (data: { userId: string; socketId: string }) => {
      console.log('User joined:', data);
      this.addPeerConnection(data.userId, data.socketId);
    });

    this.socket.on('user-left', (data: { userId: string; socketId: string }) => {
      console.log('User left:', data);
      this.removePeerConnection(data.socketId);
    });

    this.socket.on('offer', async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received offer from:', data.from, data.offer);
      const { offer, from } = data;
      let peer = this.peerConnections.get(from);
      if (!peer) {
        peer = this.createPeerConnection(from, from);
        this.peerConnections.set(from, peer);
      }
      await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      this.socket.emit('answer', { roomId: this.roomId, answer, from: this.socket.id });
      console.log('Sent answer to:', from, answer);
    });

    this.socket.on('answer', async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received answer from:', data.from, data.answer);
      const { answer, from } = data;
      const peer = this.peerConnections.get(from);
      if (peer) {
        await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    this.socket.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit; from: string }) => {
      console.log('Received ICE candidate from:', data.from, data.candidate);
      const { candidate, from } = data;
      const peer = this.peerConnections.get(from);
      if (peer && peer.pc.remoteDescription) {
        await peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
          console.error('ICE error:', err)
        );
      } else {
        console.log('Skipping ICE candidate - no remote description yet for:', from);
      }
    });

    this.socket.on('error', (data: { message: string }) => {
      console.log('Received error from server:', data.message);
      toast.error(data.message);
    });
  }

  private addPeerConnection(userId: string, socketId: string) {
    if (this.peerConnections.has(socketId) || !this.localStream || socketId === this.socket.id) {
      console.log('Skipping peer connection:', { userId, socketId, reason: 'Already exists or self' });
      return;
    }

    const peer = this.createPeerConnection(userId, socketId);
    this.peerConnections.set(socketId, peer);

    peer.pc.createOffer()
      .then((offer) => peer.pc.setLocalDescription(offer))
      .then(() => {
        this.socket.emit('offer', { roomId: this.roomId, offer: peer.pc.localDescription, from: this.socket.id });
        console.log('Sent offer to:', socketId, peer.pc.localDescription);
      })
      .catch((err) => console.error('Offer creation error:', err));
  }

  private createPeerConnection(userId: string, socketId: string): PeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    this.localStream!.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream!);
      console.log('Added track to peer:', { userId, socketId, track: track.kind });
    });

    pc.ontrack = (event) => {
      const peer = this.peerConnections.get(socketId);
      if (peer) {
        peer.stream = event.streams[0];
        console.log('Remote stream received for:', socketId, peer.stream);
        this.updateStreams();
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', { roomId: this.roomId, candidate: event.candidate, from: this.socket.id });
        console.log('Sent ICE candidate:', event.candidate);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Peer connection state for', socketId, ':', pc.connectionState);
      if (pc.connectionState === 'connected') {
        this.updateStreams();
      } else if (pc.connectionState === 'failed') {
        console.log('Peer connection failed for:', socketId);
        this.removePeerConnection(socketId);
      }
    };

    return { pc, userId, socketId };
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
    const streams = new Map<string, MediaStream>();
    if (this.localStream) streams.set(this.userId, this.localStream);
    this.peerConnections.forEach((peer) => {
      if (peer.stream) streams.set(peer.userId, peer.stream);
    });
    console.log('Streams updated:', Array.from(streams.entries()));
    this.onStreamUpdate(streams);
  }
}