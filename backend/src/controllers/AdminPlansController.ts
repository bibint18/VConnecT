
import { NextFunction, Request, Response } from "express";
import { PlanService } from "../services/AdminPlanService.js";
import { PlansRepository } from "../repositories/AdminPlanRepository.js";

export class AdminPlansController {
  private adminPlanService: PlanService;

  constructor(adminPlanService: PlanService) {
    this.adminPlanService = adminPlanService;
  }

  async createPlan(req: Request, res: Response) {
    try {
      console.log("reached backend plan create body: ", req.body);
      const plan = await this.adminPlanService.createPlan(req.body);
      res.status(200).json(plan);
    } catch (error: any) {
      console.log(error);
      if (error.message === "A plan with this name already exists") {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getAllPlans(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached backend fetch plans", req.query);
      const { search = "", sort = "", page = 1, limit = 4 } = req.query;
      const { plans, total } = await this.adminPlanService.gettAllPlans(
        String(search),
        String(sort),
        Number(page),
        Number(limit)
      );
      res.status(200).json({ plans, total });
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plan = await this.adminPlanService.getPlanById(id);
      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response) {
    try {
      console.log("reached edit backend");
      const { id } = req.params;
      const updateData = req.body;
      const updatePlan = await this.adminPlanService.updatePlan(id, updateData);
      res.status(200).json(updatePlan);
    } catch (error: any) {
      console.log(error);
      if (error.message === "A plan with this name already exists.") {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to edit plan" });
      }
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plan = await this.adminPlanService.deletePlan(id);
      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminPlansController(new PlanService(new PlansRepository()));
