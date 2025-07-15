import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsBoolean, Min, Max } from "class-validator";

export class CreatePlanDTO {
  @IsString()
  @IsNotEmpty({ message: "Plan name is required" })
  name: string = "";

  @IsEnum(["paid", "free"], { message: "Type must be 'paid' or 'free'" })
  type: "paid" | "free" = "paid";

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description: string = "";

  @IsString({ message: "Regular amount must be a String" })
  regularAmount:string='0'

  @IsString({ message: "Discount amount must be a String" })
  discountAmount: string = '0';

  @IsArray()
  @IsString({ each: true, message: "Each benefit must be a string" })
  @IsNotEmpty({ each: true, message: "Benefits cannot be empty" })
  benefits: string[] = [];

  @IsBoolean()
  isListed: boolean = true;

  @IsEnum(["1 month", "3 months", "6 months", "9 months", "12 months"], {
    message: "Duration must be one of: 1 month, 3 months, 6 months, 9 months, 12 months",
  })
  duration: "1 month" | "3 months" | "6 months" | "9 months" | "12 months" = "1 month";

  @IsNumber({}, { message: "Room benefit must be a number" })
  @Min(0, { message: "Room benefit cannot be negative" })
  @Max(20, { message: "Room benefit cannot exceed 20" })
  roomBenefit: number = 0;

  constructor(data?: Partial<CreatePlanDTO>) {
    Object.assign(this, data);
  }
}