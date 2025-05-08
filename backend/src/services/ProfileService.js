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
exports.ProfileService = void 0;
const AppError_1 = require("../utils/AppError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ProfileService {
    constructor(profileRepo) {
        this.profileRepository = profileRepo;
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.profileRepository.findById(userId);
            if (!user)
                throw new AppError_1.AppError("user not found", 403);
            return user;
        });
    }
    updateUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.profileRepository.updateProfile(userId, data);
            if (!updatedUser)
                throw new AppError_1.AppError("Failed to update User", 500);
            return updatedUser;
        });
    }
    updateProfileImage(userId, imageurl) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached profile image service", userId, imageurl);
            const updatedUser = yield this.profileRepository.updateProfile(userId, { profileImage: imageurl });
            if (!updatedUser)
                throw new AppError_1.AppError("failed to update profile image", 500);
            return updatedUser;
        });
    }
    updateStreak(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.profileRepository.updateStreak(id);
            if (!updatedUser)
                throw new AppError_1.AppError("Failed to update streak", 500);
            return updatedUser;
        });
    }
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.profileRepository.findById(userId);
            if (!user)
                throw new AppError_1.AppError("User not found", 404);
            if (!user.password) {
                throw new AppError_1.AppError("No password set for this account. Use password reset.", 400);
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error("Current password is incorrect");
            }
            if (newPassword.length < 8) {
                throw new AppError_1.AppError("New password must be at least 8 characters long", 400);
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            const updatedUser = yield this.profileRepository.updateProfile(userId, { password: hashedPassword });
            if (!updatedUser)
                throw new AppError_1.AppError("Failed to update password", 500);
            return updatedUser;
        });
    }
}
exports.ProfileService = ProfileService;
