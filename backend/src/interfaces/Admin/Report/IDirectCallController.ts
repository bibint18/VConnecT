
import { Request,Response,NextFunction } from "express"
export interface IDirectCallController{
getCallDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
}