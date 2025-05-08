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
exports.AdminPlansController = void 0;
const AdminPlanService_1 = require("../services/AdminPlanService");
const AdminPlanRepository_1 = require("../repositories/AdminPlanRepository");
const planService = new AdminPlanService_1.PlanService(new AdminPlanRepository_1.PlansRepository());
class AdminPlansController {
    constructor(adminPlanService) {
        this.adminPlanService = adminPlanService;
    }
    createPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached backend plan create body: ", req.body);
                const plan = yield planService.createPlan(req.body);
                res.status(200).json(plan);
            }
            catch (error) {
                console.log(error);
                if (error.message === "A plan with this name already exists") {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: "Internal Server Error" });
                }
            }
        });
    }
    getAllPlans(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached backend fetch plans", req.query);
                const { search, sort, page = 1, limit = 4 } = req.query;
                const { plans, total } = yield planService.gettAllPlans(String(search), String(sort), Number(page), Number(limit));
                res.status(200).json({ plans, total });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPlanById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const plan = yield planService.getPlanById(id);
                res.status(200).json(plan);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached edit backend");
                const { id } = req.params;
                const updateData = req.body;
                const updatePlan = yield planService.updatePlan(id, updateData);
                res.status(200).json(updatePlan);
            }
            catch (error) {
                console.log(error);
                if (error.message === "A plan with this name already exists.") {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Failed to edit plan" });
                }
            }
        });
    }
    deletePlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const plan = yield planService.deletePlan(id);
                res.status(200).json(plan);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminPlansController = AdminPlansController;
exports.default = new AdminPlansController(new AdminPlanService_1.PlanService(new AdminPlanRepository_1.PlansRepository()));
