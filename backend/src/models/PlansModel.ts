
import mongoose,{Schema,Document} from 'mongoose'

export interface IPlan extends Document{
  name:string;
  type:string
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: string;
  createdAt: Date;
}

const PlanSchema:Schema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  regularAmount: { type: Number, required: true },
  discountAmount: { type: Number, required: true, unique: true },
  benefits: { type: [String], required: true },
  isListed: { type: Boolean, default: true },
  duration: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
})

export const Plan = mongoose.model<IPlan>('Plan',PlanSchema)