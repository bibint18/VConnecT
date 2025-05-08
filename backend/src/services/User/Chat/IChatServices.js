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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class ChatService {
    constructor(chatRepository, chatIo, callRepository) {
        this.chatRepository = chatRepository;
        this.chatIo = chatIo;
        this.callRepository = callRepository;
        this.activeCallRequests = new Set();
        console.log("ChatService initialized with chatIo:", chatIo ? "present" : "undefined");
        this.setupSocketEvents();
    }
    sendMessage(senderId_1, recieverId_1, content_1, mediaUrl_1) {
        return __awaiter(this, arguments, void 0, function* (senderId, recieverId, content, mediaUrl, mediaType = 'text') {
            const message = {
                senderId: new mongoose_1.default.Types.ObjectId(senderId),
                receiverId: new mongoose_1.default.Types.ObjectId(recieverId),
                content: content,
                mediaUrl,
                mediaType,
                timestamp: new Date(),
                isRead: false
            };
            console.log("message from send service ", message);
            yield this.chatRepository.saveMessage(message);
            this.chatIo.to(recieverId).emit("receive-message", message);
            this.chatIo.to(senderId).emit("receive-message", message);
            console.log("passed to sender and reciever");
            const lastMessage = yield this.chatRepository.getLastMessage(senderId, recieverId);
            console.log("service last Message", lastMessage);
            const unreadCountSender = yield this.chatRepository.getUnreadMessageCount(senderId, recieverId);
            console.log("service unread sender count", unreadCountSender);
            const unreadCountReceiver = yield this.chatRepository.getUnreadMessageCount(recieverId, senderId);
            console.log("service unread receiever count", unreadCountReceiver);
            this.chatIo.to(senderId).emit('update-last-message', {
                friendId: recieverId, lastMessage, unreadCount: unreadCountSender
            });
            this.chatIo.to(recieverId).emit('update-last-message', {
                friendId: senderId, lastMessage, unreadCount: unreadCountReceiver
            });
        });
    }
    getChatHistory(senderId, recieverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatRepository.getMessages(senderId, recieverId);
        });
    }
    getLastMessage(senderId, recieverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastMessage = yield this.chatRepository.getLastMessage(senderId, recieverId);
            console.log("get Lastmessafe", lastMessage);
            return lastMessage;
        });
    }
    getUnreadMessageCount(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.chatRepository.getUnreadMessageCount(userId, friendId);
            console.log("geyUnread count", count);
            return count;
        });
    }
    handleSocketEvents(socket) {
        socket.on('join-chat', ({ userId }, callback) => {
            console.log(`User ${userId} joining chat with socket ${socket.id}`);
            socket.data.userId = userId;
            socket.join(userId);
            if (callback) {
                callback({ status: 'success', rooms: Array.from(socket.rooms), socketId: socket.id });
            }
        });
        socket.on('send-message', (_a) => __awaiter(this, [_a], void 0, function* ({ senderId, receiverId, content, mediaUrl, mediaType }) {
            yield this.sendMessage(senderId, receiverId, content, mediaUrl, mediaType);
        }));
        socket.on('disconnect', () => {
            console.log("User disconnected from chat", socket.id);
        });
    }
    setupSocketEvents() {
        this.chatIo.on("connection", (socket) => {
            var _a;
            console.log(`New connection ${socket.id} from user ${(_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.userId}`);
            socket.use(([event, ...args], next) => {
                console.log(`Socket event: ${event}`);
                next();
            });
            socket.on("join-chat", ({ userId }, callback) => {
                console.log(`User ${userId} joining with socket ${socket.id}`);
                socket.data.userId = userId;
                socket.join(userId);
                if (callback) {
                    callback({
                        status: "success",
                        rooms: Array.from(socket.rooms),
                        socketId: socket.id
                    });
                }
            });
            socket.on("friend-start-call", (_a) => __awaiter(this, [_a], void 0, function* ({ callerId, receiverId }) {
                const requestKey = `${callerId}_${receiverId}`;
                if (this.activeCallRequests.has(requestKey)) {
                    console.log(`Ignoring duplicate friend-start-call: ${requestKey}`);
                    return;
                }
                this.activeCallRequests.add(requestKey);
                try {
                    console.count("Processing friend-start-call");
                    console.log("Received friend-start-call:", { callerId, receiverId });
                    yield this.startFriendCall(callerId, receiverId);
                }
                catch (error) {
                    console.error("Error in friend-start-call:", error);
                    this.chatIo.to(callerId).emit("friend-call-error", { message: "Failed to start call" });
                }
                finally {
                    this.activeCallRequests.delete(requestKey);
                }
            }));
            socket.on("friend-accept-call", (_a) => __awaiter(this, [_a], void 0, function* ({ callId, userId }) {
                console.log("Received friend-accept-call:", { callId, userId });
                yield this.acceptFriendCall(callId, userId, socket);
            }));
            socket.on("friend-reject-call", (_a) => __awaiter(this, [_a], void 0, function* ({ callId, userId }) {
                console.log("Received friend-reject-call:", { callId, userId });
                yield this.rejectFriendCall(callId, userId);
            }));
            socket.on("friend-offer", ({ callId, offer, to }) => {
                console.log("Received friend-offer:", { callId, to });
                this.chatIo.to(to).emit("friend-offer", { callId, offer, from: socket.id });
            });
            socket.on("friend-answer", ({ callId, answer, to }) => {
                console.log("Received friend-answer:", { callId, to });
                this.chatIo.to(callId).emit("friend-answer", { callId, answer, from: socket.id });
            });
            socket.on("friend-ice-candidate", ({ callId, candidate, to }) => {
                console.log("Received friend-ice-candidate:", { callId, to });
                this.chatIo.to(callId).emit("friend-ice-candidate", { callId, candidate, from: socket.id });
            });
            socket.on("friend-end-call", (_a) => __awaiter(this, [_a], void 0, function* ({ callId, userId }) {
                console.log("Received friend-end-call:", { callId, userId });
                yield this.endFriendCall(callId, userId);
            }));
        });
    }
    startFriendCall(callerId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueSuffix = Date.now().toString();
            const callId = `call_${[callerId, receiverId].sort().join("_")}_${uniqueSuffix}`;
            const call = {
                callerId,
                receiverId,
                callId,
                startTime: new Date(),
                status: "INITIATED",
            };
            console.log("Creating new call:", callId);
            yield this.callRepository.createCall(call);
            const receiverSocket = yield this.isUserConnected(receiverId);
            if (!receiverSocket) {
                throw new Error("Receiver is not connected");
            }
            console.log("Call initiated:", callId);
            console.log(`Emitting friend-call-incoming to receiver: ${receiverId}`);
            this.chatIo.to(receiverId).emit("friend-call-incoming", { callId, callerId });
            console.log(`Emitted friend-call-incoming to receiver: ${receiverId}`);
            console.log(`Emitting friend-call-ringing to caller: ${callerId}`);
            this.chatIo.to(callerId).emit("friend-call-ringing", { callId, receiverId });
            console.log(`Emitted friend-call-ringing to caller: ${callerId}`);
        });
    }
    isUserConnected(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // This is more reliable than checking sockets directly
                const sockets = yield this.chatIo.in(userId).allSockets();
                return sockets.size > 0;
            }
            catch (error) {
                console.error("Error checking user connection:", error);
                return false;
            }
        });
    }
    acceptFriendCall(callId, userId, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.callRepository.findCallById(callId);
            if (call && call.status === "INITIATED") {
                yield this.callRepository.updateCall(callId, { status: "ACCEPTED" });
                socket.join(callId);
                this.chatIo.in(call.callerId.toString()).socketsJoin(callId);
                this.chatIo.to(callId).emit("friend-call-accepted", { callId, receiverId: userId });
                console.log(`${userId} accepted call: ${callId}`);
            }
        });
    }
    rejectFriendCall(callId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.callRepository.findCallById(callId);
            if (call && call.status === "INITIATED") {
                yield this.callRepository.updateCall(callId, { status: "REJECTED", endTime: new Date() });
                this.chatIo.to(call.callerId.toString()).emit("friend-call-rejected", { callId });
                console.log(`${userId} rejected call: ${callId}`);
            }
        });
    }
    endFriendCall(callId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.callRepository.findCallById(callId);
            if (call && (call.status === "ACCEPTED" || call.status === "INITIATED")) {
                const newStatus = call.status === "ACCEPTED" ? "COMPLETED" : "MISSED";
                const endTime = new Date();
                yield this.callRepository.updateCall(callId, { status: newStatus, endTime });
                const message = {
                    senderId: call.callerId,
                    receiverId: call.receiverId,
                    content: `Call ${newStatus} at ${endTime.toLocaleTimeString()}`,
                    timestamp: endTime,
                    isRead: false,
                };
                const savedMessage = yield this.chatRepository.saveMessage(message);
                this.chatIo.to(call.callerId.toString()).emit("receive-message", savedMessage);
                this.chatIo.to(call.receiverId.toString()).emit("receive-message", savedMessage);
                this.chatIo.to(callId).emit("friend-call-ended", { callId });
                console.log(`Call ended: ${callId} by ${userId}`);
            }
        });
    }
    markMessagesAsRead(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatRepository.markMessageAsRead(userId, friendId);
        });
    }
}
exports.ChatService = ChatService;
