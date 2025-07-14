import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProfileDTO {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MinLength(1, { message: "Name cannot be empty" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Mobile must be a string" })
  mobile?: string;

  @IsOptional()
  @IsString({ message: "Country must be a string" })
  country?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Gender must be a string" })
  gender?: string;

  constructor(data: Partial<UpdateProfileDTO> = {}) {
    console.log("[UpdateProfileDTO] Constructor data:", data); 
    this.name = data?.name || undefined;
    this.mobile = data?.mobile || undefined;
    this.country = data?.country || undefined;
    this.description = data?.description || undefined;
    this.gender = data?.gender || undefined;
  }
}