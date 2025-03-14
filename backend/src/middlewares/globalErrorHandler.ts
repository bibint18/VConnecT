import { Request,Response,NextFunction } from "express";

export const errorHandler = (err:any ,req:Request,res:Response,next:NextFunction) => {
  console.log("reaced error handler")
  console.error("Error occured: ",err)
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    message:err.message || "Internal server Error", ...(process.env.NODE_ENV ==='development' && {stack: err.stack}),

  }
  res.status(statusCode).json(errorResponse)
}