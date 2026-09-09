import { load } from "cheerio";
import { analyzeTitle } from "../analyzers/titleAnalyzer.js";
import type { SEOCheckResult } from "../types/analysis.js";

export function analyzeSeo(html: string): SEOCheckResult[] {
  const $ = load(html);

  return [analyzeTitle($)];
}
