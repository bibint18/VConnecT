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
exports.AdminDailyTriviaController = void 0;
class AdminDailyTriviaController {
    constructor(triviaService) {
        this.triviaService = triviaService;
    }
    addTriviaQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { question, options, correctAnswer } = req.body;
                if (!question || !options || !correctAnswer) {
                    res.status(400).json({ message: "All fields are required" });
                    return;
                }
                const trivia = yield this.triviaService.addTriviaQuestion(question, options, correctAnswer);
                res.status(200).json({ message: "trivia question added", trivia });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTriviaQuestions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4, searchTerm = '' } = req.query;
                const result = yield this.triviaService.getTriviaQuestions(Number(page), Number(limit), String(searchTerm));
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateTriviaQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { question, options, correctAnswer } = req.body;
                if (!question || !options || !correctAnswer) {
                    res.status(400).json({ message: "All fields are required" });
                    return;
                }
                const trivia = yield this.triviaService.updateTriviaQuestion(id, question, options, correctAnswer);
                res.status(200).json({ message: "Trivia Question updated", trivia });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteTriviaQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const trivia = yield this.triviaService.deleteTriviaQuestion(id);
                res.status(200).json({ message: "Trivia deleted successfully", trivia });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTriviaQuestionById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached fetbyid");
                const { id } = req.params;
                const trivia = yield this.triviaService.getTriviaQuestionById(id);
                console.log("trivia controller", trivia);
                res.status(200).json({ trivia });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminDailyTriviaController = AdminDailyTriviaController;
