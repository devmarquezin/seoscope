import { lookup } from "node:dns/promises";
import type { LookupAddress } from "node:dns";
import ipaddr from "ipaddr.js";

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const HTML_CONTENT_TYPES = ["text/html", "application/xhtml+xml"];
const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308]);

export type PageFetchErrorCode =
  | "INVALID_URL"
  | "UNSAFE_URL"
  | "TIMEOUT"
  | "TOO_MANY_REDIRECTS"
  | "UPSTREAM_ERROR"
  | "INVALID_CONTENT_TYPE"
  | "RESPONSE_TOO_LARGE";

export class PageFetchError extends Error {
  constructor(
    public readonly code: PageFetchErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PageFetchError";
  }
}

export interface PageFetchResult {
  requestedUrl: string;
  finalUrl: string;
  statusCode: number;
  contentType: string;
  html: string;
  sizeInBytes: number;
}

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, "").toLowerCase();
}

function isPublicIp(address: string): boolean {
  if (!ipaddr.isValid(address)) {
    return false;
  }

  const parsedAddress = ipaddr.process(address);
  return parsedAddress.range() === "unicast";
}

async function assertSafeUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new PageFetchError(
      "INVALID_URL",
      "A URL deve usar o protocolo HTTP ou HTTPS.",
    );
  }

  if (url.username || url.password) {
    throw new PageFetchError(
      "INVALID_URL",
      "URLs com credenciais não são permitidas.",
    );
  }

  const hostname = normalizeHostname(url.hostname);

  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new PageFetchError("UNSAFE_URL", "A URL aponta para um host local.");
  }

  if (ipaddr.isValid(hostname)) {
    if (!isPublicIp(hostname)) {
      throw new PageFetchError(
        "UNSAFE_URL",
        "A URL aponta para um endereço IP não público.",
      );
    }
    return;
  }

  let addresses: LookupAddress[];

  try {
    addresses = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new PageFetchError(
      "INVALID_URL",
      "Não foi possível resolver o domínio informado.",
    );
  }

  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicIp(address))) {
    throw new PageFetchError(
      "UNSAFE_URL",
      "O domínio aponta para um endereço de rede não público.",
    );
  }
}

function parseContentLength(response: Response): number | undefined {
  const header = response.headers.get("content-length");

  if (!header) {
    return undefined;
  }

  const length = Number(header);
  return Number.isSafeInteger(length) && length >= 0 ? length : undefined;
}

async function readLimitedBody(response: Response): Promise<{
  html: string;
  sizeInBytes: number;
}> {
  const declaredLength = parseContentLength(response);

  if (declaredLength !== undefined && declaredLength > MAX_RESPONSE_BYTES) {
    throw new PageFetchError(
      "RESPONSE_TOO_LARGE",
      "A página excede o limite de 2 MB.",
    );
  }

  if (!response.body) {
    return { html: "", sizeInBytes: 0 };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let html = "";
  let sizeInBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      sizeInBytes += value.byteLength;

      if (sizeInBytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new PageFetchError(
          "RESPONSE_TOO_LARGE",
          "A página excede o limite de 2 MB.",
        );
      }

      html += decoder.decode(value, { stream: true });
    }

    html += decoder.decode();
    return { html, sizeInBytes };
  } finally {
    reader.releaseLock();
  }
}

export async function fetchPage(rawUrl: string): Promise<PageFetchResult> {
  let currentUrl: URL;

  try {
    currentUrl = new URL(rawUrl);
  } catch {
    throw new PageFetchError("INVALID_URL", "Informe uma URL válida.");
  }

  const requestedUrl = currentUrl.toString();
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  try {
    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
      await assertSafeUrl(currentUrl);

      const response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal,
        headers: {
          accept: "text/html,application/xhtml+xml",
          "user-agent": "SeoScope/0.1 (+technical SEO analysis)",
        },
      });

      if (REDIRECT_STATUS_CODES.has(response.status)) {
        const location = response.headers.get("location");
        await response.body?.cancel();

        if (!location) {
          throw new PageFetchError(
            "UPSTREAM_ERROR",
            "A página retornou um redirecionamento sem destino.",
          );
        }

        if (redirectCount === MAX_REDIRECTS) {
          throw new PageFetchError(
            "TOO_MANY_REDIRECTS",
            `A página excedeu o limite de ${MAX_REDIRECTS} redirecionamentos.`,
          );
        }

        currentUrl = new URL(location, currentUrl);
        continue;
      }

      if (!response.ok) {
        await response.body?.cancel();
        throw new PageFetchError(
          "UPSTREAM_ERROR",
          `A página respondeu com o status HTTP ${response.status}.`,
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      const isHtml = HTML_CONTENT_TYPES.some((type) =>
        contentType.toLowerCase().includes(type),
      );

      if (!isHtml) {
        await response.body?.cancel();
        throw new PageFetchError(
          "INVALID_CONTENT_TYPE",
          "A URL não retornou um documento HTML.",
        );
      }

      const { html, sizeInBytes } = await readLimitedBody(response);

      return {
        requestedUrl,
        finalUrl: currentUrl.toString(),
        statusCode: response.status,
        contentType,
        html,
        sizeInBytes,
      };
    }
  } catch (error) {
    if (error instanceof PageFetchError) {
      throw error;
    }

    if (signal.aborted) {
      throw new PageFetchError(
        "TIMEOUT",
        `A página não respondeu em até ${REQUEST_TIMEOUT_MS / 1_000} segundos.`,
      );
    }

    throw new PageFetchError(
      "UPSTREAM_ERROR",
      "Não foi possível acessar a página informada.",
    );
  }

  throw new PageFetchError(
    "TOO_MANY_REDIRECTS",
    `A página excedeu o limite de ${MAX_REDIRECTS} redirecionamentos.`,
  );
}
