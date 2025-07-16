import { IsString, IsNotEmpty, IsBoolean, IsArray, IsNumber, IsDateString } from "class-validator";

export class TriviaDetailsResponseDTO {
  @IsString()
  @IsNotEmpty({ message: "Trivia ID is required" })
  _id: string = "";

  @IsNumber()
  @IsNotEmpty({ message: "Set number is required" })
  setNumber: number = 0;

  @IsString()
  @IsNotEmpty({ message: "Question is required" })
  question: string = "";

  @IsString()
  @IsNotEmpty({ message: "Correct answer is required" })
  correctAnswer: string = "";

  @IsBoolean()
  isDeleted: boolean = false;

  @IsArray()
  @IsString({ each: true, message: "Each option must be a string" })
  options: string[] = [];

  @IsDateString()
  createdAt: string = "";

  constructor(data: Partial<TriviaDetailsResponseDTO>) {
    Object.assign(this, data);
  }
}