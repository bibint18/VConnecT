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
exports.ProfileController = void 0;
const ProfileService_1 = require("../services/ProfileService");
const ProfileRepository_1 = require("../repositories/ProfileRepository");
const cloudinary_1 = __importDefault(require("cloudinary"));
const AppError_1 = require("../utils/AppError");
const profileService = new ProfileService_1.ProfileService(new ProfileRepository_1.ProfileRepository());
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached backend fetch profile");
                const userId = req.user.id;
                const user = yield profileService.getUserProfile(userId);
                console.log("user passed from backend", user);
                res.json({ user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const profileData = req.body;
                const updatedUser = yield profileService.updateUserProfile(id, profileData);
                res.status(200).json({ user: updatedUser, message: "Profile updated" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCloudinarySignature(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Math.round(new Date().getTime() / 1000);
                const paramsToSign = {
                    timestamp: timestamp,
                    folder: 'profile_images',
                    source: 'uw',
                };
                const signature = cloudinary_1.default.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
                res.json({ signature, timestamp });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getChatCloudinarySignature(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Math.round(new Date().getTime() / 1000);
                const paramsToSign = {
                    timestamp: timestamp,
                    folder: 'chat_media'
                    // source: 'uw',
                    // resource_type: 'auto' 
                };
                console.log("Signing parameters:", paramsToSign);
                const signature = cloudinary_1.default.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
                console.log("Generated signature:", signature);
                res.json({ signature, timestamp });
            }
            catch (error) {
                console.error("Signature generation error:", error);
                next(error);
            }
        });
    }
    updateProfileImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("backend update Profile image");
                const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { imageUrl } = req.body;
                if (imageUrl && typeof imageUrl != 'string') {
                    throw new AppError_1.AppError("Invalid Image Type", 400);
                }
                console.log("datas ", id, imageUrl);
                const updatedUser = yield profileService.updateProfileImage(id, imageUrl);
                console.log("updated profile picture user ", updatedUser);
                res.status(200).json({ user: updatedUser, message: "Profile picture updated" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateStreak(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached backend streak");
                const userId = req.user.id;
                const updatedUser = yield profileService.updateStreak(userId);
                console.log(updatedUser);
                res.status(200).json({ user: updatedUser, message: "Streaks updated" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("reached here");
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { currentPassword, newPassword } = req.body;
                if (!currentPassword || !newPassword) {
                    throw new AppError_1.AppError("Current and new passwords are required", 400);
                }
                const updatedUser = yield profileService.changePassword(userId, currentPassword, newPassword);
                res.status(200).json({ user: updatedUser, message: "Password updated successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProfileController = ProfileController;
exports.default = new ProfileController(new ProfileService_1.ProfileService(new ProfileRepository_1.ProfileRepository()));
