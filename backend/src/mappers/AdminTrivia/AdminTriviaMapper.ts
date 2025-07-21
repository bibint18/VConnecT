import { IDailyTrivia } from "../../models/DailyTriviaModel.js";
import { TriviaResponseDTO } from "../../dtos/AdminTrivia/AdminTriviaResponse.dto.js";
import { TriviaListResponseDTO } from "../../dtos/AdminTrivia/TriviaListResponse.dto.js";
import { TriviaDetailsResponseDTO } from "../../dtos/AdminTrivia/TriviaDetailResponse.dto.js";

export class TriviaMapper {
  static toTriviaResponse(trivia: IDailyTrivia): TriviaResponseDTO {
    return new TriviaResponseDTO({
      _id: trivia._id.toString(),
      setNumber: trivia.setNumber,
      question: trivia.question,
      correctAnswer: trivia.correctAnswer,
      isDeleted: trivia.isDeleted,
    });
  }

  static toTriviaListResponse(trivias: IDailyTrivia[], total: number): TriviaListResponseDTO {
    const triviaDTOs = trivias.map((trivia) => this.toTriviaResponse(trivia));
    return new TriviaListResponseDTO(triviaDTOs, total);
  }

  static toTriviaDetailsResponse(trivia: IDailyTrivia): TriviaDetailsResponseDTO {
    return new TriviaDetailsResponseDTO({
      _id: trivia._id.toString(),
      setNumber: trivia.setNumber,
      question: trivia.question,
      correctAnswer: trivia.correctAnswer,
      isDeleted: trivia.isDeleted,
      options: trivia.options,
      createdAt: trivia.createdAt.toISOString(),
    });
  }
}