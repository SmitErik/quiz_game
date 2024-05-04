import mongoose, { Document, Model, Schema } from 'mongoose';

interface IQuiz extends Document {
    title: string;
    questions: string[];
    answers1: string[];
    answers2: string[];
    answers3: string[];
    answers4: string[];
    correctAnswers: number[];
}

const QuizSchema: Schema<IQuiz> = new mongoose.Schema({
    title: { type: String, required: true },
    questions: { type: [String], required: true },
    answers1: { type: [String], required: true },
    answers2: { type: [String], required: true },
    answers3: { type: [String], required: true },
    answers4: { type: [String], required: true },
    correctAnswers: { type: [Number], required: true }
});

export const Quiz: Model<IQuiz> = mongoose.model<IQuiz>('Quiz', QuizSchema);
