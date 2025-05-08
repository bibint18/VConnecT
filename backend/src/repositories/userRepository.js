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
exports.UserRepository = void 0;
const User_1 = require("../models/User");
const OtpModel_1 = require("../models/OtpModel");
const RoomModel_1 = require("../models/RoomModel");
class UserRepository {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached create user reposiory");
            return yield new User_1.User(data).save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findById(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findOne({ email });
        });
    }
    updateOtp(email, otp, otpExpiry) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("otpExpiry: ", otpExpiry);
            yield OtpModel_1.OtpVerification.findOneAndUpdate({ email }, { otp, expiresAt: otpExpiry }, { upsert: true, new: true });
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            if (!user || user.otp !== otp || !user.otpExpiry || new Date() > user.otpExpiry)
                return null;
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;
            yield user.save();
            return user;
        });
    }
    updateUser(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached updateUser repository", email, updateData);
            return yield User_1.User.findOneAndUpdate({ email }, updateData, { new: true });
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userName = yield User_1.User.findOne({ username }).exec();
                return userName;
            }
            catch (error) {
                console.log('error finding user by username', error);
                throw Error;
            }
        });
    }
    updateRoomLimit(userId, increment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(userId, { $inc: { availableRoomLimit: increment } }, { new: true });
        });
    }
    addClaimedReward(userId, rewardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(userId, { $push: { claimedRewards: { rewardId, claimedAt: new Date() } } }, { new: true });
        });
    }
    updatePoints(userId, points) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(userId, { $inc: { point: points } }, { new: true });
        });
    }
    updateStreak(userId, streak, lastUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(userId, { streak, lastStreakUpdate: lastUpdate }, { new: true });
        });
    }
    updateUserPlans(userId, planData, roomBenefit) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.plan = user.plan.map((plan) => plan.status === 'active' ? Object.assign(Object.assign({}, plan), { status: 'expired', endDate: new Date() }) : plan);
            user.plan.push(planData);
            console.log("roomBenefit", roomBenefit);
            if (roomBenefit) {
                user.availableRoomLimit = (user.availableRoomLimit || 0) + roomBenefit;
            }
            return yield user.save();
        });
    }
    Homedata() {
        return __awaiter(this, void 0, void 0, function* () {
            const roomCount = yield RoomModel_1.Room.countDocuments();
            const userCount = yield User_1.User.countDocuments();
            return { roomCount, userCount };
        });
    }
}
exports.UserRepository = UserRepository;
