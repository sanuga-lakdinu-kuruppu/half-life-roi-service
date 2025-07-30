import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

const MONGO_URI = process.env.MONGO_URI;

const createConnection = async () => {
  if (isConnected) {
    console.log("using cached database connection.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 20000,
    });

    isConnected = true;
    console.log("database connection success.");

    return db;
  } catch (error) {
    console.error("database connection error:", error.message);
    throw error;
  }
};

export default createConnection;
