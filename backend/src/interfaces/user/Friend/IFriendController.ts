import { Request,Response,NextFunction } from "express"
export interface IFriendController{
  getPendingRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>
  getFriends(req: Request, res: Response, next: NextFunction):Promise<void>
  
}