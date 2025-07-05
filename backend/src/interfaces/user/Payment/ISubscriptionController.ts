import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController{
  saveSubscription(req: Request, res: Response, next: NextFunction): Promise<void>
}