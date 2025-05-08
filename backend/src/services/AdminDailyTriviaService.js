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
exports.AdminDailyTriviaService = void 0;
class AdminDailyTriviaService {
    constructor(triviaRepository) {
        this.triviaRepository = triviaRepository;
    }
    addTriviaQuestion(question, options, correctAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.triviaRepository.addTriviaQuestion(question, options, correctAnswer);
        });
    }
    getTriviaQuestions(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.triviaRepository.getTriviaQuestions(page, limit, searchTerm);
        });
    }
    updateTriviaQuestion(id, question, options, correctAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.triviaRepository.updateTriviaQuestion(id, question, options, correctAnswer);
        });
    }
    deleteTriviaQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.triviaRepository.deleteTriviaQuestion(id);
        });
    }
    getTriviaQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.triviaRepository.getTriviaQuestionById(id);
        });
    }
}
exports.AdminDailyTriviaService = AdminDailyTriviaService;
