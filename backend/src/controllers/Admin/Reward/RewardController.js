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
exports.AdminRewardController = void 0;
class AdminRewardController {
    constructor(adminRewardService) {
        this.adminRewardService = adminRewardService;
    }
    createReward(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const reward = yield this.adminRewardService.createReward(req.body, userId);
                res.status(200).json({ success: true, data: reward });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReward(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const reward = yield this.adminRewardService.updateReward(req.params.rewardId, req.body, userId);
                res.status(200).json({ success: true, data: reward });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteReward(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                yield this.adminRewardService.deleteReward(req.params.rewardId, userId);
                res.status(200).json({ success: true, message: "Reward deleted" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getRewards(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '' } = req.query;
                const result = yield this.adminRewardService.getRewards(Number(page), Number(limit), String(search));
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getRewardById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rewardId } = req.query;
                console.log("rewardId", rewardId);
                const result = yield this.adminRewardService.findRewardById(String(rewardId));
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminRewardController = AdminRewardController;
