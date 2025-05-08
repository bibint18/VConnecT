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
exports.AdminRoomService = void 0;
class AdminRoomService {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    getAllRooms(page, limit, searchTerm, sortOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield this.roomRepository.getAllRooms(page, limit, searchTerm, sortOption);
            console.log(rooms, "from service");
            return rooms;
        });
    }
    getTotalRooms(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.roomRepository.getTotalRooms(searchTerm);
        });
    }
    blockRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.roomRepository.blockRoom(id);
        });
    }
    unblockRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.roomRepository.unblockRoom(id);
        });
    }
    deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.roomRepository.deleteRoom(id);
        });
    }
    getRoomDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.roomRepository.getRoomDetails(id);
        });
    }
}
exports.AdminRoomService = AdminRoomService;
