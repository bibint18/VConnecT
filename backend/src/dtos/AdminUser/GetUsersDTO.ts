import { IsString, IsOptional, IsEnum } from "class-validator";

export class GetUsersDTO {
  @IsString()
  // @Min(1)
  page: number = 1;

  @IsString()
  // @Min(1)
  limit: number = 6;

  @IsString()
  @IsOptional()
  searchTerm: string = "";

  @IsEnum(["A-Z", "Z-A", "recent"])
  sortOption: string = "A-Z";
}