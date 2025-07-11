import { Request,Response,NextFunction} from "express";
import logger from "../utils/Logger";

export function errorLoggerMiddleware(err:any,req:Request,res:Response,next:NextFunction){
  logger.error(`Error occured`,{
    message:err.message,
    stack:err.stack,
    url:req.originalUrl,
    method:req.method,
    body:req.body
  })
  next(err)
}