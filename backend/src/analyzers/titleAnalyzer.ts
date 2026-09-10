import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 20;
const MIN_RECOMMENDED_LENGTH = 30;
const MAX_RECOMMENDED_LENGTH = 60;

export function analyzeTitle($: CheerioAPI): SEOCheckResult {
  const titleElement = $("title").first();

  if (titleElement.length === 0) {
    return {
      id: "title",
      name: "Title",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A página não possui uma tag <title>.",
      recommendation: "Adicione um título descritivo e exclusivo à página.",
      details: { title: null, length: 0 },
    };
  }

  const title = titleElement.text().replace(/\s+/g, " ").trim();
  const length = title.length;

  if (length === 0) {
    return {
      id: "title",
      name: "Title",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A tag <title> está vazia.",
      recommendation: "Preencha o título com uma descrição clara da página.",
      details: { title, length },
    };
  }

  if (length < MIN_RECOMMENDED_LENGTH) {
    return {
      id: "title",
      name: "Title",
      status: "warning",
      score: 10,
      maxScore: MAX_SCORE,
      message: `O título tem ${length} caracteres e pode ser pouco descritivo.`,
      recommendation: `Considere usar entre ${MIN_RECOMMENDED_LENGTH} e ${MAX_RECOMMENDED_LENGTH} caracteres.`,
      details: { title, length },
    };
  }

  if (length > MAX_RECOMMENDED_LENGTH) {
    return {
      id: "title",
      name: "Title",
      status: "warning",
      score: 10,
      maxScore: MAX_SCORE,
      message: `O título tem ${length} caracteres e pode ser truncado nos resultados de busca.`,
      recommendation: `Considere usar entre ${MIN_RECOMMENDED_LENGTH} e ${MAX_RECOMMENDED_LENGTH} caracteres.`,
      details: { title, length },
    };
  }

  return {
    id: "title",
    name: "Title",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: `O título está presente e tem ${length} caracteres.`,
    details: { title, length },
  };
}
