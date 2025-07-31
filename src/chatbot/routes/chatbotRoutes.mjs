import express from "express";
import { chatbotController } from "../controller/chatbotController.mjs";
import { authenticateToken } from "../../common/auth.mjs";

const router = express.Router();

// Chatbot endpoint - requires authentication
router.post("/", chatbotController);

export default router;
