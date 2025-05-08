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
exports.FriendCallRepository = void 0;
const CallModel_1 = require("../../../models/CallModel");
const mongoose_1 = __importDefault(require("mongoose"));
class FriendCallRepository {
    createCall(call) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCall = new CallModel_1.Call({
                callerId: new mongoose_1.default.Types.ObjectId(call.callerId),
                receiverId: new mongoose_1.default.Types.ObjectId(call.receiverId),
                callId: call.callId,
                startTime: call.startTime,
                endTime: call.endTime,
                status: call.status,
            });
            return yield newCall.save();
        });
    }
    findCallById(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CallModel_1.Call.findOne({ callId });
        });
    }
    updateCall(callId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CallModel_1.Call.findOneAndUpdate({ callId }, updates, { new: true });
        });
    }
}
exports.FriendCallRepository = FriendCallRepository;
