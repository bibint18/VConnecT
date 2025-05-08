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
exports.AdminRoomRepository = void 0;
const RoomModel_1 = require("../models/RoomModel");
const AppError_1 = require("../utils/AppError");
class AdminRoomRepository {
    getAllRooms(page, limit, searchTerm, sortOption) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached repo admin room", page, limit, searchTerm, sortOption);
            const query = {};
            if (searchTerm) {
                query.title = { $regex: searchTerm, $options: 'i' };
            }
            let sortQuery = {};
            if (sortOption === 'public') {
                query.type = 'PUBLIC';
                sortQuery = { title: 1 };
            }
            else if (sortOption === "private") {
                query.type = "PRIVATE";
                sortQuery = { title: 1 };
            }
            else if (sortOption === 'all') {
                sortQuery = { title: 1 };
            }
            const rooms = yield RoomModel_1.Room.find(query)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("createdBy", "name email")
                .exec();
            console.log("rooms from repo", rooms);
            return rooms;
        });
    }
    getTotalRooms(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { isDeleted: false };
            if (searchTerm) {
                query.name = { $regex: searchTerm, $options: "i" };
            }
            return yield RoomModel_1.Room.countDocuments(query);
        });
    }
    blockRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield RoomModel_1.Room.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).exec();
            if (!room)
                throw new AppError_1.AppError("Room not found", 404);
            return room;
        });
    }
    unblockRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield RoomModel_1.Room.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).exec();
            if (!room)
                throw new AppError_1.AppError("Room not found", 404);
            return room;
        });
    }
    deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield RoomModel_1.Room.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
            if (!room)
                throw new AppError_1.AppError("Room not found", 404);
            return room;
        });
    }
    getRoomDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield RoomModel_1.Room.findById(id)
                .populate('createdBy', 'name email')
                .populate('participants.userId', 'name email')
                .exec();
            if (!room)
                throw new AppError_1.AppError("Room not found", 404);
            return room;
        });
    }
}
exports.AdminRoomRepository = AdminRoomRepository;
