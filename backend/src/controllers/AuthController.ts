import {Request,Response} from 'express'
import { AuthService } from '../services/AuthService'
import { UserRepository } from '../repositories/userRepository'
import  {generateAccessToken} from '../utils/generateToken'
import jwt from 'jsonwebtoken'
import { access } from 'fs'
import { IUser, User } from '../models/User'
import bcrypt from 'bcryptjs'
const authService = new AuthService(new UserRepository())

export const login =async (req:Request,res:Response): Promise<void> => {
  try {
    console.log("reached login backend",req.body)
    const { email, password } = req.body;
    if(password){
      console.log("data check password",password,password.length)
    }
    const { accessToken, refreshToken, user } = await authService.login(email,password, false);
    console.log("access and refresh tookens ",accessToken,refreshToken)
    // res.cookie("accessToken", accessToken, { httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: "Login successful",accessToken, user });
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
}
export const userLogout = async (req:Request,res:Response) => {
  res.clearCookie('accessToken')
  res.status(200).json({message:"user logged out"})
}


export const refresh = async(req:Request,res:Response) => {
  try {
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
      res.status(403).json({message:"NO refresh token provided"})
    }
    if(refreshToken){
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    // const accessToken = generateAccessToken(decoded);
    const accessToken = generateAccessToken({_id:decoded.id,isAdmin:decoded.isAdmin})
    console.log("accessToken",accessToken)
    // res.cookie("accessToken", accessToken, { httpOnly: true });
    res.json({ accessToken });
    }else{
      res.status(403).json({message:"No token in cookie"})
    }
  } catch {
    res.sendStatus(403);
  }
}

export const LoginAdmin = async(req:Request,res:Response) => {
  try {
    console.log("reached admin backend")
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password, true);
    
    // res.cookie("accessTokenAdmin", accessToken, { httpOnly: true });
    // res.cookie("refreshTokenAdmin", refreshToken, { httpOnly: true });
    res.cookie('refreshTokenAdmin', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: "Admin login successful",accessToken, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
  } else {
      res.status(400).json({ message: "An unknown error occurred" });
  }
  }
}

export const adminLogout = async (req:Request,res:Response) => {
  res.clearCookie("accessTokenAdmin"); 
  res.status(200).json({ message: "Logged out successfully" });
}





export const signup = async (req:Request,res:Response) => {
  try {
    const {name,email,password} = req.body;
    console.log("signup details",req.body,password.length)
    const response = await authService.singup(name,email,password)
    res.json(response)
  } catch (error:any) {
    res.status(400).json({message:error.message})
  }
}

export const verifyOTP = async (req:Request,res:Response) => {
  try {
    console.log("its here")
    console.log("verofy: ",req.body)
    
    const {email,otp,name,password} = req.body;
    const response = await authService.verifyOTP(email,otp,name,password)
    res.json(response)
  } catch (error:any) {
    res.status(400).json({message:error.message})
  }
}

export const ResendOtp =async (req:Request,res:Response) => {
  try {
    const {email} = req.body
    const response = await authService.resendOTP(email)
    console.log("data passed from controller")
  } catch (error:any) {
    res.status(400).json({message:error.message})
  }
}

export const getAbout = async (req:Request,res:Response) => {
  try {
    console.log(req.user)
    const name = User.findById(req.user?.id)
    console.log("from getAbout: ",name)
  } catch (error) {
    console.log(error)
  }
}