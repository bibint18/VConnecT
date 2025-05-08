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
exports.AdminDailyTriviaReposiroy = void 0;
const DailyTriviaModel_1 = require("../models/DailyTriviaModel");
const AppError_1 = require("../utils/AppError");
class AdminDailyTriviaReposiroy {
    addTriviaQuestion(question, options, correctAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (options.length !== 4) {
                    throw new AppError_1.AppError("4 options required", 400);
                }
                if (!options.includes(correctAnswer)) {
                    throw new AppError_1.AppError("Answer should be in option", 400);
                }
                const lastTrivia = yield DailyTriviaModel_1.DailyTrivia.findOne().sort({ setNumber: -1 }).exec();
                const setNumber = lastTrivia ? lastTrivia.setNumber + 1 : 1;
                const trivia = yield DailyTriviaModel_1.DailyTrivia.create({
                    question,
                    setNumber,
                    options,
                    correctAnswer,
                    isListed: false
                });
                console.log("trivia added", trivia);
                return trivia;
            }
            catch (error) {
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError("failed to add trivia", 500);
            }
        });
    }
    getTriviaQuestions(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { isDeleted: false };
            if (searchTerm) {
                query.question = { $regex: searchTerm, $options: 'i' };
            }
            const questions = yield DailyTriviaModel_1.DailyTrivia.find(query).skip((page - 1) * limit).limit(limit).exec();
            const total = yield DailyTriviaModel_1.DailyTrivia.countDocuments(query);
            return { questions, total };
        });
    }
    updateTriviaQuestion(id, question, options, correctAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.length !== 4)
                throw new AppError_1.AppError("4 options required", 400);
            if (!options.includes(correctAnswer))
                throw new AppError_1.AppError("Correct answer must be one of the options", 400);
            const trivia = yield DailyTriviaModel_1.DailyTrivia.findByIdAndUpdate(id, { question, options, correctAnswer }, { new: true }).exec();
            if (!trivia || trivia.isDeleted)
                throw new AppError_1.AppError("Trivia question not found", 404);
            return trivia;
        });
    }
    deleteTriviaQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const trivia = yield DailyTriviaModel_1.DailyTrivia.findByIdAndUpdate(id, { isDeleted: true }).exec();
            if (!trivia)
                throw new AppError_1.AppError("Trivia question not found", 404);
            return trivia;
        });
    }
    getTriviaQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const trivia = yield DailyTriviaModel_1.DailyTrivia.findById(id).exec();
            if (!trivia || trivia.isDeleted)
                throw new AppError_1.AppError("Trivia question not found", 404);
            return trivia;
        });
    }
}
exports.AdminDailyTriviaReposiroy = AdminDailyTriviaReposiroy;
