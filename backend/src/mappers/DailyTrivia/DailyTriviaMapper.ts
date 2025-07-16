import { IDailyTrivia } from "../../models/DailyTriviaModel";
import { DailyTriviaResponseDto } from "../../dtos/DailyTrivia/DailyTriviaResponse.dto";
import { SubmitTriviaResponseDto } from "../../dtos/DailyTrivia/SubmitTriviaResponse.dto";

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