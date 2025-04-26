import { DashboardData } from "./IDashboardRepo";
export interface IDashboardService {
  getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData>;
}