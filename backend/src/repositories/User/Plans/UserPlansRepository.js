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
exports.UserPlanRepository = void 0;
const PlansModel_1 = require("../../../models/PlansModel");
class UserPlanRepository {
    findActivePlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield PlansModel_1.Plan.find({ isListed: true, isDeleted: false }).sort({ regularAmount: 1 });
            if (!plans) {
                throw new Error("No plans to fetch...");
            }
            return plans;
        });
    }
}
exports.UserPlanRepository = UserPlanRepository;
