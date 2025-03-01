import { IUserRepository } from "../interfaces/IUserRepository";
import nodemailer from 'nodemailer'
import crypto from "crypto"
import { User } from "../models/User";

export class AuthService {
  private userRepository:IUserRepository;
  constructor(userRepo:IUserRepository){
    this.userRepository=userRepo
  }
  async singup(name:string,email:string,password:string){
    const existingUser = await this.userRepository.findByEmail(email)
    if(!existingUser) throw new Error("Email already exist")
      await this.userRepository.createUser({name,email,password,isVerified:false} as User)
    return await this.sendOTP(email)
  }

  async sendOTP(email:string){
    const otp = crypto.randomInt(100000,999999).toString()
    const otpExpiry= new Date(Date.now() + 10 * 60 * 1000)
    await this.userRepository.updateOtp(email,otp,otpExpiry)
    const transporter= nodemailer.createTransport({
      service:"gmail",
      auth:{user:process.env.EMAIL,pass:process.env.EMAIL_PASSWORD}
    })
    await transporter.sendMail({
      from:process.env.EMAIL,
      to:email,
      subject:"Your OTP Code",
      text:`Your OTP is ${otp}. It is valid for 10 minutes.`,
    })
    return {message:"Otp sent successfully!"}
  }

  async verifyOTP(email:string,otp:string){
    const user = await this.userRepository.verifyOtp(email,otp)
    if(!user) throw new Error("Invalid or expired OTP")
      return {message:"signup successfull"}
  }
}