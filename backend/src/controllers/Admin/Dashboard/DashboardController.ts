import { Request,Response,NextFunction } from "express";
import { IDashboardController } from "../../../interfaces/Admin/Dashboard/IDashboardController";
import { IDashboardService } from "../../../interfaces/Admin/Dashboard/IDashboardService";

export class DashboardController implements IDashboardController{
  private adminService:IDashboardService
  constructor(adminService:IDashboardService){
    this.adminService=adminService
  }
  async getDashboardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {startDate,endDate} = req.query;
      const data = await this.adminService.getDashboardData(startDate as string,endDate as string)
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}