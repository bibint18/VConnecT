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
exports.ChatRepository = void 0;
const MessageModel_1 = require("../../../models/MessageModel");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepository {
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("data from repo", message);
            const newMessage = new MessageModel_1.Message(message);
            yield newMessage.save();
            console.log("saved data repo", newMessage);
        });
    }
    getMessages(senderId, recieverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield MessageModel_1.Message.find({
                $or: [
                    { senderId: new mongoose_1.default.Types.ObjectId(senderId), receiverId: new mongoose_1.default.Types.ObjectId(recieverId) },
                    { senderId: new mongoose_1.default.Types.ObjectId(recieverId), receiverId: new mongoose_1.default.Types.ObjectId(senderId) }
                ]
            }).sort({ timestamp: -1 }).exec();
            // console.log("messages from repo history",messages)
            return messages;
        });
    }
    getLastMessage(senderId, recieverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield MessageModel_1.Message.findOne({
                $or: [
                    { senderId: new mongoose_1.default.Types.ObjectId(senderId), receiverId: new mongoose_1.default.Types.ObjectId(recieverId) },
                    { senderId: new mongoose_1.default.Types.ObjectId(recieverId), receiverId: new mongoose_1.default.Types.ObjectId(senderId) }
                ]
            }).sort({ timestamp: -1 });
            console.log("repo lastMessage", message);
            return message;
        });
    }
    getUnreadMessageCount(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield MessageModel_1.Message.countDocuments({
                senderId: new mongoose_1.default.Types.ObjectId(friendId),
                receiverId: new mongoose_1.default.Types.ObjectId(userId),
                isRead: false
            });
            console.log("repo count", count);
            return count;
        });
    }
    markMessageAsRead(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MessageModel_1.Message.updateMany({ senderId: new mongoose_1.default.Types.ObjectId(friendId), receiverId: new mongoose_1.default.Types.ObjectId(userId), isRead: false }, { $set: { isRead: true } });
        });
    }
}
exports.ChatRepository = ChatRepository;
