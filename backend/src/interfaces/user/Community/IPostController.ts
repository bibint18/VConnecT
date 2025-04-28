import { Request,Response,NextFunction } from "express";
export interface IPostController{
  createPost(req:Request,res:Response,next:NextFunction):Promise<void>
  deletePost(req:Request,res:Response,next:NextFunction):Promise<void>
  getCloudinarySignature(req: Request, res: Response, next: NextFunction): Promise<void>;
}