import { IsString, MinLength } from "class-validator";

export class UpdateProfileImageDTO {
  @IsString({ message: "Image URL must be a string" })
  @MinLength(1, { message: "Image URL cannot be empty" })
  imageUrl: string;

  constructor(data: Partial<UpdateProfileImageDTO> = {}) {
    console.log("[UpdateProfileImageDTO] Constructor data:", data);
    this.imageUrl = data.imageUrl || "";
  }
}