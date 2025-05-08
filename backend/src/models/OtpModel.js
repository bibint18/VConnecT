"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpVerification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpVerificationSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});
exports.OtpVerification = mongoose_1.default.model("OtpVerification", otpVerificationSchema);
