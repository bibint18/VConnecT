import { IDashboardService } from "../../../interfaces/Admin/Dashboard/IDashboardService";
import { IDashboardRepository,DashboardData } from "../../../interfaces/Admin/Dashboard/IDashboardRepo";
import { AppError } from "../../../utils/AppError";

export class DashboardService implements IDashboardService{
  private adminRepository:IDashboardRepository
  constructor(adminRepository:IDashboardRepository){
    this.adminRepository=adminRepository
  }

  async getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
    try {
      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new AppError("Invalid date format", 400);
        }
        if (start > end) {
          throw new AppError("Start date must be before end date", 400);
        }
        
      }
      return await this.adminRepository.getDashboardData(start,end)
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("Failed to fetch dashboard data", 500);
    }
  }
}