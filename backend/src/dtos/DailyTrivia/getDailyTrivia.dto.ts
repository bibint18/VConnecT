import { IsInt, Min } from "class-validator";

export class GetDailyTriviaDto {
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  limit!: number;

  constructor(data?: Partial<GetDailyTriviaDto>) {
    Object.assign(this, data);
  }
}