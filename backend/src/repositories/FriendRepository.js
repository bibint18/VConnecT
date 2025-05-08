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
exports.FriendRepository = void 0;
const FriendRequestModel_1 = require("../models/FriendRequestModel");
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
class FriendRepository {
    sendFriendRequest(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (from === to)
                throw new AppError_1.AppError("Cannot send friend request to yourself", 400);
            const existingRequest = yield FriendRequestModel_1.FriendRequest.findOne({
                from,
                to,
                status: "pending",
            }).exec();
            if (existingRequest)
                throw new AppError_1.AppError("Friend request already sent", 400);
            const areFriends = yield User_1.User.findOne({
                _id: from,
                friends: { $in: [to] },
            }).exec();
            if (areFriends)
                throw new AppError_1.AppError("User is already your friend", 400);
            yield FriendRequestModel_1.FriendRequest.create({ from, to });
        });
    }
    getPendingRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield FriendRequestModel_1.FriendRequest.find({ to: userId, status: "pending" })
                .populate("from", "name username profileImage")
                .exec();
            return requests.map((req) => ({
                id: req._id.toString(),
                from: req.from,
                createdAt: req.createdAt,
            }));
        });
    }
    respondToFriendRequest(requestId, userId, accept) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield FriendRequestModel_1.FriendRequest.findById(requestId).exec();
            if (!request)
                throw new AppError_1.AppError("Friend request not found", 404);
            if (request.to.toString() !== userId)
                throw new AppError_1.AppError("Unauthorized", 403);
            request.status = accept ? "accepted" : "rejected";
            yield request.save();
            if (accept) {
                yield User_1.User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } }).exec();
                yield User_1.User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } }).exec();
            }
        });
    }
    getFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById(userId).populate("friends", "name username profileImage").exec();
            if (!user)
                throw new AppError_1.AppError("User not found", 404);
            return user.friends;
        });
    }
}
exports.FriendRepository = FriendRepository;
