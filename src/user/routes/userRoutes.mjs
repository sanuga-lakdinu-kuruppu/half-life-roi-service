import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
} from "../controller/userController.mjs";
import { authenticateToken } from "../../common/auth.mjs";

const router = express.Router();

// POST /users - Create a new user (public endpoint)
router.post("/", createUserController);

// GET /users - Get all users (protected endpoint - requires authentication)
router.get("/", authenticateToken, getAllUsersController);

// GET /users/:userId - Get user by ID (protected endpoint - requires authentication)
router.get("/:userId", authenticateToken, getUserByIdController);

export default router;
