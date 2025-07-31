import express from "express";
import {
  getQuizController,
  submitAnswerController,
  getQuizResultsController,
} from "../controller/quizController.mjs";
import { authenticateToken } from "../../common/auth.mjs";

const router = express.Router();

// All quiz routes require authentication
router.use(authenticateToken);

// GET /quiz - Get quiz questions for the authenticated user
router.get("/", getQuizController);

// POST /quiz/answer - Submit an answer for a question
router.post("/answer", submitAnswerController);

// GET /quiz/results - Get quiz results (only when completed)
router.get("/results", getQuizResultsController);

export default router;
