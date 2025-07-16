import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsBoolean, Min, Max, IsOptional } from "class-validator";

export class UpdatePlanDTO {
  @IsString()
  @IsNotEmpty({ message: "Plan name is required" })
  @IsOptional()
  name?: string;

  @IsEnum(["paid", "free"], { message: "Type must be 'paid' or 'free'" })
  @IsOptional()
  type?: "paid" | "free";

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: "Regular amount must be a number" })
  @Min(0, { message: "Regular amount cannot be negative" })
  @IsOptional()
  regularAmount?: number;

  @IsNumber({},{ message: "Discount amount must be a number" })
  @Min(0, { message: "Regular amount cannot be negative" })
  @IsOptional()
  discountAmount?:number;

  @IsArray()
  @IsString({ each: true, message: "Each benefit must be a string" })
  @IsNotEmpty({ each: true, message: "Benefits cannot be empty" })
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  isListed?: boolean;

  @IsEnum(["1 month", "3 months", "6 months", "9 months", "12 months"], {
    message: "Duration must be one of: 1 month, 3 months, 6 months, 9 months, 12 months",
  })
  @IsOptional()
  duration?: "1 month" | "3 months" | "6 months" | "9 months" | "12 months";

  @IsNumber({}, { message: "Room benefit must be a number" })
  @Min(0, { message: "Room benefit cannot be negative" })
  @Max(20, { message: "Room benefit cannot exceed 20" })
  @IsOptional()
  roomBenefit?: number;

  constructor(data?: Partial<UpdatePlanDTO>) {
    Object.assign(this, data);
  }
}