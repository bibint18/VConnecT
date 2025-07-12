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
  async getPlans(page:number=1,limit:number=4):Promise<{plans:IPlan[],total:number}>{
    try {
      const response = await axiosInstance.get('/plans',{params:{page,limit}})
      console.log("response",response.data.data)
      const plans: IPlan[] = response.data.data
        .filter((plan: IPlan) => plan.isListed && !plan.isDeleted)
        .map((plan: IPlan, index: number, array: IPlan[]) => ({
          ...plan,
          id: plan._id ,
          color: plan.isPopular ? "bg-purple-600/50" : "from-purple-600 to-purple-900",
          isPopular: index === array.length - 1, 
        }));
        plans.sort((a, b) => a.regularAmount - b.regularAmount);
      console.log('plans',plans)
      return {plans,total:response.data.total}
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
      console.log('userplan response',response.data)
      return response.data.data || null;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.message) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Failed to fetch user plan");
    }
  }
  async getUserPlanHistory(page: number, limit: number) {
  const response = await axiosInstance.get(`/plans/history`, {
    params: { page, limit }
  });
  return response.data; 
}

  async reverseName(name:string){
    const response = await axiosInstance.post(`/reverse/${name}`)
    return response.data
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