import express from "express";
import { analysisRouter } from "./routes/analysisRoutes.js";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use("/api", analysisRouter);

app.use((_request, response) => {
  response.status(404).json({
    error: "not_found",
    message: "Rota não encontrada.",
  });
});
