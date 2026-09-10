import { Router } from "express";
import { createAnalyzePage } from "../controllers/analysisController.js";
import type { PageFetcher } from "../services/pageFetcher.js";

export function createAnalysisRouter(pageFetcher?: PageFetcher): Router {
  const analysisRouter = Router();

  analysisRouter.post("/analyze", createAnalyzePage(pageFetcher));

  return analysisRouter;
}
