import { IPaymentService } from "../../../interfaces/user/Payment/IPaymentService.js";
import paypal from '@paypal/checkout-server-sdk'

import { IUserPlanRepository } from "../../../interfaces/user/Plans/UserIPlanRepository.js";

const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const environment = process.env.PAYPAL_MODE === "sandbox" ? new paypal.core.SandboxEnvironment(clientId, clientSecret) : new paypal.core.LiveEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export class PaymentService implements IPaymentService{
  private planRepository:IUserPlanRepository
  constructor(planRepository:IUserPlanRepository){
    this.planRepository=planRepository
  }

  async createPayment(userId: string, planId: string, amount: number): Promise<{ approvalUrl: string; paymentId: string; }> {
    const plann = await this.planRepository.findActivePlans()
    console.log("plans from oayment service",plann)
    const plan = plann.find((p) => p._id.toString() === planId)
    if (!plan) throw new Error("Plan not found");
    if(plan.discountAmount !== amount) {
      throw new Error("Invalid amount")
    }
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent:"CAPTURE",
      purchase_units:[
        {
          amount:{
            currency_code:"USD",
            value:amount.toFixed(2)
          },
          description:`Purchase of ${plan.name}`
        },
      ],
      application_context:{
        return_url: `https://vconnect.bibin.online/api/auth/payments/execute?userId=${userId}&planId=${planId}`,
        cancel_url: "https://vconnect.app.bibin.online/pricing",
      }
    })
    const response = await client.execute(request);
    const approvalUrl = response.result.links.find((link:any) => link.rel ==='approve')?.href;
    if(!approvalUrl){
      throw new Error("No approval URL found")
    }
    return {approvalUrl,paymentId:response.result.id}
  }

  async executePayment(paymentId: string, payerId: string): Promise<{ transactionId: string; }> {
    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    const response = await client.execute(request)
    if(response.result.status !== "COMPLETED"){
      throw new Error("Payment not completed")
    }
    const transactionId = response.result.purchase_units[0].payments.captures[0].id
    return {transactionId}
  }
}