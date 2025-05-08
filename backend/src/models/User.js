"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    profileImage: { type: String },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    plan: [{
            planId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Plan", required: true },
            planName: { type: String, required: true },
            status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
            startDate: { type: Date, required: true },
            endDate: { type: Date },
            transactionId: { type: String },
        }],
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    googleId: { type: String, sparse: true },
    mobile: { type: String },
    username: { type: String, unique: true },
    country: { type: String },
    description: { type: String },
    gender: { type: String },
    streak: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    lastStreakUpdate: { type: Date, default: null },
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    availableRoomLimit: { type: Number, default: 1 },
    claimedRewards: [
        {
            rewardId: { type: String, required: true },
            claimedAt: { type: Date, required: true },
        },
    ],
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
