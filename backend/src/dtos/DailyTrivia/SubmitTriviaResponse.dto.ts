import { IsBoolean } from "class-validator";

export class SubmitTriviaResponseDto {
  @IsBoolean({ message: "isCorrect must be a boolean" })
  isCorrect: boolean = false;

  @IsBoolean({ message: "pointsUpdated must be a boolean" })
  pointsUpdated: boolean = false;

  constructor(data: Partial<SubmitTriviaResponseDto>) {
    Object.assign(this, data);
  }
}