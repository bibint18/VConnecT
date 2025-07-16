import mongoose , {Schema, Types} from "mongoose";
export interface TriviaData {
  question: string;
  options: string[];
  correctAnswer: string;
}
export interface IDailyTrivia{
  _id:Types.ObjectId;
  question:string;
  setNumber:number;
  options:string[];
  correctAnswer:string;
  isListed:boolean;
  isDeleted:boolean;
  createdAt:Date;
}
const DailyTriviaSchema :Schema = new Schema<IDailyTrivia>({
  question:{type:String,required:true},
  setNumber:{type:Number,required:true},
  options:{type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, "Exactly 4 options are required"],},
  correctAnswer:{type:String},
  isListed:{type:Boolean,default:false},
  isDeleted:{type:Boolean,default:false},
  createdAt:{type:Date,default:Date.now}
})

export const DailyTrivia = mongoose.model<IDailyTrivia>('Dailytrivia',DailyTriviaSchema)