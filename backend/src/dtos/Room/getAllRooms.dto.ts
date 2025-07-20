import { IsOptional, IsString, IsEnum } from "class-validator";

export class GetAllRoomsDTO {
  @IsOptional()
  page?: number;

  @IsOptional()
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