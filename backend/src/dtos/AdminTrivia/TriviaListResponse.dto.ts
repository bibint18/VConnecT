import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TriviaResponseDTO } from "./AdminTriviaResponse.dto";

export class TriviaListResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TriviaResponseDTO)
  questions: TriviaResponseDTO[] = [];

  @IsNumber()
  total: number = 0;

  constructor(questions: TriviaResponseDTO[] = [], total: number = 0) {
    this.questions = questions;
    this.total = total;
  }
}