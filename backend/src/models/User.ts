import mongoose,{Document,Schema, Types} from "mongoose";

export interface IUser extends Document{
  _id:string
  name:string,
  email:string,
  password:string,
  profileImage?:string,
  otp?:string,
  otpExpiry?:Date,
  isVerified:boolean
  isAdmin:boolean
  failedLoginAttempts: number;
  lockUntil: Date | null;
  plan:{
    planId:Types.ObjectId;
    planName:string;
    status:"active" | 'expired' | 'cancelled';
    startDate:Date;
    endDate?:Date;
    transactionId?:string;
    roomBenefit?:number;
  }[];
  isDeleted:boolean;
  isBlocked:boolean;
  googleId?:string;
  mobile?: string;
  username?: string;
  country?: string;
  description?: string;
  gender?: string;
  streak:number;
  point:number;
  lastStreakUpdate:Date;
  friends: Types.ObjectId[];
  availableRoomLimit: number; 
  claimedRewards: { rewardId: string; claimedAt: Date }[];
}

const userSchema = new Schema <IUser> ({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,default:''},
  profileImage:{type:String},
  otp:String,
  otpExpiry:Date,
  isVerified:{type:Boolean,default:false},
  isAdmin:{type:Boolean,default:false},
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  plan:[{
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
        planName: { type: String, required: true },
        status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        transactionId: { type: String },
  }],
  isDeleted:{type:Boolean,default:false},
  isBlocked:{type:Boolean,default:false},
  googleId:{type:String,sparse:true},
  mobile:{type:String} ,
  username: {type:String,unique:true},
  country: {type:String},
  description: {type:String},
  gender:{type:String},
  streak:{type:Number,default:0},
  point:{type:Number,default:0},
  lastStreakUpdate:{type:Date,default:null},
  friends:[{type:Schema.Types.ObjectId,ref:"User"}],
  availableRoomLimit: { type: Number, default: 1 },
  claimedRewards: [
    {
      rewardId: { type: String, required: true },
      claimedAt: { type: Date, required: true },
    },
  ],
},
{ timestamps: true }
)

export const User = mongoose.model<IUser>("User",userSchema)