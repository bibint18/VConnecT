import { IUser } from "../../../models/User";
import { IPlan } from "../../../models/PlansModel";
import { IRoom } from "../../../models/RoomModel";


export interface DashboardData {
  totalUsers: number;
  premiumUsers: number;
  popularPlans: { planName: string; count: number; discountAmount: number }[];
  totalIncome: number;
  incomeOverTime: { year: number; month: number; total: number }[];
  totalRooms: number;
  roomTypes: { type: "PUBLIC" | "PRIVATE"; count: number }[];
  userCreationOverTime: { year: number; month: number; count: number }[];
}
export interface IDashboardRepository{
    getDashboardData(startDate?: Date, endDate?: Date): Promise<DashboardData>;
  
}