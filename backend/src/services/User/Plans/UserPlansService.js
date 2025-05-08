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
exports.UserPlanService = void 0;
const mongoose_1 = require("mongoose");
class UserPlanService {
    constructor(planRepository, userRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }
    getActivePlans() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.findActivePlans();
        });
    }
    updateUserPlan(userId, planId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user)
                    throw new Error("User not found");
                const plan = yield this.planRepository.findActivePlans();
                const selectedPlan = plan.find((p) => p._id.toString() === planId);
                if (!selectedPlan)
                    throw new Error("Plan not found");
                console.log("Selected plan:", selectedPlan); // Should show roomBenefit: 4
                console.log("roomBenefit:", selectedPlan.roomBenefit); // Debug: Confirm undefined
                console.log("selectedPlan type:", Object.getPrototypeOf(selectedPlan));
                const durationMap = {
                    "1 month": 30,
                    "3 months": 90,
                    "6 months": 180,
                    "9 months": 270,
                    "12 months": 365
                };
                // const durationDays = selectedPlan.duration === "Year" ? 365 : 30; 
                const durationDays = durationMap[selectedPlan.duration];
                if (!durationDays) {
                    throw new Error(`Invalid duration: ${selectedPlan.duration}`);
                }
                const startDate = new Date();
                const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
                // await this.userRepository.updateRoomLimit(userId,selectedPlan.roomBenifit)
                const roomBenefit = selectedPlan.roomBenefit;
                console.log("roomBenefit serrice", roomBenefit);
                const planUpdate = {
                    planId: new mongoose_1.Types.ObjectId(selectedPlan._id),
                    planName: selectedPlan.name,
                    status: "active",
                    startDate,
                    endDate,
                    transactionId,
                };
                console.log("user plans updating data", planUpdate);
                return yield this.userRepository.updateUserPlans(userId, planUpdate, roomBenefit);
            }
            catch (error) {
                throw new Error(`Service error ${error}`);
            }
        });
    }
    getUserPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const activePlan = user.plan.filter((p) => p.status === 'active').sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
            if (!activePlan) {
                return null;
            }
            return {
                planId: activePlan.planId.toString(),
                planName: activePlan.planName,
                status: activePlan.status,
                startDate: activePlan.startDate,
                endDate: activePlan.endDate,
                transactionId: activePlan.transactionId,
                roomBenefit: user.availableRoomLimit || 0,
            };
        });
    }
}
exports.UserPlanService = UserPlanService;
