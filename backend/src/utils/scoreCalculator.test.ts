import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  AnalysisStatus,
  SEOCheckResult,
  SEOCheckStatus,
} from "../types/analysis.js";
import {
  calculateScore,
  classifyScore,
  createSummary,
} from "./scoreCalculator.js";

function createResult(
  status: SEOCheckStatus,
  score: number,
): SEOCheckResult {
  return {
    id: `${status}-${score}`,
    name: "Test check",
    status,
    score,
    maxScore: score,
    message: "Test result",
  };
}

describe("calculateScore", () => {
  it("sums and rounds the individual check scores", () => {
    const results = [
      createResult("success", 20),
      createResult("warning", 7.5),
      createResult("error", 0),
    ];

    assert.equal(calculateScore(results), 28);
  });

  it("keeps the final score between 0 and 100", () => {
    assert.equal(calculateScore([createResult("success", 120)]), 100);
    assert.equal(calculateScore([createResult("error", -10)]), 0);
  });
});

describe("classifyScore", () => {
  it("classifies every boundary defined by the product", () => {
    const cases: Array<[number, AnalysisStatus]> = [
      [0, "critical"],
      [49, "critical"],
      [50, "needs-improvement"],
      [74, "needs-improvement"],
      [75, "good"],
      [89, "good"],
      [90, "excellent"],
      [100, "excellent"],
    ];

    for (const [score, expectedStatus] of cases) {
      assert.equal(classifyScore(score), expectedStatus);
    }
  });
});

describe("createSummary", () => {
  it("counts successes, warnings and errors", () => {
    const results = [
      createResult("success", 20),
      createResult("success", 15),
      createResult("warning", 5),
      createResult("error", 0),
    ];

    assert.deepEqual(createSummary(results), {
      passed: 2,
      warnings: 1,
      errors: 1,
    });
  });

  it("returns an empty summary when there are no results", () => {
    assert.deepEqual(createSummary([]), {
      passed: 0,
      warnings: 0,
      errors: 0,
    });
  });
});
