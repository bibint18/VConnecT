import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export interface IPlan{
  _id: string;
  name: string;
  type: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: string;
  createdAt: Date;
  isDeleted: boolean;
  color: string;
  isPopular: boolean;
}

export interface IUserPlan {
  planId: string;
  planName: string;
  status: string;
  startDate: Date;
  endDate?: Date; 
  transactionId?: string; 
  roomBenefit: number;
}

export class PlanService{
  async getPlans():Promise<IPlan[]>{
    try {
      const response = await axiosInstance.get('/plans')
      console.log('plans from plans serrvice response ',response)
      const plans: IPlan[] = response.data.data
        .filter((plan: IPlan) => plan.isListed && !plan.isDeleted)
        .map((plan: IPlan, index: number, array: IPlan[]) => ({
          ...plan,
          id: plan._id ,
          color: plan.isPopular ? "bg-purple-600/50" : "from-purple-600 to-purple-900",
          isPopular: index === array.length - 1, // Mark the last plan (highest regularAmount) as popular
        }));
        plans.sort((a, b) => a.regularAmount - b.regularAmount);
      
      return plans;
    } catch (error:unknown) {
     if(error instanceof AxiosError && error.message){
           throw new Error(error.response?.data.message)
         }
         throw new Error("Failed to fetch plans")
       }
  }

  async getUserPlan(): Promise<IUserPlan | null> {
    try {
      const response = await axiosInstance.get('/user-plan');
      console.log('user plan from plan service response ', response);
      return response.data.data || null;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.message) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Failed to fetch user plan");
    }
  }

  async createPayment(userId:string,planId:string,amount:number):Promise<{approvalUrl:string; paymentId:string}>{
    try {
      const response = await axiosInstance.post('/payments/create',{userId,planId,amount})
      return response.data.data
    } catch (error:unknown) {
      if(error instanceof AxiosError && error.message){
        throw new Error(error.response?.data.message)
      }
      throw new Error("Failed to initiate payment")
    }
  }
}