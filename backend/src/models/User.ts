import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
  name:String,
  email:String,
  password:String,
  otp?:String,
  otpExpiry?:String,
  isVerified:Boolean
}

const userSchema = new Schema <IUser> ({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  otp:String,
  otpExpiry:String,
  isVerified:{type:Boolean,default:false}
})

export const User = mongoose.model<IUser>("User",userSchema)