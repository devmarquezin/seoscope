import type {
  AnalysisStatus,
  AnalysisSummary,
  SEOCheckResult,
} from "../types/analysis.js";

const MIN_SCORE = 0;
const MAX_SCORE = 100;

export function calculateScore(results: SEOCheckResult[]): number {
  const total = results.reduce((sum, result) => sum + result.score, 0);
  const roundedTotal = Math.round(total);

  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, roundedTotal));
}

export function classifyScore(score: number): AnalysisStatus {
  if (score >= 90) {
    return "excellent";
  }

  if (score >= 75) {
    return "good";
  }

  if (score >= 50) {
    return "needs-improvement";
  }

  return "critical";
}

export function createSummary(results: SEOCheckResult[]): AnalysisSummary {
  return results.reduce<AnalysisSummary>(
    (summary, result) => {
      if (result.status === "success") {
        summary.passed += 1;
      } else if (result.status === "warning") {
        summary.warnings += 1;
      } else {
        summary.errors += 1;
      }

      return summary;
    },
    { passed: 0, warnings: 0, errors: 0 },
  );
}
