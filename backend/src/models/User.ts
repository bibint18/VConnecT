import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
  _id:string
  name:string,
  email:string,
  password:string,
  otp?:string,
  otpExpiry?:Date,
  isVerified:boolean
  isAdmin:boolean
  failedLoginAttempts: number;
  lockUntil: Date | null;
  plan:string;
  isDeleted:boolean;
  isBlocked:boolean;
  googleId?:string;
  mobile?: string;
  username?: string;
  country?: string;
  description?: string;
  gender?: string;
}

const userSchema = new Schema <IUser> ({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,default:''},
  otp:String,
  otpExpiry:Date,
  isVerified:{type:Boolean,default:false},
  isAdmin:{type:Boolean,default:false},
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  plan:{type:String,default:"BASIC"},
  isDeleted:{type:Boolean,default:false},
  isBlocked:{type:Boolean,default:false},
  googleId:{type:String,sparse:true},
  mobile:{type:String} ,
  username: {type:String},
  country: {type:String},
  description: {type:String},
  gender:{type:String}
})

export const User = mongoose.model<IUser>("User",userSchema)