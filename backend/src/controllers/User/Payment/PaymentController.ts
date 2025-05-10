import { Request,Response,NextFunction } from "express";
import { IPaymentService } from "../../../interfaces/user/Payment/IPaymentService.js";
import { UserIPlanService } from "../../../interfaces/user/Plans/UserIplansService.js";
import { IpaymentController } from "../../../interfaces/user/Payment/IPaymentController.js";

export class PaymentController implements IpaymentController{
  private paymentService:IPaymentService;
  private userPlanService:UserIPlanService
  constructor(paymentService:IPaymentService,userPlanService:UserIPlanService){
    this.paymentService=paymentService;
    this.userPlanService=userPlanService
  }
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {userId,planId,amount} = req.body;
      console.log("data from payment controller ",userId,planId,amount)
      if (!userId || !planId || !amount){
        throw new Error("Missing required fields");
      } 
      const {approvalUrl,paymentId} = await this.paymentService.createPayment(userId,planId,amount)
      res.status(200).json({ success: true, data: { approvalUrl, paymentId }, message: "Payment initiated" });
    } catch (error) {
      next(error)
    }
  }

  async executePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("req.query",req.query)
      const {token:paymentId,PayerID:payerId} = req.query
      const {userId,planId} = req.query
      console.log('data from execute payment controller ',paymentId,payerId,userId,planId)
      if (!paymentId || !payerId || !userId || !planId) throw new Error("Missing required query parameters");
      const {transactionId} = await this.paymentService.executePayment(paymentId as string,payerId as string)
      console.log("transactionid",transactionId)
      await this.userPlanService.updateUserPlan(userId as string,planId as string,transactionId)
      res.redirect(`${process.env.FRONTEND_URL}/pricing/success`)
    } catch (error) {
      next(error)
    }
  }
}