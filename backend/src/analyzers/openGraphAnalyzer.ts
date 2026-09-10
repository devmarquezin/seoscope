import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 10;
const REQUIRED_PROPERTIES = [
  "og:title",
  "og:description",
  "og:image",
  "og:url",
] as const;

type OpenGraphProperty = (typeof REQUIRED_PROPERTIES)[number];

function getPropertyValue(
  $: CheerioAPI,
  property: OpenGraphProperty,
): { found: boolean; value: string | null } {
  const elements = $("meta[property]").filter(
    (_, element) =>
      ($(element).attr("property") ?? "").toLowerCase() === property,
  );

  if (elements.length === 0) {
    return { found: false, value: null };
  }

  const values = elements
    .toArray()
    .map((element) => ($(element).attr("content") ?? "").trim());
  const filledValue = values.find((value) => value.length > 0);

  return { found: true, value: filledValue ?? "" };
}

export function analyzeOpenGraph($: CheerioAPI): SEOCheckResult {
  const values: Record<OpenGraphProperty, string | null> = {
    "og:title": null,
    "og:description": null,
    "og:image": null,
    "og:url": null,
  };
  const missing: OpenGraphProperty[] = [];
  const empty: OpenGraphProperty[] = [];
  let present = 0;

  for (const property of REQUIRED_PROPERTIES) {
    const result = getPropertyValue($, property);
    values[property] = result.value;

    if (!result.found) {
      missing.push(property);
    } else if (!result.value) {
      empty.push(property);
    } else {
      present += 1;
    }
  }

  const details = {
    required: [...REQUIRED_PROPERTIES],
    present,
    missing,
    empty,
    values,
  };

  if (present === 0) {
    return {
      id: "open-graph",
      name: "Open Graph",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "Nenhuma propriedade Open Graph obrigatória está preenchida.",
      recommendation:
        "Adicione og:title, og:description, og:image e og:url com conteúdos válidos.",
      details,
    };
  }

  if (present < REQUIRED_PROPERTIES.length) {
    const score = Math.round(
      (present / REQUIRED_PROPERTIES.length) * MAX_SCORE,
    );

    return {
      id: "open-graph",
      name: "Open Graph",
      status: "warning",
      score,
      maxScore: MAX_SCORE,
      message: `${present} de ${REQUIRED_PROPERTIES.length} propriedades Open Graph estão preenchidas.`,
      recommendation:
        "Preencha todas as propriedades Open Graph obrigatórias para melhorar o compartilhamento da página.",
      details,
    };
  }

  return {
    id: "open-graph",
    name: "Open Graph",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "Todas as propriedades Open Graph obrigatórias estão preenchidas.",
    details,
  };
}
