import { IDailyTriviaRepository } from "../interfaces/DailyTriviaRepository.js";
import { DailyTrivia, IDailyTrivia } from "../models/DailyTriviaModel.js";
import { TriviaSubmission } from "../models/TriviaSubmissionModel.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { BaseRepository } from "./Base/BaseRepository.js";

export class DailyTriviaRepository extends BaseRepository<IDailyTrivia> implements IDailyTriviaRepository{
  constructor(){
    super(DailyTrivia)
  }
  async getDailyTriviaQuestions(limit: number): Promise<IDailyTrivia[]> {
    const questions = await DailyTrivia.aggregate([{$match:{isDeleted:false}},{$sample:{size:limit}}])
    if(questions.length===0){
      throw new AppError("No Unlisted questions available",400)
    }
    const questionIds = questions.map((q) => q._id)
    await DailyTrivia.updateMany({_id:{$in:questionIds}},{isListed:true})
    return questions
  }

  async submitTriviaAnswer(userId: string, triviaId: string, submittedAnswer: string): Promise<{ isCorrect: boolean; pointsUpdated: boolean; }> {
    const existingSubmission = await TriviaSubmission.findOne({userId,triviaId}).exec()
    if(existingSubmission){
      throw new AppError("Question already attempted",400)
    }
    const trivia = await this.findById(triviaId).exec()
    if (!trivia || trivia.isDeleted) throw new AppError("Trivia question not found", 404);
    const isCorrect = submittedAnswer ===trivia.correctAnswer
    await TriviaSubmission.create({
      userId,
      triviaId,
      submittedAnswer,
      isCorrect
    })
    let pointsUpdated=false
    if (isCorrect) {
      await User.findByIdAndUpdate(userId, { $inc: { point: 1 } });
      pointsUpdated = true;
    }
    return {isCorrect,pointsUpdated}
  }
}