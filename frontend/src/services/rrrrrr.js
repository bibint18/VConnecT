// // frontend/src/services/CallManager.ts
// import io, {Socket}  from 'socket.io-client'; // Ensure 'io' is imported correctly
// import toast from 'react-hot-toast';
// interface PeerConnection {
//   pc: RTCPeerConnection;
//   userId: string;
//   socketId: string;
//   stream?: MediaStream;
// }
// export class CallManager {
//   private socket: Socket; // Type annotation uses Socket
//   private localStream: MediaStream | null = null;
//   private peerConnections: Map<string, PeerConnection> = new Map(); // Key: socketId
//   private roomId: string;
//   private userId: string;
//   private onStreamUpdate: (streams: Map<string, MediaStream>) => void;
//   constructor(roomId: string, userId: string, onStreamUpdate: (streams: Map<string, MediaStream>) => void) {
//     this.roomId = roomId;
//     this.userId = userId;
//     this.onStreamUpdate = onStreamUpdate;
//     this.socket = io('http://localhost:3000', { withCredentials: true }); // Use io() function
//     this.setupSocketEvents();
//   }
//   async startCall() {
//     try {
//       this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       this.socket.emit('join-call', { roomId: this.roomId, userId: this.userId });
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       toast.error('Failed to access camera/microphone');
//     }
//   }
//   toggleVideo(enabled: boolean) {
//     if (this.localStream) {
//       this.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
//     }
//   }
//   async leaveCall() {
//     this.socket.emit('leave-call', { roomId: this.roomId, userId: this.userId });
//     this.localStream?.getTracks().forEach((track) => track.stop());
//     this.peerConnections.forEach((peer) => peer.pc.close());
//     this.peerConnections.clear();
//     this.socket.disconnect();
//   }
//   private setupSocketEvents() {
//     this.socket.on('connect', () => {
//       console.log('Connected to signaling server');
//     });
//     this.socket.on('user-joined', (data: { userId: string; socketId: string }) => {
//       this.addPeerConnection(data.userId, data.socketId);
//     });
//     this.socket.on('user-left', (data: { userId: string; socketId: string }) => {
//       this.removePeerConnection(data.socketId);
//     });
//     this.socket.on('offer', async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
//       const { offer, from } = data;
//       const peer = this.peerConnections.get(from);
//       if (peer) {
//         await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await peer.pc.createAnswer();
//         await peer.pc.setLocalDescription(answer);
//         this.socket.emit('answer', { roomId: this.roomId, answer, from: this.socket.id });
//       }
//     });
//     this.socket.on('answer', async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
//       const { answer, from } = data;
//       const peer = this.peerConnections.get(from);
//       if (peer) {
//         await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     });
//     this.socket.on('ice-candidate', (data: { candidate: RTCIceCandidateInit; from: string }) => {
//       const { candidate, from } = data;
//       const peer = this.peerConnections.get(from);
//       if (peer) {
//         peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) => console.error('ICE error:', err));
//       }
//     });
//     this.socket.on('error', (data: { message: string }) => {
//       console.log(data.message)
//       toast.error(data.message);
//     });
//   }
//   private async addPeerConnection(userId: string, socketId: string) {
//     if (this.peerConnections.has(socketId) || !this.localStream) return;
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//     });
//     this.localStream.getTracks().forEach((track) => pc.addTrack(track, this.localStream!));
//     pc.ontrack = (event) => {
//       const peer = this.peerConnections.get(socketId);
//       if (peer) {
//         peer.stream = event.streams[0];
//         this.updateStreams();
//       }
//     };
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.socket.emit('ice-candidate', { roomId: this.roomId, candidate: event.candidate, from: this.socket.id });
//       }
//     };
//     this.peerConnections.set(socketId, { pc, userId, socketId });
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     this.socket.emit('offer', { roomId: this.roomId, offer, from: this.socket.id });
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
//     this.peerConnections.forEach((peer) => {
//       if (peer.stream) streams.set(peer.userId, peer.stream);
//     });
//     if (this.localStream) streams.set(this.userId, this.localStream);
//     this.onStreamUpdate(streams);
//   }
// }
// frontend/src/services/CallManager.ts
import io from 'socket.io-client';
import toast from 'react-hot-toast';
export class CallManager {
    constructor(roomId, userId, onStreamUpdate) {
        Object.defineProperty(this, "socket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "localStream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "peerConnections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "roomId", {
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
        Object.defineProperty(this, "onStreamUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.roomId = roomId;
        this.userId = userId;
        this.onStreamUpdate = onStreamUpdate;
        this.socket = io('http://localhost:3000', { withCredentials: true });
        this.setupSocketEvents();
    }
    async startCall() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log('Local stream acquired:', this.localStream);
            this.socket.emit('join-call', { roomId: this.roomId, userId: this.userId });
            this.updateStreams(); // Ensure local stream is added immediately
        }
        catch (error) {
            console.error('Error accessing media devices:', error);
            toast.error('Failed to access camera/microphone');
        }
    }
    toggleVideo(enabled) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
            console.log('Video toggled:', enabled);
        }
    }
    async leaveCall() {
        this.socket.emit('leave-call', { roomId: this.roomId, userId: this.userId });
        this.localStream?.getTracks().forEach((track) => track.stop());
        this.peerConnections.forEach((peer) => peer.pc.close());
        this.peerConnections.clear();
        this.socket.disconnect();
        console.log('Call left');
    }
    setupSocketEvents() {
        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
        });
        this.socket.on('user-joined', (data) => {
            console.log('User joined:', data);
            this.addPeerConnection(data.userId, data.socketId);
        });
        this.socket.on('user-left', (data) => {
            console.log('User left:', data);
            this.removePeerConnection(data.socketId);
        });
        this.socket.on('offer', async (data) => {
            console.log('Received offer from:', data.from, data.offer);
            const { offer, from } = data;
            let peer = this.peerConnections.get(from);
            if (!peer) {
                peer = await this.createPeerConnection(from, from); // Use socketId as key
                this.peerConnections.set(from, peer);
            }
            await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.pc.createAnswer();
            await peer.pc.setLocalDescription(answer);
            this.socket.emit('answer', { roomId: this.roomId, answer, from: this.socket.id });
            console.log('Sent answer to:', from, answer);
        });
        this.socket.on('answer', async (data) => {
            console.log('Received answer from:', data.from, data.answer);
            const { answer, from } = data;
            const peer = this.peerConnections.get(from);
            if (peer) {
                await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });
        this.socket.on('ice-candidate', (data) => {
            console.log('Received ICE candidate from:', data.from, data.candidate);
            const { candidate, from } = data;
            const peer = this.peerConnections.get(from);
            if (peer) {
                peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) => console.error('ICE error:', err));
            }
        });
        this.socket.on('error', (data) => {
            toast.error(data.message);
        });
    }
    async addPeerConnection(userId, socketId) {
        if (this.peerConnections.has(socketId) || !this.localStream || socketId === this.socket.id) {
            console.log('Skipping peer connection:', { userId, socketId, reason: 'Already exists or self' });
            return;
        }
        // const pc = new RTCPeerConnection({
        //   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        // });
        // this.localStream.getTracks().forEach((track) => pc.addTrack(track, this.localStream!));
        // pc.ontrack = (event) => {
        //   const peer = this.peerConnections.get(socketId);
        //   if (peer) {
        //     peer.stream = event.streams[0];
        //     console.log('Remote stream received for:', socketId, peer.stream);
        //     this.updateStreams();
        //   }
        // };
        // pc.onicecandidate = (event) => {
        //   if (event.candidate) {
        //     this.socket.emit('ice-candidate', { roomId: this.roomId, candidate: event.candidate, from: this.socket.id });
        //     console.log('Sent ICE candidate:', event.candidate);
        //   }
        // };
        // this.peerConnections.set(socketId, { pc, userId, socketId });
        // const offer = await pc.createOffer();
        // await pc.setLocalDescription(offer);
        // this.socket.emit('offer', { roomId: this.roomId, offer, from: this.socket.id });
        // console.log('Sent offer to:', socketId, offer);
        const peer = await this.createPeerConnection(userId, socketId);
        this.peerConnections.set(socketId, peer);
        const offer = await peer.pc.createOffer();
        await peer.pc.setLocalDescription(offer);
        this.socket.emit('offer', { roomId: this.roomId, offer, from: this.socket.id });
        console.log('Sent offer to:', socketId, offer);
    }
    async createPeerConnection(userId, socketId) {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        this.localStream.getTracks().forEach((track) => {
            pc.addTrack(track, this.localStream);
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
            }
        };
        return { pc, userId, socketId };
    }
    removePeerConnection(socketId) {
        const peer = this.peerConnections.get(socketId);
        if (peer) {
            peer.pc.close();
            this.peerConnections.delete(socketId);
            this.updateStreams();
            console.log('Peer removed:', socketId);
        }
    }
    updateStreams() {
        const streams = new Map();
        if (this.localStream)
            streams.set(this.userId, this.localStream);
        this.peerConnections.forEach((peer) => {
            if (peer.stream)
                streams.set(peer.userId, peer.stream);
        });
        console.log('Streams updated:', Array.from(streams.entries()));
        this.onStreamUpdate(streams);
    }
}
