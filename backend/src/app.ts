import express from "express";
import { createAnalysisRouter } from "./routes/analysisRoutes.js";
import type { PageFetcher } from "./services/pageFetcher.js";

export function createApp(pageFetcher?: PageFetcher) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));
  app.use("/api", createAnalysisRouter(pageFetcher));

  app.use((_request, response) => {
    response.status(404).json({
      error: "not_found",
      message: "Rota não encontrada.",
    });
  });

  return app;
}

export const app = createApp();
