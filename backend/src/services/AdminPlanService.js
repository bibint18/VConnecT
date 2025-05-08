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
exports.PlanService = void 0;
class PlanService {
    constructor(planRepository) {
        this.planRepository = planRepository;
    }
    createPlan(planData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.createPlan(planData);
        });
    }
    gettAllPlans(search, sort, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.getAllPlans(search, sort, page, limit);
        });
    }
    getPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.getPlanById(planId);
        });
    }
    updatePlan(planId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached service planid", planId);
            return yield this.planRepository.updatePlan(planId, updateData);
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.planRepository.deletePlan(planId);
        });
    }
}
exports.PlanService = PlanService;
