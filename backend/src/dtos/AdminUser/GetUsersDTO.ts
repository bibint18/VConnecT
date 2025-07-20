import { IsString, IsOptional, IsEnum } from "class-validator";

export class GetUsersDTO {
  @IsString()
  page: number = 1;

  @IsString()
  limit: number = 6;

  @IsString()
  @IsOptional()
  searchTerm: string = "";

  @IsEnum(["A-Z", "Z-A", "recent"])
  sortOption: string = "A-Z";
}