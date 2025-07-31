import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    default: null,
  },
  isCorrect: {
    type: Boolean,
    default: null,
  },
  answeredAt: {
    type: Date,
    default: null,
  },
});

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate score
quizSchema.methods.calculateScore = function () {
  let correctAnswers = 0;
  this.questions.forEach((question) => {
    if (question.isCorrect === true) {
      correctAnswers++;
    }
  });
  this.totalScore = correctAnswers;
  return correctAnswers;
};

// Method to check if quiz is complete
quizSchema.methods.checkCompletion = function () {
  const answeredQuestions = this.questions.filter((q) => q.userAnswer !== null);
  this.isCompleted = answeredQuestions.length === this.questions.length;
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  return this.isCompleted;
};

export const Quiz = mongoose.model("Quiz", quizSchema);
