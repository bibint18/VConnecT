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
exports.UserRewardController = void 0;
class UserRewardController {
    constructor(userRewardService) {
        this.userRewardService = userRewardService;
    }
    getUserRewards(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const rewards = yield this.userRewardService.getUserRewards((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json({ success: true, data: rewards });
            }
            catch (error) {
                next(error);
            }
        });
    }
    claimReward(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("Reached claim controller", req.params);
                const { rewardid } = req.params;
                console.log("Reached claim controller data ", rewardid);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                yield this.userRewardService.claimReward(userId, req.params.rewardid);
                res.status(200).json({ success: true, message: "Reward claimed" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRewardService.checkIn(req.user.id);
                res.status(200).json({ success: true, data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield this.userRewardService.getUserDetails(userId);
                if (!user)
                    throw new Error("User not found");
                res.status(200).json({ success: true, data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserRewardController = UserRewardController;
