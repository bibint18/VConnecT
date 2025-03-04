import { IUserRepository } from "../interfaces/IUserRepository";
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { IUser } from "../models/User";
import bcrypt from 'bcryptjs'
import { OtpVerification } from "../models/OtpModel";
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
    const otpExpiry= new Date(Date.now() + 10 * 60 * 1000)
    await OtpVerification.updateOne(
      { email },
      { email, otp, expiresAt: otpExpiry },
      { upsert: true } 
    );
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

  // async verifyOTP(email:string,otp:string,name:string,password:string){
  //   console.log("here")
  //   const otpRecord = await OtpVerification.findOne({email})
  //   console.log('otpRecord',otpRecord)
  //   if(!otpRecord){
  //     console.log('!otp')
  //     throw new Error("OTP expired or invalid. Please request a new one.")
  //   }
  //   if (otpRecord.otp !== otp) {
  //     throw new Error("Incorrect OTP.");
  //   }
  //   if (new Date() > otpRecord.expiresAt) {
  //     throw new Error("OTP has expired. Request a new one.");
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   console.log("password hashed")
  //   const newUser = await this.userRepository.createUser({ name, email, password: hashedPassword, isVerified: true });
  //   await OtpVerification.deleteOne({ email });
  //   return { message: "Signup successful", user: newUser };
  // }

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
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed:", hashedPassword);

    const newUser = await this.userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        isVerified: true
    });

    console.log("User created successfully:", newUser);

    await OtpVerification.deleteOne({ email });

    return { message: "Signup successful", user: newUser };
}

}