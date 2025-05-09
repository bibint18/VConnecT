import { DashboardData } from "./IDashboardRepo.js";
export interface IDashboardService {
  getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData>;
}