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
exports.RoomService = void 0;
const uuid_1 = require("uuid");
class RoomService {
    constructor(RoomRepo) {
        this.roomRepository = RoomRepo;
    }
    createRoom(roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (roomData.type === 'PRIVATE') {
                roomData.secretCode = (0, uuid_1.v4)().slice(0, 8);
            }
            const updatedRoom = yield this.roomRepository.createRoom(roomData);
            return updatedRoom;
        });
    }
    getAllRooms(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 10, search, type) {
            const result = yield this.roomRepository.getAllRooms(userId, page, limit, search, type);
            return result;
        });
    }
    joinRoom(RoomId, userId, secretCode) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("serice layer room", RoomId, userId, secretCode);
            const room = yield this.roomRepository.joinRoom(RoomId, userId, secretCode);
            console.log("room", room);
            return room;
        });
    }
}
exports.RoomService = RoomService;
