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
exports.FriendController = void 0;
const AppError_1 = require("../utils/AppError");
const User_1 = require("../models/User");
class FriendController {
    constructor(friendRepository) {
        this.getPendingRequests = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('backend friend request');
                const userId = req.user.id;
                if (!userId)
                    throw new AppError_1.AppError("Unauthorized", 401);
                const requests = yield this.friendRepository.getPendingRequests(userId);
                res.status(200).json({ requests });
            }
            catch (error) {
                next(error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to fetch friend requests", 500));
            }
        });
        this.friendRepository = friendRepository;
    }
    getFriends(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error("Unauthorized");
                }
                const user = yield User_1.User.findById(userId).select("friends").populate("friends", "_id name");
                console.log("controller friendsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", user);
                if (!user) {
                    throw new Error("no user");
                }
                res.status(200).json({ friends: user.friends.map(f => ({ id: f._id.toString() })) });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FriendController = FriendController;
