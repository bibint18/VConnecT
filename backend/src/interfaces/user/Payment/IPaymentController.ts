import { Request,Response,NextFunction } from "express"
export interface IpaymentController{
  createPayment(req:Request,res:Response,next:NextFunction):Promise<void>
  executePayment(req:Request,res:Response,next:NextFunction):Promise<void>
}