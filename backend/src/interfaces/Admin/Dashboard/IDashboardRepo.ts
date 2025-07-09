

export interface DashboardData {
  totalUsers: number;
  premiumUsers: number;
  popularPlans: { planName: string; count: number; discountAmount: number }[];
  totalIncome: number;
  incomeOverTime: { year: number; month: number; total: number }[];
  totalRooms: number;
  roomTypes: { type: "PUBLIC" | "PRIVATE"; count: number }[];
  userCreationOverTime: { year: number; month: number; count: number }[];
  revenueDetails: { userName: string; email: string; planName: string; amount: number; purchaseDate: string }[];
  userDetails: { userName: string; email: string; createdAt: string; isPremium: boolean }[]
}
export interface IDashboardRepository{
    getDashboardData(startDate?: Date, endDate?: Date): Promise<DashboardData>;
  
}