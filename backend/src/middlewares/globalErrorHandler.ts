import { Request,Response,NextFunction } from "express";

const globalErrorHandler = (err:Error,req:Request,res:Response,next:NextFunction):void => {
  console.error(err.stack)
  res.status(500).json({
    message:"Something went wrong!",
    error:process.env.NODE_ENV ==='develeopment' ? err.message :"Internal server Error"
  })
}

export default globalErrorHandler