import express from "express";
import { 
  createUserController, 
  getAllUsersController, 
  getUserByIdController 
} from "../controller/userController.mjs";

const router = express.Router();

// POST /api/users - Create a new user
router.post("/", createUserController);

// GET /api/users - Get all users
router.get("/", getAllUsersController);

// GET /api/users/:userId - Get user by ID
router.get("/:userId", getUserByIdController);

export default router; 