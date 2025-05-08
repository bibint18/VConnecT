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
exports.DailyTriviaController = void 0;
const User_1 = require("../models/User");
class DailyTriviaController {
    constructor(triviaService) {
        this.triviaService = triviaService;
    }
    getDailyTriviaQuestions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield this.triviaService.getDailyTriviaQuestions(5);
                const userId = req.user.id;
                const user = yield User_1.User.findById(userId);
                console.log("questions from controller", questions);
                res.status(200).json({ questions, user: { point: (user === null || user === void 0 ? void 0 : user.point) || 0 } });
            }
            catch (error) {
                next(error);
            }
        });
    }
    submitTriviaAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { triviaId, submittedAnswer } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log("controller triviaId", triviaId);
                console.log("submitt trivia controller", triviaId, userId, submittedAnswer);
                if (!triviaId || !submittedAnswer) {
                    res.status(400).json({ message: "Trivia ID and answer are required" });
                    return;
                }
                const result = yield this.triviaService.submitTriviaAnswer(userId, triviaId, submittedAnswer);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.DailyTriviaController = DailyTriviaController;
