"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QuizSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true },
    questions: { type: [String], required: true },
    answers1: { type: [String], required: true },
    answers2: { type: [String], required: true },
    answers3: { type: [String], required: true },
    answers4: { type: [String], required: true },
    correctAnswers: { type: [Number], required: true }
});
exports.Quiz = mongoose_1.default.model('Quiz', QuizSchema);
