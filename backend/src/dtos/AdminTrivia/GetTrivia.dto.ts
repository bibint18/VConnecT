import { IsString, IsOptional } from "class-validator";

export class GetTriviaDto {
  @IsString({ message: "Page must be a string" })
  page!: string;

  @IsString({ message: "Limit must be a string n" })
  limit!: string;

  @IsOptional()
  @IsString({ message: "Search term must be a string" })
  searchTerm?: string;

  constructor(data?: Partial<GetTriviaDto>) {
    Object.assign(this, data);
  }
}