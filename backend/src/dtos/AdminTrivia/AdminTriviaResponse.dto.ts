import { IsString, IsNotEmpty, IsBoolean ,IsNumber} from "class-validator";

export class TriviaResponseDTO {
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

  constructor(data: Partial<TriviaResponseDTO>) {
    Object.assign(this, data);
  }
}