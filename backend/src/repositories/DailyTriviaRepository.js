"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyTriviaRepository = void 0;
const DailyTriviaModel_1 = require("../models/DailyTriviaModel");
const TriviaSubmissionModel_1 = require("../models/TriviaSubmissionModel");
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
class DailyTriviaRepository {
    getDailyTriviaQuestions(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached repo ", limit);
            // const questions = await DailyTrivia.find({isDeleted:false})
            const questions = yield DailyTriviaModel_1.DailyTrivia.aggregate([{ $match: { isDeleted: false } }, { $sample: { size: limit } }]);
            console.log("questions from repo", questions);
            if (questions.length === 0) {
                throw new AppError_1.AppError("No Unlisted questions available", 400);
            }
            const questionIds = questions.map((q) => q._id);
            yield DailyTriviaModel_1.DailyTrivia.updateMany({ _id: { $in: questionIds } }, { isListed: true });
            return questions;
        });
    }
    submitTriviaAnswer(userId, triviaId, submittedAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached repo submit trivia", triviaId, "remaining", userId, triviaId, submittedAnswer);
            const existingSubmission = yield TriviaSubmissionModel_1.TriviaSubmission.findOne({ userId, triviaId }).exec();
            if (existingSubmission) {
                throw new AppError_1.AppError("Question already attempted", 400);
            }
            const trivia = yield DailyTriviaModel_1.DailyTrivia.findById(triviaId).exec();
            console.log(trivia, 'from repo');
            if (!trivia || trivia.isDeleted)
                throw new AppError_1.AppError("Trivia question not found", 404);
            const isCorrect = submittedAnswer === trivia.correctAnswer;
            yield TriviaSubmissionModel_1.TriviaSubmission.create({
                userId,
                triviaId,
                submittedAnswer,
                isCorrect
            });
            let pointsUpdated = false;
            if (isCorrect) {
                yield User_1.User.findByIdAndUpdate(userId, { $inc: { point: 1 } });
                pointsUpdated = true;
            }
            return { isCorrect, pointsUpdated };
        });
    }
}
exports.DailyTriviaRepository = DailyTriviaRepository;
