import { IDailyTrivia } from "../../models/DailyTriviaModel.js";
import { DailyTriviaResponseDto } from "../../dtos/DailyTrivia/DailyTriviaResponse.dto.js";
import { SubmitTriviaResponseDto } from "../../dtos/DailyTrivia/SubmitTriviaResponse.dto.js";

export class DailyTriviaMapper {
  static toDailyTriviaResponse(trivia: IDailyTrivia): DailyTriviaResponseDto {
    return new DailyTriviaResponseDto({
      _id: trivia._id.toString(),
      question: trivia.question,
      options: trivia.options,
    });
  }

  static toDailyTriviaResponseArray(trivias: IDailyTrivia[]): DailyTriviaResponseDto[] {
    return trivias.map((trivia) => this.toDailyTriviaResponse(trivia));
  }

  static toSubmitTriviaResponse(result: { isCorrect: boolean; pointsUpdated: boolean; }): SubmitTriviaResponseDto {
    return new SubmitTriviaResponseDto({
      isCorrect: result.isCorrect,
      pointsUpdated: result.pointsUpdated,
    });
  }
}