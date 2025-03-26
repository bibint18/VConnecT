
// backend/src/services/CallService.ts
import { Server, Socket } from 'socket.io';
import { ICallRepository } from '../interfaces/ICallRepository';
import { AppError } from '../utils/AppError';

export class CallService {
  private io: Server;
  private callRepository: ICallRepository;
  private socketMap: Map<string ,string> = new Map()
  constructor(callRepository: ICallRepository, io: Server) {
    this.callRepository = callRepository;
    this.io = io;
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected to call:', socket.id);

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

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
        rooms.forEach(roomId => {
          socket.to(roomId).emit('user-left', { userId: 'unknown', socketId: socket.id });
        });
      });
    });
  }
}