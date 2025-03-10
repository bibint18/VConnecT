import { Request,Response } from "express";
import { PlanService } from "../services/AdminPlanService";
import { PlansRepository } from "../repositories/AdminPlanRepository";

const planService = new PlanService(new PlansRepository())

export const createPlan = async(req:Request,res:Response) => {
  try {
    console.log("reached backend plan create body: ",req.body)
    const plan = await planService.createPlan(req.body)
      res.status(200).json(plan)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"failed to create plans"})
  }
}

export const getAllPlans = async (req:Request,res:Response) => {
  try {
    console.log("reached backend fetch plans")
    const plans = await planService.gettAllPlans()
    res.status(200).json(plans)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"Failed to fetch plans"})
  }
}

export const getPlanById = async(req:Request,res:Response) => {
  try {
    const {id} = req.params
    const plan = await planService.getPlanById(id)
    res.status(200).json(plan)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"failed to find plan"})
  }
}