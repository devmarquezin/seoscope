import { Router } from "express";
import { analyzePage } from "../controllers/analysisController.js";

export const analysisRouter = Router();

analysisRouter.post("/analyze", analyzePage);
