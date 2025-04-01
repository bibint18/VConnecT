import mongoose, { Schema, Document } from "mongoose";

export interface ITriviaSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  triviaId: mongoose.Types.ObjectId;
  submittedAnswer: string;
  isCorrect: boolean;
  submittedAt: Date;
}

const TriviaSubmissionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  triviaId: { type: Schema.Types.ObjectId, ref: "DailyTrivia", required: true },
  submittedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export const TriviaSubmission = mongoose.model<ITriviaSubmission>("TriviaSubmission", TriviaSubmissionSchema);