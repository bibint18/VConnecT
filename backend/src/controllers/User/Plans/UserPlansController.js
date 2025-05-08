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
exports.UserPlanController = void 0;
class UserPlanController {
    constructor(planService) {
        this.planService = planService;
    }
    getPlans(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plans = yield this.planService.getActivePlans();
                console.log("plans fetched ", plans);
                res.status(200).json({
                    success: true,
                    data: plans,
                    message: "Plans fetched successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("reached userPlan getting");
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                const userPlan = yield this.planService.getUserPlan(userId);
                res.status(200).json({
                    success: true,
                    data: userPlan,
                    message: "User plan fetched successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserPlanController = UserPlanController;
