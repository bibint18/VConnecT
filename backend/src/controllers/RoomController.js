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
exports.RoomController = void 0;
const RoomService_1 = require("../services/RoomService");
const RoomsRepository_1 = require("../repositories/RoomsRepository");
class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    createRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const now = new Date();
                console.log(userId);
                const roomData = {
                    title: req.body.title,
                    limit: req.body.limit,
                    premium: req.body.premium === 'Yes',
                    type: req.body.type,
                    description: req.body.description,
                    createdBy: userId,
                    participants: [{
                            userId: userId,
                            firstJoin: now,
                            lastJoin: now,
                            lastLeave: null,
                            totalDuration: 0
                        }],
                    isDeleted: false,
                    isBlocked: false
                };
                const newRoom = yield this.roomService.createRoom(roomData);
                res.status(200).json({ room: newRoom });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllRooms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { search, type, page = "1", limit = "10" } = req.query;
                console.log("getRooms", search, type);
                const { rooms, user, total } = yield this.roomService.getAllRooms(userId, parseInt(page, 10), parseInt(limit, 10), search, type);
                res.status(200).json({ rooms, user, total });
            }
            catch (error) {
                next(error);
            }
        });
    }
    joinRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached join room controller ");
                const userId = req.user.id;
                const { roomId, secretCode } = req.body;
                console.log('backend join room controller', roomId, secretCode, userId);
                if (!roomId) {
                    throw new Error("Room id is required");
                }
                const updatedRoom = yield this.roomService.joinRoom(roomId, userId, secretCode);
                console.log("updatedRoom controller", updatedRoom);
                res.status(200).json({ room: updatedRoom, message: "Joined room successfully!" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.RoomController = RoomController;
exports.default = new RoomController(new RoomService_1.RoomService(new RoomsRepository_1.RoomRepository()));
