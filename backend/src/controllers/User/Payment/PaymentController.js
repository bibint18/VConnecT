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
exports.PaymentController = void 0;
class PaymentController {
    constructor(paymentService, userPlanService) {
        this.paymentService = paymentService;
        this.userPlanService = userPlanService;
    }
    createPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, planId, amount } = req.body;
                console.log("data from payment controller ", userId, planId, amount);
                if (!userId || !planId || !amount) {
                    throw new Error("Missing required fields");
                }
                const { approvalUrl, paymentId } = yield this.paymentService.createPayment(userId, planId, amount);
                res.status(200).json({ success: true, data: { approvalUrl, paymentId }, message: "Payment initiated" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    executePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.query", req.query);
                const { token: paymentId, PayerID: payerId } = req.query;
                const { userId, planId } = req.query;
                console.log('data from execute payment controller ', paymentId, payerId, userId, planId);
                if (!paymentId || !payerId || !userId || !planId)
                    throw new Error("Missing required query parameters");
                const { transactionId } = yield this.paymentService.executePayment(paymentId, payerId);
                console.log("transactionid", transactionId);
                yield this.userPlanService.updateUserPlan(userId, planId, transactionId);
                res.redirect("http://localhost:5173/pricing/success");
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PaymentController = PaymentController;
