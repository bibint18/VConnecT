
// backend/src/services/CallService.ts
import { Server, Socket } from 'socket.io';
import { ICallRepository } from '../interfaces/ICallRepository';
import { AppError } from '../utils/AppError';
import { IDirectCallRepository } from '../interfaces/user/Call/IDirectCallRepository';
import { Call } from '../models/CallModel';

export class CallService {
  private io: Server;
  private callRepository: ICallRepository;
  private directCallRepository:IDirectCallRepository
  private socketMap: Map<string ,string> = new Map()
  constructor(callRepository: ICallRepository,directCallRepository: IDirectCallRepository, io: Server) {
    this.callRepository = callRepository;
    this.directCallRepository=directCallRepository
    this.io = io;
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected to call:', socket.id);

      socket.on("join-user", ({ userId }: { userId: string }) => {
        socket.join(userId);
        this.socketMap.set(userId, socket.id);
        console.log(`User ${userId} joined room ${userId}, socket: ${socket.id}`);
      });

      socket.on('join-call', async (data: { roomId: string; userId: string;username:string }) => {
        const { roomId, userId,username } = data;
        console.log('Received join-call:', { roomId, userId,username, socketId: socket.id });

        try {
          await this.callRepository.joinCall(roomId, userId);
          socket.join(roomId);
          (socket as any).userId = userId; // Attach userId to socket
          this.socketMap.set(userId, socket.id);
          socket.to(roomId).emit('user-joined', { userId, socketId: socket.id ,username});
          console.log(`User ${userId} joined call in room ${roomId}, notified others`);
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError('Failed to join call', 500);
          console.error('Join call error:', err);
          socket.emit('error', { message: err.message, status: err.statusCode });
        }
      });

      socket.on('leave-call', async (data: { roomId: string; userId: string }) => {
        const { roomId, userId } = data;
        console.log('Received leave-call:', { roomId, userId, socketId: socket.id });
        try {
          await this.callRepository.leaveCall(roomId, userId);
          socket.leave(roomId);
          socket.to(roomId).emit('user-left', { userId, socketId: socket.id });
          console.log(`User ${userId} left call in room ${roomId}`);
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError('Failed to leave call', 500);
          console.error('Leave call error:', err);
          socket.emit('error', { message: err.message, status: err.statusCode });
        }
      });

      socket.on('offer', (data: { roomId: string; offer: RTCSessionDescriptionInit; to: string ;username:string}) => {
        console.log('Received offer:', { roomId: data.roomId, from: socket.id, to: data.to,username:data.username });
        this.io.to(data.to).emit('offer', { offer: data.offer, from: socket.id,username:data.username });
      });

      socket.on('answer', (data: { roomId: string; answer: RTCSessionDescriptionInit; to: string ;username:string}) => {
        console.log('Received answer:', { roomId: data.roomId, from: socket.id, to: data.to,username:data.username });
        this.io.to(data.to).emit('answer', { answer: data.answer, from: socket.id,username:data.username });
      });

      socket.on('ice-candidate', (data: { roomId: string; candidate: RTCIceCandidateInit; to: string }) => {
        console.log('Received ICE candidate:', { roomId: data.roomId, from: socket.id, to: data.to });
        this.io.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
      });

      //on to one

      socket.on("directCall:initiate", async ({ callId, callerId, receiverId }) => {
        console.log("Received direct:initiate:", { callId, callerId, receiverId });
        try {
          const call = new Call({
            callId,
            callerId,
            receiverId,
            status: "INITIATED",
            startTime: new Date(),
          });
          await call.save();

          // Emit direct:incoming to receiver regardless of online status
          this.io.to(receiverId).emit("directCall:incoming", { callId, callerId });
          console.log(`Emitted direct:incoming to ${receiverId}`);

          // Check receiver's socket status with a timeout
          setTimeout(async () => {
            const updatedCall = await Call.findOne({ callId });
            if (updatedCall && updatedCall.status === "INITIATED") {
              const receiverSockets = this.io.sockets.adapter.rooms.get(receiverId);
              if (!receiverSockets || receiverSockets.size === 0) {
                console.log(`Receiver ${receiverId} still offline, marking call ${callId} as MISSED`);
                updatedCall.status = "MISSED";
                await updatedCall.save();
                this.io.to(callerId).emit("direct:missed", { callId });
              }
            }
          }, 30000); // 30 seconds timeout
        } catch (error) {
          console.error("Error initiating call:", error);
          this.io.to(callerId).emit("direct:error", { callId, error: "Failed to initiate call" });
        }
      });

      socket.on("directCall:join", async (data: { callId: string; userId: string }) => {
        const { callId, userId } = data;
        console.log("Received directCall:join:", { callId, userId, socketId: socket.id });
        try {
          const call = await this.directCallRepository.getCallById(callId);
          if (!call) {
            throw new AppError("Call not found", 404);
          }
          socket.join(callId);
          // CHANGE: Use socketMap to notify the other user
          const otherUserId = call.callerId.toString() === userId ? call.receiverId.toString() : call.callerId.toString();
          const otherSocketId = this.socketMap.get(otherUserId);
          if (otherSocketId) {
            this.io.to(otherSocketId).emit("directCall:peer-joined", { peerId: userId });
          }
          console.log(`User ${userId} joined call ${callId}`);
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError("Failed to join call", 500);
          console.error("Join call error:", err);
          socket.emit("directCall:error", { message: err.message });
        }
      });

      socket.on("directCall:accept", async (data: { callId: string }) => {
        const { callId } = data;
        console.log("Received directCall:accept::::::::", { callId, socketId: socket.id });
        try {
          const call = await this.directCallRepository.getCallById(callId);
          if (!call) {
            throw new AppError("Call not found", 404);
          }
          await this.directCallRepository.updateCallStatus(callId, "ACCEPTED");
          const callerSocketId = this.socketMap.get(call.callerId.toString());
          console.log("Caller socket id in the accept callll",callerSocketId)
          if (callerSocketId) {
            this.io.to(callerSocketId).emit("directCall:accepted", { callId });
          }
          // socket.to(callId).emit("directCall:accepted", { callId });
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError("Failed to accept call", 500);
          console.error("Accept call error:", err);
          socket.emit("directCall:error", { message: err.message });
        }
      });

      socket.on("directCall:reject", async (data: { callId: string }) => {
        const { callId } = data;
        console.log("Received directCall:reject:", { callId, socketId: socket.id });
        try {
          await this.directCallRepository.updateCallStatus(callId, "REJECTED");
          const call = await this.directCallRepository.getCallById(callId);
          if (call) {
            const callerSocketId = this.socketMap.get(call.callerId.toString());
            if (callerSocketId) {
              this.io.to(callerSocketId).emit("directCall:rejected", { callId });
            }
          }
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError("Failed to reject call", 500);
          console.error("Reject call error:", err);
          socket.emit("directCall:error", { message: err.message });
        }
      });

      socket.on("directCall:offer", (data: { callId: string; offer: RTCSessionDescriptionInit; to: string }) => {
        console.log("Received directCall:offer::::", { callId: data.callId, from: socket.id, to: data.to });
        this.io.to(data.to).emit("directCall:offer", { offer: data.offer, from: socket.id });
      });
 
socket.on("directCall:answer", (data: { callId: string; answer: RTCSessionDescriptionInit; to: string }) => {
        console.log("Received directCall:answer:", { callId: data.callId, from: socket.id, to: data.to });
        this.io.to(data.to).emit("directCall:answer", { answer: data.answer, from: socket.id });
      });

      socket.on("directCall:ice-candidate", (data: { callId: string; candidate: RTCIceCandidateInit; to: string }) => {
        console.log("Received directCall:ice-candidateeeeeeeeeeeee:", { callId: data.callId, from: socket.id, to: data.to });
        this.io.to(data.to).emit("directCall:ice-candidate", { candidate: data.candidate, from: socket.id });
      });

      socket.on("directCall:end", async (data: { callId: string; userId: string }) => {
        console.log("Direct call end triggered:", data, "Socket:", socket.id);
        const { callId, userId } = data;
        console.log("Received directCall:end:", { callId, userId, socketId: socket.id });
        try {
          await this.directCallRepository.endCall(callId, userId);
          socket.to(callId).emit("directCall:ended", { callId });
          socket.leave(callId);
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError("Failed to end call", 500);
          console.error("End call error:", err);
          socket.emit("directCall:error", { message: err.message });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
        rooms.forEach((roomId) => {
          socket.to(roomId).emit("user-left", { userId: "unknown", socketId: socket.id });
        });
        // CHANGE: Remove socket from socketMap
        for (const [userId, socketId] of this.socketMap) {
          if (socketId === socket.id) {
            this.socketMap.delete(userId);
            console.log(`Removed user ${userId} from socketMap`);
          }
        }
      });
    });
  }
}