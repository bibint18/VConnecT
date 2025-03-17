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

export const updateProfile = async(req:Request,res:Response,next:NextFunction) => {
try {
  const id = (req as any ).user?.id
  const profileData = req.body
  const updatedUser = await profileService.updateUserProfile(id,profileData)
  res.status(200).json({user:updatedUser,message:"Profile updated"})
} catch (error) {
  
}
}