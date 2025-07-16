import { Request, Response, NextFunction } from "express";
import { IDailyTriviaController } from "../interfaces/DailyTriviaController.js";
import { IDailyTriviaService } from "../interfaces/DailyTriviaService.js";
import { User } from "../models/User.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";

export class DailyTriviaController implements IDailyTriviaController {
  private triviaService: IDailyTriviaService;
  constructor(triviaService: IDailyTriviaService) {
    this.triviaService = triviaService;
  }

  async getDailyTriviaQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const questions = await this.triviaService.getDailyTriviaQuestions(5);
      const userId = (req as any).user.id;
      const user = await User.findById(userId);
      console.log("questions from controller", questions);
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ questions, user: { point: user?.point || 0 } });
    } catch (error) {
      next(error);
    }
  }

  async submitTriviaAnswer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { triviaId, submittedAnswer } = req.body;
      const userId = req.user?.id as string;
      console.log("controller triviaId", triviaId);
      console.log(
        "submitt trivia controller",
        triviaId,
        userId,
        submittedAnswer
      );
      if (!triviaId || !submittedAnswer) {
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ message: "Trivia ID and answer are required" });
        return;
      }
      const result = await this.triviaService.submitTriviaAnswer(
        userId,
        triviaId,
        submittedAnswer
      );
      res.status(HTTP_STATUS_CODE.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
