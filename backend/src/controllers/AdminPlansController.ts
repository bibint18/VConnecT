import { NextFunction, Request, Response } from "express";
import { PlanService } from "../services/AdminPlanService.js";
import { PlansRepository } from "../repositories/AdminPlanRepository.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import { IAdminPlanController } from "../interfaces/Admin/Plans/IAdminPlansController.js";

export class AdminPlansController implements IAdminPlanController {
  private adminPlanService: PlanService;

  constructor(adminPlanService: PlanService) {
    this.adminPlanService = adminPlanService;
  }

  async createPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("reached backend plan create body: ", req.body);
      const plan = await this.adminPlanService.createPlan(req.body);
      res.status(HTTP_STATUS_CODE.OK).json(plan);
    } catch (error) {
      next(error);
    }
  }

  async getAllPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("reached backend fetch plans", req.query);
      const { search = "", sort = "", page = 1, limit = 4 } = req.query;
      const { plans, total } = await this.adminPlanService.gettAllPlans(
        String(search),
        String(sort),
        Number(page),
        Number(limit)
      );
      res.status(HTTP_STATUS_CODE.OK).json({ plans, total });
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await this.adminPlanService.getPlanById(id);
      res.status(HTTP_STATUS_CODE.OK).json(plan);
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatePlan = await this.adminPlanService.updatePlan(id, updateData);
      res.status(HTTP_STATUS_CODE.OK).json(updatePlan);
    } catch (error: any) {
      next(error);
    }
  }

  async deletePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await this.adminPlanService.deletePlan(id);
      res.status(HTTP_STATUS_CODE.OK).json(plan);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminPlansController(new PlanService(new PlansRepository()));
