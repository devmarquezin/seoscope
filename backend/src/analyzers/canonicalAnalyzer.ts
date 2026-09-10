import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 10;
const WARNING_SCORE = 5;

function hasCanonicalRel(rel: string): boolean {
  return rel
    .split(/\s+/)
    .some((value) => value.toLowerCase() === "canonical");
}

export function analyzeCanonical($: CheerioAPI): SEOCheckResult {
  const canonicalElements = $("link[rel]").filter((_, element) =>
    hasCanonicalRel($(element).attr("rel") ?? ""),
  );
  const urls = canonicalElements
    .toArray()
    .map((element) => {
      const href = $(element).attr("href");
      return href === undefined ? null : href.trim();
    });
  const count = canonicalElements.length;
  const emptyCount = urls.filter((url) => !url).length;
  const details = { count, urls, emptyCount };

  if (count === 0) {
    return {
      id: "canonical",
      name: "Canonical",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A página não possui uma URL canonical.",
      recommendation:
        "Adicione uma tag link com rel canonical e um href preenchido.",
      details,
    };
  }

  if (emptyCount === count) {
    return {
      id: "canonical",
      name: "Canonical",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message:
        count === 1
          ? "A tag canonical não possui uma URL preenchida."
          : "As tags canonical não possuem URLs preenchidas.",
      recommendation: "Preencha o href de uma única tag canonical.",
      details,
    };
  }

  if (count > 1) {
    return {
      id: "canonical",
      name: "Canonical",
      status: "warning",
      score: WARNING_SCORE,
      maxScore: MAX_SCORE,
      message: `A página possui ${count} tags canonical.`,
      recommendation:
        "Mantenha apenas uma tag canonical com uma URL claramente definida.",
      details,
    };
  }

  return {
    id: "canonical",
    name: "Canonical",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "A página possui uma única URL canonical preenchida.",
    details,
  };
}
