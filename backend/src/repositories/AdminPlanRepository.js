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
exports.PlansRepository = void 0;
const PlansModel_1 = require("../models/PlansModel");
class PlansRepository {
    createPlan(planData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPlan = yield PlansModel_1.Plan.findOne({ name: planData.name });
            if (existingPlan) {
                throw new Error("A plan with this name already exists");
            }
            return yield PlansModel_1.Plan.create(planData);
        });
    }
    getAllPlans(search, sort, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { isDeleted: false };
            if (search) {
                query.name = { $regex: search, $options: "i" };
            }
            let sortQuery = {};
            if (sort === "A-Z") {
                sortQuery = { name: 1 };
            }
            else if (sort === 'Z-A') {
                sortQuery = { name: -1 };
            }
            else if (sort === 'saleLowHigh') {
                sortQuery = { discountAmount: 1 };
            }
            else if (sort === 'saleHighLow') {
                sortQuery = { discountAmount: -1 };
            }
            const total = yield PlansModel_1.Plan.countDocuments(query);
            const plans = yield PlansModel_1.Plan.find(query)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit);
            return { plans, total };
        });
    }
    getPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlansModel_1.Plan.findById(planId);
        });
    }
    updatePlan(planId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updateData.name) {
                const existingPlan = yield PlansModel_1.Plan.findOne({ name: updateData.name, _id: { $ne: planId } });
                if (existingPlan) {
                    throw new Error("A plan with this name already exists.");
                }
            }
            return yield PlansModel_1.Plan.findByIdAndUpdate(planId, updateData, { new: true });
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield PlansModel_1.Plan.findByIdAndUpdate(planId, { isDeleted: true });
            return plan !== null;
        });
    }
}
exports.PlansRepository = PlansRepository;
