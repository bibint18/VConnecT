import { IUserRepository } from "../interfaces/IUserRepository";
import nodemailer from 'nodemailer'
import crypto, { hash } from 'crypto'
import { IUser } from "../models/User";
import bcrypt from 'bcryptjs'
import { OtpVerification } from "../models/OtpModel";
import { generateAccessToken,generateRefreshToken } from "../utils/generateToken";
export class AuthService {
  private userRepository:IUserRepository;
  constructor(userRepo:IUserRepository){
    this.userRepository=userRepo
  }
  async singup(name:string,email:string,password:string){
    const existingUser = await this.userRepository.findByEmail(email)
    console.log("reaching here")
    console.log("existing user",existingUser)
    if(existingUser) throw new Error("Email already exist")
      // const hashedPassword = await bcrypt.hash(password,10)
      // const data = {name:name,email:email,password:hashedPassword,isVerified:false}

      // await this.userRepository.createUser(data)
      const otp = crypto.randomInt(100000,999999).toString()
      console.log("otp code ",otp)
    const otpExpiry= new Date(Date.now() + 10 * 60 * 1000)
    // await OtpVerification.updateOne(
    //   { email },
    //   { email, otp, expiresAt: otpExpiry },
    //   { upsert: true } 
    // );
    await this.userRepository.updateOtp(email,otp,otpExpiry)
    await this.sendOTP(email,otp)
    return { message: "OTP sent successfully!" };
  }

  async sendOTP(email:string,otp:string){
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

  async verifyOTP(email: string, otp: string, name: string, password: string) {
    console.log("here");
    console.log("Received data:", { email, otp, name, password });

    // Check if OTP exists
    const otpRecord = await OtpVerification.findOne({ email });
    console.log("otpRecord", otpRecord);

    if (!otpRecord) {
        console.log("OTP not found");
        throw new Error("OTP expired or invalid. Please request a new one.");
    }

    if (otpRecord.otp !== otp) {
        console.log("Incorrect OTP:", otp, "Stored OTP:", otpRecord.otp);
        throw new Error("Incorrect OTP.");
    }

    if (new Date() > otpRecord.expiresAt) {
        console.log("OTP Expired");
        throw new Error("OTP has expired. Request a new one.");
    }

    // ✅ Check if name or password is undefined
    if (!name || !password) {
        console.log("Name or password is missing", { name, password });
        throw new Error("Invalid request: Missing name or password.");
    }

    console.log("Hashing password...");
    console.log("to be hashed: ",password)
    console.log("length of psw",password.length)
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Password hashed:", hashedPassword);
    const isMatch = await bcrypt.compare(password,hashedPassword)
    console.log("Ismatch after the hashing",isMatch)
    const newUser = await this.userRepository.createUser({
        name,
        email,
        password:hashedPassword,
        isVerified: true
    });

    console.log("User created successfully:", newUser);

    await OtpVerification.deleteOne({ email });

    return { message: "Signup successful", user: newUser };
}

async resendOTP (email:string){
  const otp = crypto.randomInt(100000,999999).toString()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await this.userRepository.updateOtp(email,otp,otpExpiry)
  await this.sendOTP(email,otp)
}

async login(email:string,password:string,isAdminLogin:boolean){
  console.log("at service as last password: ",password,password.length)
  
  const user = await this.userRepository.findByEmail(email)
  if(!user) throw new Error("No user")
  if(user)console.log("Stored hashed password:", user.password);
  if(user?.isBlocked) throw new Error("User blocked")
  console.log("reached auth login,user: ",user)
  if(!user) throw new Error("Invalid credentials")
  if(isAdminLogin && !user.isAdmin) throw new Error("Unauthorized access")
  if(user.failedLoginAttempts >=3 && user.lockUntil && user.lockUntil> new Date()){
    throw new Error("account locked try again later")
  }
  const isMatch = await bcrypt.compare(password,user.password)
  console.log("ismatch: ",isMatch)
  if(!isMatch){
    await this.userRepository.updateUser(email,{
      failedLoginAttempts:user.failedLoginAttempts+1,
      lockUntil:user.failedLoginAttempts + 2 >=3 ? new Date(Date.now() + 10 * 60 * 1000): null
    })
    throw new Error("Invalid credentials")
  }
  await this.userRepository.updateUser(email,{failedLoginAttempts:0,lockUntil:null})
  const accessToken = generateAccessToken(user)
  console.log("service avcess token",accessToken)
  const refreshToken = generateRefreshToken(user)
  return {accessToken,refreshToken,user}
}

}