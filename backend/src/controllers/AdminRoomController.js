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
exports.AdminRoomController = void 0;
const AdminRoomService_1 = require("../services/AdminRoomService");
const AdminRoomRepository_1 = require("../repositories/AdminRoomRepository");
const roomService = new AdminRoomService_1.AdminRoomService(new AdminRoomRepository_1.AdminRoomRepository());
class AdminRoomController {
    constructor(adminRoomService) {
        this.adminRoomService = adminRoomService;
    }
    getAllRooms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('reached');
                const { page = 1, limit = 6, searchTerm = "", sortOption = "public" } = req.query;
                console.log(req.query);
                const rooms = yield roomService.getAllRooms(Number(page), Number(limit), String(searchTerm), String(sortOption));
                const totalRooms = yield roomService.getTotalRooms(String(searchTerm));
                console.log("Rooms passed from controller admin", rooms, totalRooms);
                res.status(200).json({ rooms, totalRooms });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    blockRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const room = yield roomService.blockRoom(id);
                res.status(200).json(room);
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    unblockRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const room = yield roomService.unblockRoom(id);
                res.status(200).json(room);
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    deleteRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const room = yield roomService.deleteRoom(id);
                res.status(200).json(room);
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getRoomDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const room = yield this.adminRoomService.getRoomDetails(id);
                res.status(200).json({ room });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminRoomController = AdminRoomController;
exports.default = new AdminRoomController(new AdminRoomService_1.AdminRoomService(new AdminRoomRepository_1.AdminRoomRepository()));
