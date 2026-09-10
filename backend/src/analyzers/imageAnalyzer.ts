import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 15;

interface MissingAltImage {
  index: number;
  src: string | null;
}

export function analyzeImages($: CheerioAPI): SEOCheckResult {
  const images = $("img");
  const total = images.length;
  const missingAltImages: MissingAltImage[] = [];
  let withAlt = 0;
  let emptyAlt = 0;

  images.each((index, element) => {
    const image = $(element);
    const alt = image.attr("alt");

    if (alt === undefined) {
      missingAltImages.push({
        index: index + 1,
        src: image.attr("src") ?? null,
      });
      return;
    }

    withAlt += 1;

    if (alt.trim().length === 0) {
      emptyAlt += 1;
    }
  });

  const withoutAlt = missingAltImages.length;
  const details = {
    total,
    withAlt,
    emptyAlt,
    withoutAlt,
    missingAltImages,
  };

  if (total === 0) {
    return {
      id: "image-alt",
      name: "Image Alt Text",
      status: "success",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: "A página não possui imagens para verificar.",
      details,
    };
  }

  if (withoutAlt === 0) {
    const message =
      total === 1
        ? "A imagem possui o atributo alt."
        : `Todas as ${total} imagens possuem o atributo alt.`;

    return {
      id: "image-alt",
      name: "Image Alt Text",
      status: "success",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message,
      details,
    };
  }

  if (withAlt === 0) {
    const message =
      total === 1
        ? "A imagem não possui o atributo alt."
        : `Nenhuma das ${total} imagens possui o atributo alt.`;

    return {
      id: "image-alt",
      name: "Image Alt Text",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message,
      recommendation:
        "Adicione textos alternativos às imagens informativas e alt vazio às imagens decorativas.",
      details,
    };
  }

  const score = Math.round((withAlt / total) * MAX_SCORE);

  return {
    id: "image-alt",
    name: "Image Alt Text",
    status: "warning",
    score,
    maxScore: MAX_SCORE,
    message: `${withoutAlt} de ${total} imagens não possuem o atributo alt.`,
    recommendation:
      "Adicione textos alternativos às imagens informativas e alt vazio às imagens decorativas.",
    details,
  };
}
