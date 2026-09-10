import type { Request, Response } from "express";
import { z } from "zod";
import { fetchPage, PageFetchError } from "../services/pageFetcher.js";
import { analyzeSeo } from "../services/seoAnalyzer.js";

const analyzeRequestSchema = z.object({
  url: z
    .url("Informe uma URL válida.")
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    }, "A URL deve usar o protocolo HTTP ou HTTPS."),
});

function statusForPageFetchError(error: PageFetchError): number {
  if (error.code === "INVALID_URL" || error.code === "UNSAFE_URL") {
    return 400;
  }

  if (error.code === "TIMEOUT") {
    return 504;
  }

  return 502;
}

export async function analyzePage(
  request: Request,
  response: Response,
): Promise<void> {
  const parsedBody = analyzeRequestSchema.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      error: "invalid_request",
      message: "Não foi possível validar a requisição.",
      issues: parsedBody.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const page = await fetchPage(parsedBody.data.url);
    const results = analyzeSeo(page.html);

    response.status(200).json({
      url: page.requestedUrl,
      finalUrl: page.finalUrl,
      statusCode: page.statusCode,
      contentType: page.contentType,
      sizeInBytes: page.sizeInBytes,
      results,
      message: "Análise parcial concluída: 2 de 8 verificações implementadas.",
    });
  } catch (error) {
    if (error instanceof PageFetchError) {
      response.status(statusForPageFetchError(error)).json({
        error: error.code.toLowerCase(),
        message: error.message,
      });
      return;
    }

    response.status(500).json({
      error: "internal_error",
      message: "Ocorreu um erro interno inesperado.",
    });
  }
}
