import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PlanResponseDTO } from "./PlanResponse.dto";

export class PlanListResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanResponseDTO)
  plans: PlanResponseDTO[] = [];

  @IsNumber()
  total: number = 0;

  constructor(plans: PlanResponseDTO[] = [], total: number = 0) {
    this.plans = plans;
    this.total = total;
  }
}