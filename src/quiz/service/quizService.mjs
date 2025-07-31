import { Quiz } from "../model/quizModel.mjs";

export const getQuizByUserId = async (userId) => {
  try {
    const quiz = await Quiz.findOne({ userId });
    
    if (!quiz) {
      return {
        success: false,
        message: "Quiz not found for this user",
        error: "QUIZ_NOT_FOUND"
      };
    }
    
    return {
      success: true,
      data: quiz,
      message: "Quiz retrieved successfully"
    };
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    return {
      success: false,
      message: "Failed to retrieve quiz",
      error: error.message
    };
  }
};

export const submitQuizAnswer = async (userId, questionIndex, answer) => {
  try {
    const quiz = await Quiz.findOne({ userId });
    
    if (!quiz) {
      return {
        success: false,
        message: "Quiz not found for this user",
        error: "QUIZ_NOT_FOUND"
      };
    }
    
    if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
      return {
        success: false,
        message: "Invalid question index",
        error: "INVALID_QUESTION_INDEX"
      };
    }
    
    const question = quiz.questions[questionIndex];
    
    // Update the question with user's answer
    question.userAnswer = answer;
    question.isCorrect = answer === question.correctAnswer;
    question.answeredAt = new Date();
    
    // Check if quiz is complete
    quiz.checkCompletion();
    
    // Calculate score if quiz is complete
    if (quiz.isCompleted) {
      quiz.calculateScore();
    }
    
    await quiz.save();
    
    return {
      success: true,
      data: {
        questionIndex,
        isCorrect: question.isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isQuizComplete: quiz.isCompleted,
        totalScore: quiz.totalScore,
        questionsAnswered: quiz.questions.filter(q => q.userAnswer !== null).length,
        totalQuestions: quiz.questions.length
      },
      message: "Answer submitted successfully"
    };
  } catch (error) {
    console.error("Error submitting answer:", error);
    return {
      success: false,
      message: "Failed to submit answer",
      error: error.message
    };
  }
};

export const getQuizResults = async (userId) => {
  try {
    const quiz = await Quiz.findOne({ userId });
    
    if (!quiz) {
      return {
        success: false,
        message: "Quiz not found for this user",
        error: "QUIZ_NOT_FOUND"
      };
    }
    
    if (!quiz.isCompleted) {
      return {
        success: false,
        message: "Quiz is not completed yet",
        error: "QUIZ_NOT_COMPLETED"
      };
    }
    
    const results = {
      totalScore: quiz.totalScore,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((quiz.totalScore / quiz.questions.length) * 100),
      completedAt: quiz.completedAt,
      questions: quiz.questions.map((q, index) => ({
        questionIndex: index,
        question: q.question,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: q.isCorrect,
        explanation: q.explanation
      }))
    };
    
    return {
      success: true,
      data: results,
      message: "Quiz results retrieved successfully"
    };
  } catch (error) {
    console.error("Error retrieving quiz results:", error);
    return {
      success: false,
      message: "Failed to retrieve quiz results",
      error: error.message
    };
  }
}; 