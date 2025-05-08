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
exports.UserRewardRepository = void 0;
const RewardModel_1 = require("../../../models/RewardModel");
class UserRewardRepository {
    findRewardById(rewardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RewardModel_1.Reward.findOne({ rewardId, isDeleted: false, isActive: true });
        });
    }
    findAllRewards(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                isDeleted: false,
                isActive: true,
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } },
                ],
            };
            const rewards = yield RewardModel_1.Reward.find(query).skip((page - 1) * limit).limit(limit).lean();
            const total = yield RewardModel_1.Reward.countDocuments(query);
            return { rewards, total };
        });
    }
}
exports.UserRewardRepository = UserRewardRepository;
