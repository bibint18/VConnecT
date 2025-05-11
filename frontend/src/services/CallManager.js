// frontend/src/services/CallManager.ts
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
export class CallManager {
    constructor(roomId, userId, username, onStreamUpdate) {
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
        Object.defineProperty(this, "username", {
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
        this.username = username;
        this.onStreamUpdate = onStreamUpdate;
        const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
        this.socket = io(socketUrl, { withCredentials: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        this.setupSocketEvents();
        this.socket.emit("register-user", { userId: this.userId });
    }
    sendFriendRequest(toUserId) {
        this.socket.emit("send-friend-request", { to: toUserId }, (response) => {
            if (response.success) {
                toast.success("Friend request sent!");
            }
            else {
                toast.error(response.error || "Failed to send friend request");
            }
        });
    }
    async startCall(audioDeviceId) {
        try {
            if (!this.localStream) {
                const constarints = {
                    video: true,
                    audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true
                };
                this.localStream = await navigator.mediaDevices.getUserMedia(constarints);
                console.log('local streams acquired with constraints', constarints, this.localStream);
            }
            this.updateStreams();
            this.socket.emit('join-call', { roomId: this.roomId, userId: this.userId, username: this.username });
        }
        catch (error) {
            console.log('Error starting call', error);
            toast.error("Failed to access Media devices");
        }
    }
    async getAudioDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log("devices ", devices);
            return devices.filter((device) => device.kind === 'audioinput');
        }
        catch (error) {
            console.log('error enumurating devices', error);
            toast.error("Failed to list audio devices");
            return [];
        }
    }
    async switchAudioDevice(deviceId) {
        if (!this.localStream)
            return;
        this.localStream.getTracks().forEach((track) => track.stop());
        await this.startCall(deviceId);
        this.peerConnections.forEach((peer) => {
            peer.pc.getSenders().forEach((sender) => peer.pc.removeTrack(sender));
            this.localStream.getTracks().forEach((track) => peer.pc.addTrack(track, this.localStream));
            console.log("switched audio device to ", deviceId);
        });
    }
    leaveCall() {
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
    toggleAudio(enabled) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((track) => {
                track.enabled = enabled;
                console.log(`Audio track ${enabled ? 'enabled' : 'disabled'} for user ${this.userId}`);
            });
        }
    }
    toggleVideo(enabled) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
        }
    }
    setupSocketEvents() {
        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
        });
        this.socket.on("friend-request-received", (data) => {
            toast.info(`Friend request received from user ${data.from}`);
        });
        this.socket.on("friend-request-sent", (data) => {
            console.log(`Friend request sent to ${data.to}`);
        });
        this.socket.on("friend-request-accepted", (data) => {
            toast.success(`Friend request accepted by user ${data.by}`);
        });
        this.socket.on("friend-request-rejected", (data) => {
            toast.info(`Friend request rejected by user ${data.by}`);
        });
        this.socket.on('reconnect', () => {
            console.log('Reconnected to signaling server');
            if (this.localStream) {
                this.socket.emit('join-call', { roomId: this.roomId, userId: this.userId, username: this.username });
            }
        });
        this.socket.on('user-joined', (data) => {
            console.log('User joined:', data);
            if (data.socketId !== this.socket.id) {
                this.addPeerConnection(data.userId, data.socketId, data.username);
            }
        });
        this.socket.on('user-left', (data) => {
            console.log('User left:', data);
            this.removePeerConnection(data.socketId);
        });
        this.socket.on('offer', async (data) => {
            console.log('Received offer from:', data.from, data.offer);
            const { offer, from, username } = data;
            let peer = this.peerConnections.get(from);
            if (!peer) {
                peer = this.createPeerConnection(from, from, username); // Use socketId as userId for uniqueness
                this.peerConnections.set(from, peer);
            }
            else if (peer.username !== username) {
                peer.username = username;
                this.updateStreams();
            }
            try {
                await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peer.pc.createAnswer();
                await peer.pc.setLocalDescription(answer);
                this.socket.emit('answer', { roomId: this.roomId, answer, to: from, username: this.username });
                console.log('Sent answer to:', from, answer);
            }
            catch (err) {
                console.error('Error handling offer:', err);
            }
        });
        this.socket.on('answer', async (data) => {
            console.log('Received answer from:', data.from, data.answer);
            const { answer, from, username } = data;
            const peer = this.peerConnections.get(from);
            if (peer) {
                if (peer.username !== username) {
                    peer.username = username;
                    this.updateStreams();
                }
                if (peer.pc.signalingState === 'have-local-offer') {
                    try {
                        await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                    catch (err) {
                        console.error('Error setting remote answer:', err);
                    }
                }
            }
        });
        this.socket.on('ice-candidate', async (data) => {
            console.log('Received ICE candidate from:', data.from, data.candidate);
            const { candidate, from } = data;
            const peer = this.peerConnections.get(from);
            if (peer && peer.pc.remoteDescription) {
                try {
                    await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
                catch (err) {
                    console.error('ICE error:', err);
                }
            }
            else {
                console.log('Skipping ICE candidate - no remote description yet for:', from);
            }
        });
        this.socket.on('error', (data) => {
            console.error('Server error:', data.message);
            toast.error(data.message);
        });
        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            // toast.warn('Disconnected from server, attempting to reconnect...');
        });
    }
    async addPeerConnection(userId, socketId, username) {
        if (this.peerConnections.has(socketId) || !this.localStream) {
            console.log('Skipping peer connection:', { userId, socketId, reason: 'Already exists or no local stream' });
            return;
        }
        const peer = this.createPeerConnection(userId, socketId, username);
        this.peerConnections.set(socketId, peer);
        try {
            const offer = await peer.pc.createOffer();
            await peer.pc.setLocalDescription(offer);
            this.socket.emit('offer', { roomId: this.roomId, offer, to: socketId, username: this.username });
            console.log('Sent offer to:', socketId, offer);
        }
        catch (err) {
            console.error('Offer creation error:', err);
        }
    }
    createPeerConnection(userId, socketId, username) {
        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"]
                },
                {
                    urls: ["turn:vconnect.app.bibin.online:3478"],
                    username: 'bibin',
                    credential: 'strongpassword123'
                }
            ],
            iceTransportPolicy: 'all',
            bundlePolicy: 'max-bundle',
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
                this.socket.emit('ice-candidate', { roomId: this.roomId, candidate: event.candidate, to: socketId });
                console.log('Sent ICE candidate to:', socketId, event.candidate);
            }
        };
        pc.onconnectionstatechange = () => {
            console.log('Peer connection state for', socketId, ':', pc.connectionState);
            if (pc.connectionState === 'connected') {
                this.updateStreams();
            }
            else if (pc.connectionState === 'failed') {
                console.error('Peer connection failed for:', socketId);
                this.removePeerConnection(socketId);
                console.log("Peer connection failed");
                // toast.error('A peer connection failed');
            }
            else if (pc.connectionState === 'disconnected') {
                console.warn('Peer temporarily disconnected for:', socketId);
                // Don’t remove immediately; wait for persistent failure
            }
        };
        return { pc, userId, socketId, username };
    }
    removePeerConnection(socketId) {
        const peer = this.peerConnections.get(socketId);
        if (peer) {
            peer.pc.close();
            this.peerConnections.delete(socketId);
            this.updateStreams();
        }
    }
    updateStreams() {
        const streams = new Map();
        if (this.localStream)
            streams.set(this.userId, { stream: this.localStream, username: this.username });
        this.peerConnections.forEach((peer) => {
            if (peer.stream)
                streams.set(peer.userId, { stream: peer.stream, username: peer.username });
        });
        console.log('Streams updated:', Array.from(streams.entries()));
        this.onStreamUpdate(streams);
    }
    isAudioEnabled() {
        return this.localStream ? this.localStream.getAudioTracks().some((track) => track.enabled) : false;
    }
}
