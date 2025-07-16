import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class DailyTriviaResponseDto {
  @IsString()
  @IsNotEmpty({ message: "Trivia ID is required" })
  _id: string = "";

  @IsString()
  @IsNotEmpty({ message: "Question is required" })
  question: string = "";

  @IsArray()
  @IsString({ each: true, message: "Each option must be a string" })
  options: string[] = [];

  constructor(data: Partial<DailyTriviaResponseDto>) {
    Object.assign(this, data);
  }
}