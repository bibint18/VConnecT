import { Request,Response,NextFunction } from "express";
import { ProfileService } from "../services/ProfileService";
import { ProfileRepository } from "../repositories/ProfileRepository";

const profileService = new ProfileService(new ProfileRepository())

export const getProfile = async(req:Request,res:Response,next:NextFunction) => {
  try {
    console.log("reached backend fetch profile")
    const userId = (req as any).user.id
    const user = await profileService.getUserProfile(userId)
    console.log("user passed from backend",user)
    res.json({user})
  } catch (error) {
    next(error)
  }
}