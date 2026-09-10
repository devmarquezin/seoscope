import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 15;
const WARNING_SCORE = 8;

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function analyzeH1($: CheerioAPI): SEOCheckResult {
  const h1Elements = $("h1");
  const count = h1Elements.length;
  const headings = h1Elements
    .map((_, element) => normalizeText($(element).text()))
    .get();

  if (count === 0) {
    return {
      id: "h1",
      name: "H1",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A página não possui um heading H1.",
      recommendation: "Adicione um H1 que descreva o assunto principal da página.",
      details: { count, headings },
    };
  }

  if (headings.every((heading) => heading.length === 0)) {
    return {
      id: "h1",
      name: "H1",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: count === 1 ? "O heading H1 está vazio." : "Os headings H1 estão vazios.",
      recommendation: "Preencha um H1 com o assunto principal da página.",
      details: { count, headings },
    };
  }

  if (count > 1) {
    return {
      id: "h1",
      name: "H1",
      status: "warning",
      score: WARNING_SCORE,
      maxScore: MAX_SCORE,
      message: `A página possui ${count} headings H1.`,
      recommendation:
        "Considere manter um único H1 principal para tornar a estrutura da página mais clara.",
      details: { count, headings },
    };
  }

  return {
    id: "h1",
    name: "H1",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "A página possui um único H1 preenchido.",
    details: { count, headings },
  };
}
