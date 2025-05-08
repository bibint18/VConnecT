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
exports.DirectCallRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CallModel_1 = require("../../../models/CallModel");
const AppError_1 = require("../../../utils/AppError");
class DirectCallRepository {
    createCall(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const call = new CallModel_1.Call({
                    callerId: new mongoose_1.default.Types.ObjectId(input.callerId),
                    receiverId: new mongoose_1.default.Types.ObjectId(input.receiverId),
                    callId: input.callId,
                    startTime: input.startTime,
                    status: input.status,
                });
                yield call.save();
                return call;
            }
            catch (error) {
                console.error("Error creating call:", error);
                throw new AppError_1.AppError("Failed to create call", 500);
            }
        });
    }
    getCallById(callId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield CallModel_1.Call.findOne({ callId }).exec();
            }
            catch (error) {
                console.error("Error fetching call:", error);
                throw new AppError_1.AppError("Failed to fetch call", 500);
            }
        });
    }
    updateCallStatus(callId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const call = yield CallModel_1.Call.findOne({ callId }).exec();
                if (!call) {
                    throw new AppError_1.AppError("Call not found", 404);
                }
                call.status = status;
                if (status === "COMPLETED") {
                    call.endTime = new Date();
                }
                yield call.save();
            }
            catch (error) {
                console.error("Error updating call status:", error);
                throw new AppError_1.AppError("Failed to update call status", 500);
            }
        });
    }
    endCall(callId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const call = yield CallModel_1.Call.findOne({ callId }).exec();
                if (!call) {
                    throw new AppError_1.AppError("Call not found", 404);
                }
                if (call.status !== "ACCEPTED") {
                    throw new AppError_1.AppError("Call is not active", 400);
                }
                call.status = "COMPLETED";
                call.endTime = new Date();
                yield call.save();
            }
            catch (error) {
                console.error("Error ending call:", error);
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to end call", 500);
            }
        });
    }
}
exports.DirectCallRepository = DirectCallRepository;
