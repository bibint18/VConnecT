import { IsOptional, Min, IsString, IsEnum } from "class-validator";

export class GetAllRoomsDTO {
  @IsOptional()
  // @IsInt({ message: "Page must be an integer" })
  // @Min(1, { message: "Page must be at least 1" })
  page?: number;

  @IsOptional()
  // @IsInt({ message: "Limit must be an integer" })
  // @Min(1, { message: "Limit must be at least 1" })
  limit?: number;

  @IsOptional()
  @IsString({ message: "Search must be a string" })
  search?: string;

  @IsOptional()
  @IsEnum(["PUBLIC", "PRIVATE", "MY", ""], { message: "Type must be 'PUBLIC', 'PRIVATE', 'MY', or empty" })
  type?: "PUBLIC" | "PRIVATE" | "MY" | "";

  constructor(data: Partial<GetAllRoomsDTO> = {}) {
    console.log("[GetAllRoomsDTO] Constructor data:", data);
    this.page = data.page || 1;
    this.limit = data.limit || 10;
    this.search = data.search || "";
    this.type = data.type || "";
  }
}