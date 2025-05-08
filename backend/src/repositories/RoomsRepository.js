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
exports.RoomRepository = void 0;
const RoomModel_1 = require("../models/RoomModel");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../utils/AppError");
const User_1 = require("../models/User");
class RoomRepository {
    createRoom(roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById(roomData.createdBy);
            if (!user) {
                throw new AppError_1.AppError("User not found", 404);
            }
            if ((user === null || user === void 0 ? void 0 : user.availableRoomLimit) == 0) {
                throw new Error("You have reached your room creation limit!!!");
            }
            console.log('Users room create limit', user === null || user === void 0 ? void 0 : user.availableRoomLimit);
            if (roomData.title.trim() === '') {
                throw new Error("Should add title");
            }
            const existingTitle = yield RoomModel_1.Room.findOne({ title: roomData.title });
            if (existingTitle) {
                throw new Error("Title already exist");
            }
            if (roomData.limit > 10 || roomData.limit < 1) {
                throw new Error("Limit should between 1-10");
            }
            if (roomData.description.trim() === '') {
                throw new Error("Should add description");
            }
            const room = new RoomModel_1.Room(roomData);
            const savedRoom = yield room.save();
            const updatedUser = yield User_1.User.findByIdAndUpdate(roomData.createdBy, { $inc: { availableRoomLimit: -1 } }, { new: true, runValidators: true });
            if (!updatedUser) {
                throw new AppError_1.AppError("Failed to update room limit : User not found", 500);
            }
            if (updatedUser.availableRoomLimit < 0) {
                throw new AppError_1.AppError("Room limit cannot be negative", 500);
            }
            return savedRoom;
        });
    }
    getAllRooms(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 10, search, type) {
            const user = yield User_1.User.findById(userId);
            const query = {};
            if (search) {
                query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
            }
            if (type) {
                query.type = type;
            }
            query.isDeleted = false;
            query.isBlocked = false;
            const skip = (page - 1) * limit;
            const rooms = yield RoomModel_1.Room.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
            console.log("rooms from service ", rooms);
            const total = yield RoomModel_1.Room.countDocuments(query);
            return { rooms, user, total };
        });
    }
    joinRoom(RoomId, userId, secretCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield RoomModel_1.Room.findById(RoomId);
                console.log("repository rooommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", room, userId);
                if (room === null || room === void 0 ? void 0 : room.isBlocked) {
                    throw new Error("Room is Blocked");
                }
                if (!room) {
                    throw new Error("Room not found...");
                }
                if (room.type === 'PRIVATE' && room.secretCode !== secretCode) {
                    throw new Error("Invalid secret code...");
                }
                if (room.participants.some((id) => id.toString() === userId)) {
                    return room;
                }
                const activeParticipants = room.participants.filter((p) => !p.lastLeave || p.lastJoin > p.lastLeave);
                console.log("active participantsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", activeParticipants);
                const isParticipant = room.participants.some((p) => p.userId.toString() === userId);
                console.log("is participantsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", isParticipant);
                console.log("active participants length", activeParticipants.length);
                if (!isParticipant && activeParticipants.length >= room.limit) {
                    throw new AppError_1.AppError("Room is full", 400);
                }
                const participantIndex = room.participants.findIndex((p) => p.userId.toString() === userId);
                const now = new Date();
                if (participantIndex === -1) {
                    room.participants.push({
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        firstJoin: now,
                        lastJoin: now,
                        lastLeave: null,
                        totalDuration: 0,
                    });
                }
                else {
                    room.participants[participantIndex].lastJoin = now;
                }
                return yield room.save();
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.RoomRepository = RoomRepository;
