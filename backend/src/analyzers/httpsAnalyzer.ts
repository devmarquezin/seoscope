import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 5;

export function analyzeHttps(rawUrl: string): SEOCheckResult {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return {
      id: "https",
      name: "HTTPS",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "Não foi possível identificar o protocolo da página.",
      recommendation: "Use uma URL válida com o protocolo HTTPS.",
      details: { url: rawUrl, protocol: null },
    };
  }

  const details = { url: url.toString(), protocol: url.protocol };

  if (url.protocol !== "https:") {
    return {
      id: "https",
      name: "HTTPS",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A página não está sendo entregue por HTTPS.",
      recommendation:
        "Disponibilize a página por HTTPS e redirecione a versão HTTP.",
      details,
    };
  }

  return {
    id: "https",
    name: "HTTPS",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "A página está sendo entregue por HTTPS.",
    details,
  };
}
