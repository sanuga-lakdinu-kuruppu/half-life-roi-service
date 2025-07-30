import { createUser, getAllUsers, getUserById } from "../service/userService.mjs";

export const createUserController = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be a non-empty string"
      });
    }

    // Call service to create user
    const result = await createUser({ name: name.trim() });

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          userId: result.data.userId,
          name: result.data.name,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Controller error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const result = await getAllUsers();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Controller error getting users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await getUserById(userId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      if (result.error === "USER_NOT_FOUND") {
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
    console.error("Controller error getting user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
}; 