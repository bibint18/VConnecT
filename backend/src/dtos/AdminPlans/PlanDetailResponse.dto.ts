import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsBoolean, IsDateString } from "class-validator";

export class PlanDetailsResponseDTO {
  @IsString()
  @IsNotEmpty({ message: "Plan ID is required" })
  _id: string = "";

  @IsString()
  @IsNotEmpty({ message: "Plan name is required" })
  name: string = "";

  @IsEnum(["paid", "free"], { message: "Type must be 'paid' or 'free'" })
  type: "paid" | "free" = "paid";

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description: string = "";

  @IsNumber({}, { message: "Regular amount must be a number" })
  regularAmount: number = 0;

  @IsNumber({}, { message: "Discount amount must be a number" })
  discountAmount: number = 0;

  @IsArray()
  @IsString({ each: true, message: "Each benefit must be a string" })
  benefits: string[] = [];

  @IsBoolean()
  isListed: boolean = true;

  @IsEnum(["1 month", "3 months", "6 months", "9 months", "12 months"], {
    message: "Duration must be one of: 1 month, 3 months, 6 months, 9 months, 12 months",
  })
  duration: "1 month" | "3 months" | "6 months" | "9 months" | "12 months" = "1 month";

  @IsDateString()
  createdAt: string = "";

  @IsNumber({}, { message: "Room benefit must be a number" })
  roomBenefit: number = 0;

  constructor(data: Partial<PlanDetailsResponseDTO>) {
    Object.assign(this, data);
  }
}