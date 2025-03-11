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
    
    console.log("reached backend fetch plans",req.query)
    const{search,sort,page=1,limit=4} = req.query
    const {plans,total} = await planService.gettAllPlans(String(search),String(sort),Number(page),Number(limit))
    res.status(200).json({plans,total})
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

export const updatePlan = async (req:Request,res:Response) => {
  try {
    console.log("reached edit backend")
    const {id} = req.params
    const updateData = req.body
    const updatePlan = await planService.updatePlan(id,updateData)
    res.status(200).json(updatePlan)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"failed to edit plan"})
  }
}

export const deletePlan = async (req:Request,res:Response) => {
  try {
    const {id} = req.params
    const plan = await planService.deletePlan(id)
    res.status(200).json(plan)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"failed to delete"})
  }
}