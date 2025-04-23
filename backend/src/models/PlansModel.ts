
import mongoose,{Schema,Document} from 'mongoose'

export interface IPlan extends Document{
  _id:string
  name:string;
  type:"paid" | "free";
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: '1 month' | '3 months' | '6 months' | '9 months' | '12 months';
  createdAt: Date;
  isDeleted:boolean;
  roomBenefit:number;
}

const PlanSchema:Schema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: {
      values: ['paid', 'free'],
      message: '{VALUE} is not a valid type'
    }, 
    required: false 
  },
  description: { type: String, required: true },
  regularAmount: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
  benefits: { type: [String], required: true },
  isListed: { type: Boolean, default: true },
  duration: { 
    type: String, 
    enum: {
      values: ['1 month', '3 months', '6 months', '9 months', '12 months'],
      message: '{VALUE} is not a valid duration'
    }, 
    required: false 
  },
  createdAt: { type: Date, default: Date.now },
  isDeleted:{type:Boolean,default:false},
  roomBenefit: { 
    type: Number, required: [false, 'Room benefit is required'], min: [0, 'Room benefit cannot be negative'], max: [20, 'Room benefit cannot exceed 20'] 
  }
})

export const Plan = mongoose.model<IPlan>('Plan',PlanSchema)