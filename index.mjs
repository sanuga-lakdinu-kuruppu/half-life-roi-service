import express from "express";
import cors from "cors";
import awsServerlessExpress from "aws-serverless-express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/health", (request, response) => {
  return response.send({ msg: "hello suchitra, sanuga" });
});

app.post("/api/calculate", (req, res) => {
  const {
    isotope,
    costPerKg,
    creationMethod,
    initialCostPerKg,
    localPrice,
    internationalPrice,
    localDemandKg,
    factoryCapacityKg
  } = req.body;

  if (
    !isotope ||
    typeof costPerKg !== "number" ||
    !creationMethod ||
    typeof initialCostPerKg !== "number" ||
    typeof localPrice !== "number" ||
    typeof internationalPrice !== "number" ||
    typeof localDemandKg !== "number" ||
    typeof factoryCapacityKg !== "number"
  ) {
    return res.status(400).json({ error: "Invalid input. Please provide all required fields with correct types." });
  }

  // How much of the local demand can be met by the factory
  const inlandSupplyPercentage = Math.min((factoryCapacityKg / localDemandKg) * 100, 100);

  // Calculate excess for export
  let exportProfit = 0;
  let excessKg = 0;
  if (factoryCapacityKg > localDemandKg) {
    excessKg = factoryCapacityKg - localDemandKg;
    const profitPerKg = internationalPrice - (costPerKg + initialCostPerKg);
    exportProfit = excessKg * profitPerKg;
  }

  return res.json({
    isotope,
    inlandSupplyPercentage,
    inlandSuppliedKg: Math.min(factoryCapacityKg, localDemandKg),
    excessKg,
    exportProfit
  });
});

// const PORT = process.env.PORT || 6005;
// app.listen(PORT, () => {
//   console.log(`half-life-roi-service is up and running on port ${PORT} :)`);
// });

const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
