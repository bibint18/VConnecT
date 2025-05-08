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
exports.AdminRewardService = void 0;
class AdminRewardService {
    constructor(rewardRepository) {
        this.rewardRepository = rewardRepository;
    }
    createReward(rewardData, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            rewardData.rewardId = `reward_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
            const reward = yield this.rewardRepository.createReward(rewardData);
            return reward;
        });
    }
    updateReward(rewardId, updates, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reward = yield this.rewardRepository.updateReward(rewardId, updates);
            if (!reward)
                throw new Error("Reward not found");
            return reward;
        });
    }
    deleteReward(rewardId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rewardRepository.deleteReward(rewardId);
        });
    }
    getRewards(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rewardRepository.findAllRewards(page, limit, searchTerm);
        });
    }
    findRewardById(rewardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rewardRepository.findRewardById(rewardId);
        });
    }
}
exports.AdminRewardService = AdminRewardService;
