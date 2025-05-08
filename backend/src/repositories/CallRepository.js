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
exports.CallRepository = void 0;
const RoomModel_1 = require("../models/RoomModel");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
class CallRepository {
    joinCall(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("call Repositoryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ", roomId, userId);
                const room = yield RoomModel_1.Room.findById(roomId).exec();
                if (!room) {
                    throw new AppError_1.AppError("Room not found", 404);
                }
                if (!userId) {
                    throw new AppError_1.AppError("No user id reached backend", 404);
                }
                // if(room.participants.length >= room.limit){
                //   throw new AppError("Room is full",400)
                // }
                // if(!room.participants.some((id) => id.toString() === userId)){
                //   room.participants.push(userId as any)
                //   await room.save()
                // }
                const activeParticipants = room.participants.filter((p) => !p.lastLeave || p.lastJoin > p.lastLeave);
                console.log("active participantsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", activeParticipants);
                const isParticipant = room.participants.some((p) => p.userId.toString() === userId);
                console.log("is participantsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", isParticipant);
                console.log("active participants length", activeParticipants.length);
                console.log("limit", room.limit);
                if (!isParticipant && activeParticipants.length >= room.limit) {
                    throw new AppError_1.AppError("Room is full", 400);
                }
                const participantIndex = room.participants.findIndex((p) => p.userId.toString() === userId);
                const now = new Date();
                if (participantIndex == -1) {
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
                yield room.save();
            }
            catch (error) {
                console.log(error);
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError("failed to join call", 500);
            }
        });
    }
    leaveCall(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield RoomModel_1.Room.findById(roomId).exec();
                if (!room)
                    throw new AppError_1.AppError("Room not found", 404);
                // room.participants=room.participants.filter((id) => id.toString() !== userId)
                // await room.save()
                const participantIndex = room.participants.findIndex((p) => p.userId.toString() === userId);
                if (participantIndex === -1) {
                    throw new AppError_1.AppError("User not found in room", 404);
                }
                const particpant = room.participants[participantIndex];
                console.log("partcipant repo", particpant);
                const now = new Date();
                particpant.lastLeave = now;
                const sessionDuration = now.getTime() - particpant.lastJoin.getTime();
                particpant.totalDuration += sessionDuration;
                yield room.save();
            }
            catch (error) {
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to leave call", 500);
            }
        });
    }
    getRoomParticipants(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield RoomModel_1.Room.findById(roomId).exec();
            return room ? { participants: room.participants } : null;
        });
    }
}
exports.CallRepository = CallRepository;
