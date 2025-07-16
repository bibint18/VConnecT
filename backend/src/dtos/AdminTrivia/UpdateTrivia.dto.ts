import { IsNotEmpty, IsString, IsArray, ArrayMinSize, ArrayMaxSize, Matches } from "class-validator";

export class UpdateTriviaDto {
  @IsNotEmpty({ message: "Question is required" })
  @IsString({ message: "Question must be a string" })
  @Matches(/^[a-zA-Z0-9\s.,!?'-]+$/, { message: "Question contains invalid characters" })
  question!: string;

  @IsArray({ message: "Options must be an array" })
  @ArrayMinSize(4, { message: "At least 4 options are required" })
  @ArrayMaxSize(4, { message: "Maximum 4 options are allowed" })
  @IsString({ each: true, message: "Each option must be a string" })
  options!: string[];

  @IsNotEmpty({ message: "Correct answer is required" })
  @IsString({ message: "Correct answer must be a string" })
  correctAnswer!: string;

  constructor(data?: Partial<UpdateTriviaDto>) {
    Object.assign(this, data);
  }
}