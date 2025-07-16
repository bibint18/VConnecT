import { IsNotEmpty, IsString } from "class-validator";

export class SubmitTriviaDto {
  @IsNotEmpty({ message: "Trivia ID is required" })
  @IsString({ message: "Trivia ID must be a string" })
  triviaId!: string;

  @IsNotEmpty({ message: "Submitted answer is required" })
  @IsString({ message: "Submitted answer must be a string" })
  submittedAnswer!: string;

  constructor(data?: Partial<SubmitTriviaDto>) {
    Object.assign(this, data);
  }
}