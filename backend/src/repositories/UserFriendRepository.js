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
exports.UserFriendRespository = void 0;
const MessageModel_1 = require("../models/MessageModel");
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
class UserFriendRespository {
    getUserFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(userId).populate('friends', '_id name profileImage').exec();
                if (!user) {
                    throw new AppError_1.AppError("User not found", 404);
                }
                const friendList = yield Promise.all(user.friends.map((friend) => __awaiter(this, void 0, void 0, function* () {
                    const lastMessage = yield MessageModel_1.Message.findOne({
                        $or: [
                            { senderId: user._id, receiverId: friend._id },
                            { senderId: friend._id, receiverId: user._id }
                        ]
                    }).sort({ timestamp: -1 });
                    console.log("getUser repo lastmessafe", lastMessage);
                    console.log("getUser repo friendId", friend._id);
                    console.log("getUser repo UserId", user._id);
                    const unreadCount = yield MessageModel_1.Message.countDocuments({ senderId: friend._id, receiverId: user._id, isRead: false });
                    const formattedTimestamp = (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.timestamp)
                        ? new Date(lastMessage.timestamp).toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })
                        : new Date().toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        });
                    return {
                        id: friend._id.toString(),
                        name: friend.name,
                        avatar: friend.profileImage || "https://via.placeholder.com/150",
                        lastMessage: (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.content) || "NO MESSAGES YET",
                        timestamp: formattedTimestamp,
                        fullTimestamp: (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.timestamp) || new Date(),
                        isOnline: false,
                        unreadCount
                    };
                })));
                friendList.sort((a, b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime());
                console.log("getUser repo friendList", friendList);
                return friendList;
            }
            catch (error) {
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to fetch friends", 500);
            }
        });
    }
}
exports.UserFriendRespository = UserFriendRespository;
