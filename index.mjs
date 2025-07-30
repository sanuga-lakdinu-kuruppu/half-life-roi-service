import express from "express";
import cors from "cors";
import awsServerlessExpress from "aws-serverless-express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/health", (request, response) => {
  return response.send({ msg: "hello suchitra" });
});

// const PORT = process.env.PORT || 6005;
// app.listen(PORT, () => {
//   console.log(`half-life-roi-service is up and running on port ${PORT} :)`);
// });

const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
