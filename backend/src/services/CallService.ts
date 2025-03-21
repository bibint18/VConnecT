
// import { ICallRepository } from "../interfaces/ICallRepository";
// import { Server,Socket } from "socket.io";
// import mongoose from "mongoose";
// export class CallService{
//   private callRepository:ICallRepository
//   private io:Server
//   constructor(CallRepo:ICallRepository,io:Server){
//     this.callRepository=CallRepo;
//     this.io=io
//     this.setupSocketEvents()
//   }



//   private setupSocketEvents() {
//     this.io.on('connection', (socket: Socket) => {
//       console.log(`User connected to call: ${socket.id}`);

//       socket.on('join-call', async ({ roomId, userId }) => {
//         console.log('Received join-call:', { roomId, userId, socketId: socket.id });
//         try {
//           await this.callRepository.joinCall(roomId, userId);
//           socket.join(roomId);

//           // Notify all existing users about the new user
//           socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
//           console.log(`User ${userId} joined call in room ${roomId}, notified others`);

//           // Notify new user about existing participants
//           const room = await this.callRepository.getRoomParticipants(roomId);
//           const participants = room?.participants.filter((id) => id.toString() !== userId) || [];
//           participants.forEach((existingUserId) => {
//             const socketsInRoom = this.io.sockets.adapter.rooms.get(roomId);
//             const socketIds = Array.from(socketsInRoom || []).filter((id) => id !== socket.id);
//             socketIds.forEach((existingSocketId) => {
//               socket.emit('user-joined', { userId: existingUserId.toString(), socketId: existingSocketId });
//             });
//           });
//         } catch (error) {
//           const errorMessage = error instanceof Error ? error.message : 'Failed to join call';
//           console.error('Join-call error:', errorMessage, error);
//           socket.emit('error', { message: errorMessage });
//         }
//       });

//       socket.on('offer', ({ roomId, offer, from }) => {
//         console.log('Received offer:', { roomId, from });
//         socket.to(roomId).emit('offer', { offer, from });
//       });

//       socket.on('answer', ({ roomId, answer, from }) => {
//         console.log('Received answer:', { roomId, from });
//         socket.to(roomId).emit('answer', { answer, from });
//       });

//       socket.on('ice-candidate', ({ roomId, candidate, from }) => {
//         console.log('Received ICE candidate:', { roomId, from });
//         socket.to(roomId).emit('ice-candidate', { candidate, from });
//       });

//       socket.on('leave-call', async ({ roomId, userId }) => {
//         console.log('Received leave-call:', { roomId, userId, socketId: socket.id });
//         try {
//           await this.callRepository.leaveCall(roomId, userId);
//           socket.to(roomId).emit('user-left', { userId, socketId: socket.id });
//           socket.leave(roomId);
//           console.log(`User ${userId} left call in room ${roomId}`);
//         } catch (error) {
//           const errorMessage = error instanceof Error ? error.message : 'Failed to leave call';
//           console.error('Leave-call error:', errorMessage, error);
//           socket.emit('error', { message: errorMessage });
//         }
//       });

//       socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//       });
//     });
//   }





  // private setupSocketEvents(){
  //   this.io.on('connection',(socket:Socket) => {
  //     console.log(`user connected to call ${socket.id}`);
      
      // socket.on('join-call',async ({roomId,userId}) => {
      //   try {
      //     await this.callRepository.joinCall(roomId,userId)
      //     socket.join(roomId)
      //     socket.to(roomId).emit('user-joined',{userId,socketId:socket.id})
      //     console.log(`User ${userId} joined call in room ${roomId}`)
      //   } catch (error) {
      //     socket.emit('error',{message:error instanceof Error ? error.message : "Failed to join call"})
      //   }
      // })





      // socket.on('join-call', async ({ roomId, userId }) => {
      //   console.log('Received join-call:', { roomId, userId, socketId: socket.id });
      //   try {
      //     await this.callRepository.joinCall(roomId, userId);
      //     socket.join(roomId);
      //     // Notify all in room except sender
      //     socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
      //     // Send existing users to the new joiner
      //     const room = await this.callRepository.getRoomParticipants(roomId);
      //     const participants = room?.participants.filter((id:any) => id.toString() !== userId) || [];
      //     participants.forEach((existingUserId:any) => {
      //       socket.emit('user-joined', { userId: existingUserId.toString(), socketId: socket.id });
      //     });
      //     console.log(`User ${userId} joined call in room ${roomId}, notified others`);
      //   } catch (error) {
      //     const errorMessage = error instanceof Error ? error.message : 'Failed to join call';
      //     console.error('Join-call error:', errorMessage, error);
      //     socket.emit('error', { message: errorMessage });
      //   }
      // });

      // socket.on('offer',({roomId,offer,from}) => {
      //   socket.to(roomId).emit('offer',{offer,from})
      // })
      // socket.on('answer',({roomId,answer,from}) => {
      //   socket.to(roomId).emit('answer',{answer,from})
      // })
      // socket.on('ice-candidate',({roomId,candidate,from}) => {
      //   socket.to(roomId).emit('ice-candidate',{candidate,from})
      // })




  //     socket.on('join-call', async ({ roomId, userId }) => {
  //       console.log('Received join-call:', { roomId, userId, socketId: socket.id });
  //       try {
  //         await this.callRepository.joinCall(roomId, userId);
  //         socket.join(roomId);
  
  //         // Notify all existing users in the room about the new user
  //         socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
  //         console.log(`User ${userId} joined call in room ${roomId}, notified others`);
  
  //         // Notify new user about existing participants
  //         const room = await this.callRepository.getRoomParticipants(roomId);
  //         const participants = room?.participants.filter((id) => id.toString() !== userId) || [];
  //         participants.forEach((existingUserId) => {
  //           const socketsInRoom = this.io.sockets.adapter.rooms.get(roomId);
  //           const socketIds = Array.from(socketsInRoom || []).filter((id) => id !== socket.id);
  //           socketIds.forEach((existingSocketId) => {
  //             socket.emit('user-joined', { userId: existingUserId.toString(), socketId: existingSocketId });
  //           });
  //         });
  //       } catch (error) {
  //         const errorMessage = error instanceof Error ? error.message : 'Failed to join call';
  //         console.error('Join-call error:', errorMessage, error);
  //         socket.emit('error', { message: errorMessage });
  //       }
  //     });
  
  //     socket.on('offer', ({ roomId, offer, from }) => {
  //       console.log('Received offer:', { roomId, from });
  //       socket.to(roomId).emit('offer', { offer, from });
  //     });
  
  //     socket.on('answer', ({ roomId, answer, from }) => {
  //       console.log('Received answer:', { roomId, from });
  //       socket.to(roomId).emit('answer', { answer, from });
  //     });
  
  //     socket.on('ice-candidate', ({ roomId, candidate, from }) => {
  //       console.log('Received ICE candidate:', { roomId, from });
  //       socket.to(roomId).emit('ice-candidate', { candidate, from });
  //     });

  //     socket.on('leave-call',async ({roomId,userId}) => {
  //       try {
  //         await this.callRepository.leaveCall(roomId,userId)
  //         socket.to(roomId).emit('user-left',{userId,socketId:socket.id})
  //         socket.leave(roomId)
  //         console.log(`User ${userId} left call in room ${roomId}`)
  //       } catch (error) {
  //         socket.emit('error',{message: error instanceof Error ? error.message : "Failed to leave call"})
  //       }
  //     })

  //     socket.on('disconnect',() => {
  //       console.log(`User disconnected from call ${socket.id}`)
  //     })

  //   })
  // }

//   async getRoomParticipants(roomId: string): Promise<{ participants: mongoose.Types.ObjectId[] } | null> {
//     return this.callRepository.getRoomParticipants(roomId);
// }
// }











// backend/src/services/CallService.ts
import { Server, Socket } from 'socket.io';
import { ICallRepository } from '../interfaces/ICallRepository';
import { AppError } from '../utils/AppError';

export class CallService {
  private io: Server;
  private callRepository: ICallRepository;

  constructor(callRepository: ICallRepository, io: Server) {
    this.callRepository = callRepository;
    this.io = io;
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected to call:', socket.id);

      socket.on('join-call', async (data: { roomId: string; userId: string }) => {
        const { roomId, userId } = data;
        console.log('Received join-call:', { roomId, userId, socketId: socket.id });

        try {
          await this.callRepository.joinCall(roomId, userId);
          socket.join(roomId);
          socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
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

      socket.on('offer', (data: { roomId: string; offer: RTCSessionDescriptionInit; to: string }) => {
        console.log('Received offer:', { roomId: data.roomId, from: socket.id, to: data.to });
        this.io.to(data.to).emit('offer', { offer: data.offer, from: socket.id });
      });

      socket.on('answer', (data: { roomId: string; answer: RTCSessionDescriptionInit; to: string }) => {
        console.log('Received answer:', { roomId: data.roomId, from: socket.id, to: data.to });
        this.io.to(data.to).emit('answer', { answer: data.answer, from: socket.id });
      });

      socket.on('ice-candidate', (data: { roomId: string; candidate: RTCIceCandidateInit; to: string }) => {
        console.log('Received ICE candidate:', { roomId: data.roomId, from: socket.id, to: data.to });
        this.io.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Optionally notify room of disconnect if user was in a call
        // Requires tracking socket-to-room mapping
      });
    });
  }
}