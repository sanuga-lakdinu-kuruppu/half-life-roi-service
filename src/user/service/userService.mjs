import { User } from "../model/userModel.mjs";
import { Quiz } from "../../quiz/model/quizModel.mjs";
import { v4 as uuidv4 } from "uuid";
import { generateAccessToken } from "../../common/util.mjs";
import {
  generateMCQQuestions,
  generateFallbackQuestions,
} from "../../common/chatgptService.mjs";

export const createUser = async (userData) => {
  try {
    // Generate a unique userId
    const userId = uuidv4();

    // Create new user with generated userId and provided name
    const newUser = new User({
      userId,
      name: userData.name,
    });

    // Save the user to database
    const savedUser = await newUser.save();

    // Generate MCQ questions using ChatGPT
    const questionsResult = await generateMCQQuestions(userData.name);

    let questions;
    if (questionsResult.success) {
      questions = questionsResult.questions;
      console.log(
        `Generated ${questions.length} questions via ChatGPT for user: ${userData.name}`
      );
    } else {
      console.log(
        `ChatGPT failed, using fallback questions: ${questionsResult.error}`
      );
      // Use fallback questions if ChatGPT fails
      const fallbackResult = generateFallbackQuestions(userData.name);
      questions = fallbackResult.questions;
    }

    // Create quiz for the user
    const newQuiz = new Quiz({
      userId,
      questions: questions,
    });

    // Save the quiz to database
    await newQuiz.save();
    console.log(`Quiz created for user: ${userData.name}`);

    // Generate access token for the new user
    const accessToken = generateAccessToken(userId);

    return {
      success: true,
      data: savedUser,
      accessToken,
      quizCreated: true,
      questionsCount: questions.length,
      message: "User created successfully with quiz questions",
    };
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return {
        success: false,
        message: "User with this userId already exists",
        error: "DUPLICATE_USER",
      };
    }

    return {
      success: false,
      message: "Failed to create user",
      error: error.message,
    };
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return {
      success: true,
      data: users,
      message: "Users retrieved successfully",
    };
  } catch (error) {
    console.error("Error retrieving users:", error);
    return {
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    };
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    return {
      success: true,
      data: user,
      message: "User retrieved successfully",
    };
  } catch (error) {
    console.error("Error retrieving user:", error);
    return {
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    };
  }
};
