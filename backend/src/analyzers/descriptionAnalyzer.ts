import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 15;
const WARNING_SCORE = 8;
const MIN_RECOMMENDED_LENGTH = 70;
const MAX_RECOMMENDED_LENGTH = 160;

export function analyzeDescription($: CheerioAPI): SEOCheckResult {
  const descriptionElement = $("meta[name]")
    .filter((_, element) =>
      ($(element).attr("name") ?? "").toLowerCase() === "description",
    )
    .first();

  if (descriptionElement.length === 0) {
    return {
      id: "meta-description",
      name: "Meta Description",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A página não possui uma meta description.",
      recommendation:
        "Adicione uma meta description que resuma o conteúdo da página.",
      details: { description: null, length: 0 },
    };
  }

  const description = (descriptionElement.attr("content") ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const length = description.length;

  if (length === 0) {
    return {
      id: "meta-description",
      name: "Meta Description",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A meta description está vazia.",
      recommendation:
        "Preencha a meta description com um resumo claro da página.",
      details: { description, length },
    };
  }

  if (length < MIN_RECOMMENDED_LENGTH) {
    return {
      id: "meta-description",
      name: "Meta Description",
      status: "warning",
      score: WARNING_SCORE,
      maxScore: MAX_SCORE,
      message: `A meta description tem ${length} caracteres e pode ser pouco informativa.`,
      recommendation: `Considere usar entre ${MIN_RECOMMENDED_LENGTH} e ${MAX_RECOMMENDED_LENGTH} caracteres.`,
      details: { description, length },
    };
  }

  if (length > MAX_RECOMMENDED_LENGTH) {
    return {
      id: "meta-description",
      name: "Meta Description",
      status: "warning",
      score: WARNING_SCORE,
      maxScore: MAX_SCORE,
      message: `A meta description tem ${length} caracteres e pode ser truncada nos resultados de busca.`,
      recommendation: `Considere usar entre ${MIN_RECOMMENDED_LENGTH} e ${MAX_RECOMMENDED_LENGTH} caracteres.`,
      details: { description, length },
    };
  }

  return {
    id: "meta-description",
    name: "Meta Description",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: `A meta description está presente e tem ${length} caracteres.`,
    details: { description, length },
  };
}
