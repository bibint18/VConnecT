import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
  name:string,
  email:string,
  password:string,
  otp?:string,
  otpExpiry?:Date,
  isVerified:boolean
  isAdmin:boolean
  failedLoginAttempts: number;
  lockUntil: Date | null;
}

const userSchema = new Schema <IUser> ({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  otp:String,
  otpExpiry:Date,
  isVerified:{type:Boolean,default:false},
  isAdmin:{type:Boolean,default:false},
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
})

export const User = mongoose.model<IUser>("User",userSchema)