import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { describe, it } from "node:test";
import { createApp } from "./app.js";
import {
  PageFetchError,
  type PageFetcher,
} from "./services/pageFetcher.js";
import type { SEOAnalysis } from "./types/analysis.js";

interface TestResponse {
  status: number;
  body: unknown;
}

async function requestApp(
  pageFetcher: PageFetcher,
  path: string,
  init?: RequestInit,
): Promise<TestResponse> {
  const app = createApp(pageFetcher);
  const server = await new Promise<Server>((resolve, reject) => {
    const runningServer = app.listen(0, () => resolve(runningServer));
    runningServer.once("error", reject);
  });

  try {
    const address = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, init);

    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

const completeHtml = `
  <html>
    <head>
      <title>Análise técnica completa para páginas web</title>
      <meta name="description" content="${"A".repeat(80)}">
      <link rel="canonical" href="https://example.com/final">
      <meta property="og:title" content="SeoScope">
      <meta property="og:description" content="Análise técnica de SEO">
      <meta property="og:image" content="https://example.com/image.png">
      <meta property="og:url" content="https://example.com/final">
    </head>
    <body>
      <h1>Relatório de SEO</h1>
      <h2>Resumo</h2>
      <img src="chart.png" alt="Gráfico do relatório">
    </body>
  </html>
`;

describe("POST /api/analyze", () => {
  it("runs the complete analysis and returns the final contract", async () => {
    const pageFetcher: PageFetcher = async (url) => {
      assert.equal(url, "http://example.com");

      return {
        requestedUrl: "http://example.com/",
        finalUrl: "https://example.com/final",
        statusCode: 200,
        contentType: "text/html; charset=utf-8",
        html: completeHtml,
        sizeInBytes: Buffer.byteLength(completeHtml),
      };
    };

    const response = await requestApp(pageFetcher, "/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "http://example.com" }),
    });
    const body = response.body as SEOAnalysis;

    assert.equal(response.status, 200);
    assert.equal(body.url, "http://example.com/");
    assert.equal(body.finalUrl, "https://example.com/final");
    assert.equal(body.score, 100);
    assert.equal(body.status, "excellent");
    assert.deepEqual(body.summary, { passed: 8, warnings: 0, errors: 0 });
    assert.equal(body.results.length, 8);
    assert.equal(body.results.at(-1)?.id, "https");
    assert.equal(body.results.at(-1)?.status, "success");
  });

  it("rejects an invalid URL before calling the page fetcher", async () => {
    let fetcherWasCalled = false;
    const pageFetcher: PageFetcher = async () => {
      fetcherWasCalled = true;
      throw new Error("The fetcher should not be called");
    };

    const response = await requestApp(pageFetcher, "/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "file:///etc/passwd" }),
    });

    assert.equal(response.status, 400);
    assert.equal(fetcherWasCalled, false);
    assert.equal(
      (response.body as { error: string }).error,
      "invalid_request",
    );
  });

  it("maps page fetch errors to the expected HTTP responses", async () => {
    const cases = [
      { code: "UNSAFE_URL" as const, expectedStatus: 400 },
      { code: "TIMEOUT" as const, expectedStatus: 504 },
      { code: "INVALID_CONTENT_TYPE" as const, expectedStatus: 502 },
    ];

    for (const { code, expectedStatus } of cases) {
      const pageFetcher: PageFetcher = async () => {
        throw new PageFetchError(code, "Test error");
      };
      const response = await requestApp(pageFetcher, "/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: "https://example.com" }),
      });

      assert.equal(response.status, expectedStatus);
      assert.equal(
        (response.body as { error: string }).error,
        code.toLowerCase(),
      );
    }
  });

  it("returns 500 for an unexpected internal error", async () => {
    const pageFetcher: PageFetcher = async () => {
      throw new Error("Unexpected test error");
    };
    const response = await requestApp(pageFetcher, "/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
    });

    assert.equal(response.status, 500);
    assert.equal(
      (response.body as { error: string }).error,
      "internal_error",
    );
  });
});

describe("fallback route", () => {
  it("returns JSON with status 404", async () => {
    const pageFetcher: PageFetcher = async () => {
      throw new Error("The fetcher should not be called");
    };
    const response = await requestApp(pageFetcher, "/", { method: "GET" });

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      error: "not_found",
      message: "Rota não encontrada.",
    });
  });
});
