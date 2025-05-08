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
exports.ChatController = void 0;
const AppError_1 = require("../../../utils/AppError");
const app_1 = require("../../../app");
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { receiverId, content, mediaUrl, mediaType } = req.body;
                const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!senderId || !receiverId) {
                    throw new AppError_1.AppError("Sender ID, receiver ID are required", 400);
                }
                if (!content && !mediaUrl) {
                    throw new AppError_1.AppError("Content or media URL is required", 400);
                }
                if (mediaUrl && !['image', 'video'].includes(mediaType)) {
                    throw new AppError_1.AppError("Invalid media type", 400);
                }
                yield this.chatService.sendMessage(senderId, receiverId, content, mediaUrl, mediaType);
                res.status(200).json({ success: true, message: "Message sent" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getChatHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("reached history controller");
                const { receiverId } = req.query;
                const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!senderId || !receiverId) {
                    throw new AppError_1.AppError("Sender ID and receiver ID are required", 400);
                }
                const history = yield this.chatService.getChatHistory(senderId, receiverId);
                // console.log("data from controller history",history)
                res.status(200).json({ success: true, data: history });
            }
            catch (error) {
                next(error);
            }
        });
    }
    markMessageAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, friendId } = req.body;
                yield this.chatService.markMessagesAsRead(userId, friendId);
                const lastMessage = yield this.chatService.getLastMessage(userId, friendId);
                console.log("controller lastmnessage update", lastMessage);
                const unreadCount = yield this.chatService.getUnreadMessageCount(userId, friendId);
                console.log("controller unreadCOunt update", unreadCount);
                app_1.chatIo.to(userId).emit('update-last-message', {
                    friendId, lastMessage, unreadCount
                });
                res.status(200).json({ success: true, message: "Mark messages as read" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ChatController = ChatController;
