import { User } from "../model/userModel.mjs";
import { v4 as uuidv4 } from "uuid";
import { generateAccessToken } from "../../common/util.mjs";

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

    // Generate access token for the new user
    const accessToken = generateAccessToken(userId);

    return {
      success: true,
      data: savedUser,
      accessToken,
      message: "User created successfully",
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
