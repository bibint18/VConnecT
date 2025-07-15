import { IPlan } from "../../models/PlansModel";
import { PlanResponseDTO } from "../../dtos/AdminPlans/PlanResponse.dto";
import { PlanListResponseDTO } from "../../dtos/AdminPlans/planListResponse.dto";
import { PlanDetailsResponseDTO } from "../../dtos/AdminPlans/PlanDetailResponse.dto";

export class PlanMapper {
  static toPlanResponse(plan: IPlan): PlanResponseDTO {
    return new PlanResponseDTO({
      _id: plan._id?.toString(),
      name: plan.name,
      type: plan.type,
      regularAmount: plan.regularAmount,
      discountAmount: plan.discountAmount,
      benefits: plan.benefits,
      isListed: plan.isListed,
    });
  }

  static toPlanListResponse(plans: IPlan[], total: number): PlanListResponseDTO {
    const planDTOs = plans.map((plan) => this.toPlanResponse(plan));
    return new PlanListResponseDTO(planDTOs, total);
  }

  static toPlanDetailsResponse(plan: IPlan): PlanDetailsResponseDTO {
    return new PlanDetailsResponseDTO({
      _id: plan._id?.toString(), 
      name: plan.name,
      type: plan.type,
      description: plan.description,
      regularAmount: plan.regularAmount,
      discountAmount: plan.discountAmount,
      benefits: plan.benefits,
      isListed: plan.isListed,
      duration: plan.duration,
      createdAt: plan.createdAt.toISOString(),
      roomBenefit: plan.roomBenefit,
    });
  }
}