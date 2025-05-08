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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = process.env.PAYPAL_MODE === "sandbox" ? new checkout_server_sdk_1.default.core.SandboxEnvironment(clientId, clientSecret) : new checkout_server_sdk_1.default.core.LiveEnvironment(clientId, clientSecret);
const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
class PaymentService {
    constructor(planRepository) {
        this.planRepository = planRepository;
    }
    createPayment(userId, planId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const plann = yield this.planRepository.findActivePlans();
            console.log("plans from oayment service", plann);
            const plan = plann.find((p) => p._id.toString() === planId);
            if (!plan)
                throw new Error("Plan not found");
            if (plan.discountAmount !== amount) {
                throw new Error("Invalid amount");
            }
            const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: amount.toFixed(2)
                        },
                        description: `Purchase of ${plan.name}`
                    },
                ],
                application_context: {
                    return_url: `http://localhost:3000/api/auth/payments/execute?userId=${userId}&planId=${planId}`,
                    cancel_url: "http://localhost:5173/pricing",
                }
            });
            const response = yield client.execute(request);
            const approvalUrl = (_a = response.result.links.find((link) => link.rel === 'approve')) === null || _a === void 0 ? void 0 : _a.href;
            if (!approvalUrl) {
                throw new Error("No approval URL found");
            }
            return { approvalUrl, paymentId: response.result.id };
        });
    }
    executePayment(paymentId, payerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(paymentId);
            const response = yield client.execute(request);
            if (response.result.status !== "COMPLETED") {
                throw new Error("Payment not completed");
            }
            const transactionId = response.result.purchase_units[0].payments.captures[0].id;
            return { transactionId };
        });
    }
}
exports.PaymentService = PaymentService;
