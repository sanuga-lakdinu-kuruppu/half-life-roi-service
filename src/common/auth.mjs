import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../user/model/userModel.mjs";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
        error: "MISSING_TOKEN",
      });
    }

    // Step 1: Verify the JWT token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(403).json({
        success: false,
        message: "Invalid token format",
        error: "INVALID_TOKEN_FORMAT",
      });
    }

    // Step 2: Extract userId from token
    const { userId } = decoded;

    // Step 3: Fetch user from database
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found in database",
        error: "USER_NOT_FOUND",
      });
    }

    // Step 4: Attach complete user object to request
    req.user = {
      userId: user.userId,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      _id: user._id,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
        error: "INVALID_TOKEN",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token has expired",
        error: "TOKEN_EXPIRED",
      });
    }

    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: "AUTHENTICATION_ERROR",
    });
  }
};

export const verifyToken = async (token) => {
  try {
    // Step 1: Verify the JWT token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded.userId) {
      return { success: false, error: "Invalid token format" };
    }

    // Step 2: Extract userId and fetch user from database
    const { userId } = decoded;
    const user = await User.findOne({ userId });

    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    // Step 3: Return complete user object
    return {
      success: true,
      user: {
        userId: user.userId,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        _id: user._id,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
