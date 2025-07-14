import { IsString, IsInt, Min, Max, IsEnum,  MinLength } from "class-validator";

export class CreateRoomDTO {
  @IsString({ message: "Title must be a string" })
  @MinLength(1, { message: "Title cannot be empty" })
  title: string;

  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(10, { message: "Limit cannot exceed 10" })
  limit: number;

  @IsEnum(["Yes", "No"], { message: "Premium must be 'Yes' or 'No'" })
  premium: "Yes" | "No";

  @IsEnum(["PUBLIC", "PRIVATE"], { message: "Type must be 'PUBLIC' or 'PRIVATE'" })
  type: "PUBLIC" | "PRIVATE";

  @IsString({ message: "Description must be a string" })
  @MinLength(1, { message: "Description cannot be empty" })
  description: string;

  constructor(data: Partial<CreateRoomDTO> = {}) {
    console.log("[CreateRoomDTO] Constructor data:", data);
    this.title = data.title || "";
    this.limit = data.limit || 1;
    this.premium = data.premium || "No";
    this.type = data.type || "PUBLIC";
    this.description = data.description || "";
  }
}