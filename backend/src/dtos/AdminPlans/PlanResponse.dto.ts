import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsBoolean } from "class-validator";

export class PlanResponseDTO {
  @IsString()
  @IsNotEmpty({ message: "Plan ID is required" })
  _id: string = "";

  @IsString()
  @IsNotEmpty({ message: "Plan name is required" })
  name: string = "";

  @IsEnum(["paid", "free"], { message: "Type must be 'paid' or 'free'" })
  type: "paid" | "free" = "paid";

  @IsNumber({}, { message: "Regular amount must be a number" })
  regularAmount: number = 0;

  @IsNumber({}, { message: "Discount amount must be a number" })
  discountAmount: number = 0;

  @IsArray()
  @IsString({ each: true, message: "Each benefit must be a string" })
  benefits: string[] = [];

  @IsBoolean()
  isListed: boolean = true;

  constructor(data: Partial<PlanResponseDTO>) {
    Object.assign(this, data);
  }
}