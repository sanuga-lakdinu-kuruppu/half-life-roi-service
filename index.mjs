import express from "express";
import cors from "cors";
import awsServerlessExpress from "aws-serverless-express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./src/user/routes/userRoutes.mjs";
import quizRoutes from "./src/quiz/routes/quizRoutes.mjs";
import chatbotRoutes from "./src/chatbot/routes/chatbotRoutes.mjs";
import createConnection from "./src/database/db.mjs";

const app = express();
createConnection();

dotenv.config();

app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/health", (request, response) => {
  return response.send({ msg: "hello suchitra, sanuga" });
});

// User routes
app.use("/users", userRoutes);

// Quiz routes
app.use("/quiz", quizRoutes);

// Chatbot routes
app.use("/chatbot", chatbotRoutes);

// const PORT = process.env.PORT || 6005;
// app.listen(PORT, () => {
//   console.log(`half-life-roi-service is up and running on port ${PORT} :)`);
// });

const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
