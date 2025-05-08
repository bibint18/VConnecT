"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendService = void 0;
const AppError_1 = require("../utils/AppError");
const FriendRequestModel_1 = require("../models/FriendRequestModel");
class FriendService {
    constructor(friendRepository, io) {
        this.socketMap = new Map();
        this.friendRepository = friendRepository;
        this.io = io;
        this.setupSocketEvents();
    }
    setupSocketEvents() {
        this.io.on("connection", (socket) => {
            console.log("User connected to friend service:", socket.id);
            socket.on("register-user", (data) => {
                socket.userId = data.userId;
                this.socketMap.set(data.userId, socket.id);
                console.log(`User ${data.userId} registered with socket ${socket.id} socket.userId: ${socket.userId}`);
            });
            socket.on("send-friend-request", (data, callback) => __awaiter(this, void 0, void 0, function* () {
                const userId = socket.userId; // Set via middleware or join-call
                if (!userId)
                    return callback({ error: "Unauthorized" });
                try {
                    yield this.friendRepository.sendFriendRequest(userId, data.to);
                    const request = yield FriendRequestModel_1.FriendRequest.findOne({ from: userId, to: data.to, status: "pending" }).exec();
                    socket.emit("friend-request-sent", { to: data.to });
                    const toSocketId = this.socketMap.get(data.to);
                    if (toSocketId) {
                        this.io.to(toSocketId).emit("friend-request-received", {
                            requestId: request === null || request === void 0 ? void 0 : request._id.toString(),
                            from: userId,
                        });
                    }
                    callback({ success: true });
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to send friend request", 500);
                    callback({ error: err.message });
                }
            }));
            socket.on("respond-friend-request", (data, callback) => __awaiter(this, void 0, void 0, function* () {
                console.log("responded to the friend requestttttttttttttttttttt");
                const userId = socket.userId;
                console.log("userId from respond backend service", userId);
                if (!userId)
                    return callback({ error: "Unauthorized" });
                try {
                    yield this.friendRepository.respondToFriendRequest(data.requestId, userId, data.accept);
                    const request = yield FriendRequestModel_1.FriendRequest.findById(data.requestId).exec();
                    const fromSocketId = this.socketMap.get(request.from.toString());
                    if (fromSocketId) {
                        this.io.to(fromSocketId).emit(`friend-request-${data.accept ? "accepted" : "rejected"}`, {
                            by: userId,
                        });
                    }
                    callback({ success: true });
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to respond to friend request", 500);
                    callback({ error: err.message });
                }
            }));
            socket.on("disconnect", () => {
                var _a;
                const userId = (_a = Array.from(this.socketMap.entries()).find(([, sid]) => sid === socket.id)) === null || _a === void 0 ? void 0 : _a[0];
                if (userId)
                    this.socketMap.delete(userId);
                console.log("User disconnected from friend service:", socket.id);
            });
        });
    }
    getSocketId(userId) {
        return this.socketMap.get(userId);
    }
}
exports.FriendService = FriendService;
