import { Server, Socket } from "socket.io";
import { IFriendRepository } from "../interfaces/IFriendRepository.js";
import { AppError } from "../utils/AppError.js";
import { FriendRequest } from "../models/FriendRequestModel.js";
export class FriendService {
  private io: Server;
  private friendRepository: IFriendRepository;
  private socketMap: Map<string, string> = new Map(); 

  constructor(friendRepository: IFriendRepository, io: Server) {
    this.friendRepository = friendRepository;
    this.io = io;
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected to friend service:", socket.id);

      socket.on("register-user", (data: { userId: string }) => {
        (socket as any).userId = data.userId;
        this.socketMap.set(data.userId, socket.id);
        console.log(`User ${data.userId} registered with socket ${socket.id} socket.userId: ${(socket as any).userId}`);
      });

      socket.on("send-friend-request", async (data: { to: string }, callback) => {
        const userId = (socket as any).userId; 
        if (!userId) return callback({ error: "Unauthorized" });

        try {
          await this.friendRepository.sendFriendRequest(userId, data.to);
          const request = await FriendRequest.findOne({ from: userId, to: data.to, status: "pending" }).exec();
          socket.emit("friend-request-sent", { to: data.to });
          const toSocketId = this.socketMap.get(data.to);
          if (toSocketId) {
            this.io.to(toSocketId).emit("friend-request-received", {
              requestId: request?._id as string,
              from: userId,
            });
          }
          callback({ success: true });
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError("Failed to send friend request", 500);
          callback({ error: err.message });
        }
      });

      socket.on("respond-friend-request", async (data: { requestId: string; accept: boolean }, callback) => {
        const userId = (socket as any).userId;
        console.log("userId from respond backend service",userId)
        if (!userId) return callback({ error: "Unauthorized" });

        try {
          await this.friendRepository.respondToFriendRequest(data.requestId, userId, data.accept);
          const request = await FriendRequest.findById(data.requestId).exec();
          const fromSocketId = this.socketMap.get(request!.from.toString());
          if (fromSocketId) {
            this.io.to(fromSocketId).emit(`friend-request-${data.accept ? "accepted" : "rejected"}`, {
              by: userId,
            });
          }
          callback({ success: true });
        } catch (error) {
          const err = error instanceof AppError ? error : new AppError("Failed to respond to friend request", 500);
          callback({ error: err.message });
        }
      });

      socket.on("disconnect", () => {
        const userId = Array.from(this.socketMap.entries()).find(([, sid]) => sid === socket.id)?.[0];
        if (userId) this.socketMap.delete(userId);
        console.log("User disconnected from friend service:", socket.id);
      });
    });
  }

  public getSocketId(userId: string): string | undefined {
    return this.socketMap.get(userId);
  }
}