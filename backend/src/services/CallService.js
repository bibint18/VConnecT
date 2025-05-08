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
exports.CallService = void 0;
const AppError_1 = require("../utils/AppError");
const CallModel_1 = require("../models/CallModel");
class CallService {
    constructor(callRepository, directCallRepository, io) {
        this.socketMap = new Map();
        this.callRepository = callRepository;
        this.directCallRepository = directCallRepository;
        this.io = io;
        this.setupSocketEvents();
    }
    setupSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('User connected to call:', socket.id);
            socket.on("join-user", ({ userId }) => {
                socket.join(userId);
                this.socketMap.set(userId, socket.id);
                console.log(`User ${userId} joined room ${userId}, socket: ${socket.id}`);
            });
            socket.on('join-call', (data) => __awaiter(this, void 0, void 0, function* () {
                const { roomId, userId, username } = data;
                console.log('Received join-call:', { roomId, userId, username, socketId: socket.id });
                try {
                    yield this.callRepository.joinCall(roomId, userId);
                    socket.join(roomId);
                    socket.userId = userId; // Attach userId to socket
                    this.socketMap.set(userId, socket.id);
                    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id, username });
                    console.log(`User ${userId} joined call in room ${roomId}, notified others`);
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError('Failed to join call', 500);
                    console.error('Join call error:', err);
                    socket.emit('error', { message: err.message, status: err.statusCode });
                }
            }));
            socket.on('leave-call', (data) => __awaiter(this, void 0, void 0, function* () {
                const { roomId, userId } = data;
                console.log('Received leave-call:', { roomId, userId, socketId: socket.id });
                try {
                    yield this.callRepository.leaveCall(roomId, userId);
                    socket.leave(roomId);
                    socket.to(roomId).emit('user-left', { userId, socketId: socket.id });
                    console.log(`User ${userId} left call in room ${roomId}`);
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError('Failed to leave call', 500);
                    console.error('Leave call error:', err);
                    socket.emit('error', { message: err.message, status: err.statusCode });
                }
            }));
            socket.on('offer', (data) => {
                console.log('Received offer:', { roomId: data.roomId, from: socket.id, to: data.to, username: data.username });
                this.io.to(data.to).emit('offer', { offer: data.offer, from: socket.id, username: data.username });
            });
            socket.on('answer', (data) => {
                console.log('Received answer:', { roomId: data.roomId, from: socket.id, to: data.to, username: data.username });
                this.io.to(data.to).emit('answer', { answer: data.answer, from: socket.id, username: data.username });
            });
            socket.on('ice-candidate', (data) => {
                console.log('Received ICE candidate:', { roomId: data.roomId, from: socket.id, to: data.to });
                this.io.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
            });
            //on to one
            socket.on("directCall:initiate", (_a) => __awaiter(this, [_a], void 0, function* ({ callId, callerId, receiverId }) {
                console.log("Received direct:initiate:", { callId, callerId, receiverId });
                try {
                    const call = new CallModel_1.Call({
                        callId,
                        callerId,
                        receiverId,
                        status: "INITIATED",
                        startTime: new Date(),
                    });
                    yield call.save();
                    this.io.to(receiverId).emit("directCall:incoming", { callId, callerId });
                    console.log(`Emitted direct:incoming to ${receiverId}`);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        const updatedCall = yield CallModel_1.Call.findOne({ callId });
                        if (updatedCall && updatedCall.status === "INITIATED") {
                            const receiverSockets = this.io.sockets.adapter.rooms.get(receiverId);
                            if (!receiverSockets || receiverSockets.size === 0) {
                                console.log(`Receiver ${receiverId} still offline, marking call ${callId} as MISSED`);
                                updatedCall.status = "MISSED";
                                yield updatedCall.save();
                                this.io.to(callerId).emit("direct:missed", { callId });
                            }
                        }
                    }), 30000);
                }
                catch (error) {
                    console.error("Error initiating call:", error);
                    this.io.to(callerId).emit("direct:error", { callId, error: "Failed to initiate call" });
                }
            }));
            socket.on("directCall:join", (data) => __awaiter(this, void 0, void 0, function* () {
                const { callId, userId } = data;
                console.log("Received directCall:join:", { callId, userId, socketId: socket.id });
                try {
                    const call = yield this.directCallRepository.getCallById(callId);
                    if (!call) {
                        throw new AppError_1.AppError("Call not found", 404);
                    }
                    socket.join(callId);
                    const otherUserId = call.callerId.toString() === userId ? call.receiverId.toString() : call.callerId.toString();
                    const otherSocketId = this.socketMap.get(otherUserId);
                    if (otherSocketId) {
                        this.io.to(otherSocketId).emit("directCall:peer-joined", { peerId: userId });
                    }
                    console.log(`User ${userId} joined call ${callId}`);
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to join call", 500);
                    console.error("Join call error:", err);
                    socket.emit("directCall:error", { message: err.message });
                }
            }));
            socket.on("directCall:accept", (data) => __awaiter(this, void 0, void 0, function* () {
                const { callId } = data;
                console.log("Received directCall:accept::::::::", { callId, socketId: socket.id });
                try {
                    const call = yield this.directCallRepository.getCallById(callId);
                    if (!call) {
                        throw new AppError_1.AppError("Call not found", 404);
                    }
                    yield this.directCallRepository.updateCallStatus(callId, "ACCEPTED");
                    const callerSocketId = this.socketMap.get(call.callerId.toString());
                    console.log("Caller socket id in the accept callll", callerSocketId);
                    if (callerSocketId) {
                        this.io.to(callerSocketId).emit("directCall:accepted", { callId });
                    }
                    // socket.to(callId).emit("directCall:accepted", { callId });
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to accept call", 500);
                    console.error("Accept call error:", err);
                    socket.emit("directCall:error", { message: err.message });
                }
            }));
            socket.on("directCall:reject", (data) => __awaiter(this, void 0, void 0, function* () {
                const { callId } = data;
                console.log("Received directCall:reject:", { callId, socketId: socket.id });
                try {
                    yield this.directCallRepository.updateCallStatus(callId, "REJECTED");
                    const call = yield this.directCallRepository.getCallById(callId);
                    if (call) {
                        const callerSocketId = this.socketMap.get(call.callerId.toString());
                        if (callerSocketId) {
                            this.io.to(callerSocketId).emit("directCall:rejected", { callId });
                        }
                    }
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to reject call", 500);
                    console.error("Reject call error:", err);
                    socket.emit("directCall:error", { message: err.message });
                }
            }));
            socket.on("directCall:offer", (data) => {
                console.log("Received directCall:offer::::", { callId: data.callId, from: socket.id, to: data.to });
                this.io.to(data.to).emit("directCall:offer", { offer: data.offer, from: socket.id });
            });
            socket.on("directCall:answer", (data) => {
                console.log("Received directCall:answer:", { callId: data.callId, from: socket.id, to: data.to });
                this.io.to(data.to).emit("directCall:answer", { answer: data.answer, from: socket.id });
            });
            socket.on("directCall:ice-candidate", (data) => {
                console.log("Received directCall:ice-candidateeeeeeeeeeeee:", { callId: data.callId, from: socket.id, to: data.to });
                this.io.to(data.to).emit("directCall:ice-candidate", { candidate: data.candidate, from: socket.id });
            });
            socket.on("directCall:end", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log("Direct call end triggered:", data, "Socket:", socket.id);
                const { callId, userId } = data;
                console.log("Received directCall:end:", { callId, userId, socketId: socket.id });
                try {
                    yield this.directCallRepository.endCall(callId, userId);
                    socket.to(callId).emit("directCall:ended", { callId });
                    socket.leave(callId);
                }
                catch (error) {
                    const err = error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to end call", 500);
                    console.error("End call error:", err);
                    socket.emit("directCall:error", { message: err.message });
                }
            }));
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
exports.CallService = CallService;
