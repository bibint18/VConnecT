import {Request,Response} from 'express'
import { AuthService } from '../services/AuthService'
import { UserRepository } from '../repositories/userRepository'

const authService = new AuthService(new UserRepository())

export const signup = async (req:Request,res:Response) => {
  try {
    const {name,email,password} = req.body;
    const response = await authService.singup(name,email,password)
    res.json(response)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}

export const verifyOTP = async (req:Request,res:Response) => {
  try {
    const {email,otp} = req.body;
    const response = await authService.verifyOTP(email,otp)
    res.json(response)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}