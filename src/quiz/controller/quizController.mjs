import { 
  getQuizByUserId, 
  submitQuizAnswer, 
  getQuizResults 
} from "../service/quizService.mjs";

export const getQuizController = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const userId = authenticatedUser.userId;

    const result = await getQuizByUserId(userId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          userId: result.data.userId,
          questions: result.data.questions.map((q, index) => ({
            questionIndex: index,
            question: q.question,
            options: q.options,
            userAnswer: q.userAnswer,
            isAnswered: q.userAnswer !== null
          })),
          isCompleted: result.data.isCompleted,
          totalScore: result.data.totalScore,
          questionsAnswered: result.data.questions.filter(q => q.userAnswer !== null).length,
          totalQuestions: result.data.questions.length
        }
      });
    } else {
      if (result.error === "QUIZ_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Controller error getting quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export const submitAnswerController = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const authenticatedUser = req.user;
    const userId = authenticatedUser.userId;

    // Validate input
    if (questionIndex === undefined || questionIndex === null) {
      return res.status(400).json({
        success: false,
        message: "Question index is required",
        error: "MISSING_QUESTION_INDEX"
      });
    }

    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Answer is required and must be a string",
        error: "INVALID_ANSWER"
      });
    }

    const result = await submitQuizAnswer(userId, questionIndex, answer);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      if (result.error === "QUIZ_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
      if (result.error === "INVALID_QUESTION_INDEX") {
        return res.status(400).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Controller error submitting answer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export const getQuizResultsController = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const userId = authenticatedUser.userId;

    const result = await getQuizResults(userId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      if (result.error === "QUIZ_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
      if (result.error === "QUIZ_NOT_COMPLETED") {
        return res.status(400).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Controller error getting quiz results:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
}; 