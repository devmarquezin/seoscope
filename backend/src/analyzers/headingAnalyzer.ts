import type { CheerioAPI } from "cheerio";
import type { SEOCheckResult } from "../types/analysis.js";

const MAX_SCORE = 10;
const WARNING_SCORE = 5;

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = `h${HeadingLevel}`;

interface HeadingItem {
  level: HeadingLevel;
  tag: HeadingTag;
  text: string;
}

interface SkippedLevel {
  from: HeadingTag;
  to: HeadingTag;
  position: number;
  missing: HeadingTag[];
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function getMissingTags(from: HeadingLevel, to: HeadingLevel): HeadingTag[] {
  return Array.from(
    { length: to - from - 1 },
    (_, index) => `h${from + index + 1}` as HeadingTag,
  );
}

export function analyzeHeadings($: CheerioAPI): SEOCheckResult {
  const counts: Record<HeadingTag, number> = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  };

  const outline = $("h1, h2, h3, h4, h5, h6")
    .map((_, element): HeadingItem => {
      const tagName = $(element).prop("tagName");

      if (!tagName) {
        throw new Error("Não foi possível identificar o nível do heading.");
      }

      const tag = tagName.toLowerCase() as HeadingTag;
      const level = Number(tag.slice(1)) as HeadingLevel;
      const text = normalizeText($(element).text());

      counts[tag] += 1;
      return { level, tag, text };
    })
    .get();

  if (outline.length === 0) {
    return {
      id: "heading-hierarchy",
      name: "Heading Hierarchy",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "A página não possui headings entre H1 e H6.",
      recommendation:
        "Organize o conteúdo com headings que representem suas seções e subseções.",
      details: { total: 0, counts, outline, skippedLevels: [] },
    };
  }

  const skippedLevels: SkippedLevel[] = [];

  for (let index = 1; index < outline.length; index += 1) {
    const previous = outline[index - 1];
    const current = outline[index];

    if (previous && current && current.level > previous.level + 1) {
      skippedLevels.push({
        from: previous.tag,
        to: current.tag,
        position: index + 1,
        missing: getMissingTags(previous.level, current.level),
      });
    }
  }

  if (skippedLevels.length > 0) {
    const issueLabel = skippedLevels.length === 1 ? "salto" : "saltos";

    return {
      id: "heading-hierarchy",
      name: "Heading Hierarchy",
      status: "warning",
      score: WARNING_SCORE,
      maxScore: MAX_SCORE,
      message: `A hierarquia possui ${skippedLevels.length} ${issueLabel} de nível.`,
      recommendation:
        "Evite pular níveis ao avançar para uma subseção, como de H2 diretamente para H4.",
      details: {
        total: outline.length,
        counts,
        outline,
        skippedLevels,
      },
    };
  }

  const headingLabel = outline.length === 1 ? "heading" : "headings";

  return {
    id: "heading-hierarchy",
    name: "Heading Hierarchy",
    status: "success",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: `A página possui ${outline.length} ${headingLabel} sem saltos de nível.`,
    details: {
      total: outline.length,
      counts,
      outline,
      skippedLevels,
    },
  };
}
