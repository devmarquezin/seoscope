import { load } from "cheerio";
import { analyzeDescription } from "../analyzers/descriptionAnalyzer.js";
import { analyzeH1 } from "../analyzers/h1Analyzer.js";
import { analyzeHeadings } from "../analyzers/headingAnalyzer.js";
import { analyzeImages } from "../analyzers/imageAnalyzer.js";
import { analyzeTitle } from "../analyzers/titleAnalyzer.js";
import type { SEOCheckResult } from "../types/analysis.js";

export function analyzeSeo(html: string): SEOCheckResult[] {
  const $ = load(html);

  return [
    analyzeTitle($),
    analyzeDescription($),
    analyzeH1($),
    analyzeHeadings($),
    analyzeImages($),
  ];
}
