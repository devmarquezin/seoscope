import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { fetchPage, PageFetchError } from "./pageFetcher.js";

const originalFetch = globalThis.fetch;
const publicUrl = "https://93.184.216.34/page";

function setFetchMock(handler: (url: string) => Response): void {
  globalThis.fetch = (async (input) => {
    const url = input instanceof Request ? input.url : input.toString();
    return handler(url);
  }) as typeof fetch;
}

function isPageFetchErrorWithCode(code: PageFetchError["code"]) {
  return (error: unknown): boolean =>
    error instanceof PageFetchError && error.code === code;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchPage", () => {
  it("rejects protocols other than HTTP and HTTPS", async () => {
    await assert.rejects(
      fetchPage("file:///etc/passwd"),
      isPageFetchErrorWithCode("INVALID_URL"),
    );
  });

  it("blocks local and private IP addresses before fetching", async () => {
    const unsafeUrls = [
      "http://127.0.0.1",
      "http://192.168.1.1",
      "http://[::1]",
    ];

    for (const url of unsafeUrls) {
      await assert.rejects(
        fetchPage(url),
        isPageFetchErrorWithCode("UNSAFE_URL"),
      );
    }
  });

  it("loads an HTML response and returns its metadata", async () => {
    const html = "<html><title>Test page</title></html>";
    setFetchMock(
      () =>
        new Response(html, {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    );

    const result = await fetchPage(publicUrl);

    assert.equal(result.requestedUrl, publicUrl);
    assert.equal(result.finalUrl, publicUrl);
    assert.equal(result.statusCode, 200);
    assert.equal(result.contentType, "text/html; charset=utf-8");
    assert.equal(result.html, html);
    assert.equal(result.sizeInBytes, Buffer.byteLength(html));
  });

  it("follows a redirect to another public URL", async () => {
    let requestCount = 0;
    setFetchMock(() => {
      requestCount += 1;

      if (requestCount === 1) {
        return new Response(null, {
          status: 302,
          headers: { location: "https://93.184.216.35/final" },
        });
      }

      return new Response("<html>Final</html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    });

    const result = await fetchPage(publicUrl);

    assert.equal(requestCount, 2);
    assert.equal(result.finalUrl, "https://93.184.216.35/final");
  });

  it("blocks a redirect to a local address", async () => {
    let requestCount = 0;
    setFetchMock(() => {
      requestCount += 1;
      return new Response(null, {
        status: 302,
        headers: { location: "http://127.0.0.1/internal" },
      });
    });

    await assert.rejects(
      fetchPage(publicUrl),
      isPageFetchErrorWithCode("UNSAFE_URL"),
    );
    assert.equal(requestCount, 1);
  });

  it("stops after the maximum number of redirects", async () => {
    let requestCount = 0;
    setFetchMock(() => {
      requestCount += 1;
      return new Response(null, {
        status: 302,
        headers: { location: publicUrl },
      });
    });

    await assert.rejects(
      fetchPage(publicUrl),
      isPageFetchErrorWithCode("TOO_MANY_REDIRECTS"),
    );
    assert.equal(requestCount, 4);
  });

  it("rejects responses that are not HTML", async () => {
    setFetchMock(
      () =>
        new Response("{}", {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    );

    await assert.rejects(
      fetchPage(publicUrl),
      isPageFetchErrorWithCode("INVALID_CONTENT_TYPE"),
    );
  });

  it("rejects a declared response larger than 2 MB", async () => {
    setFetchMock(
      () =>
        new Response("<html></html>", {
          status: 200,
          headers: {
            "content-type": "text/html",
            "content-length": String(2 * 1024 * 1024 + 1),
          },
        }),
    );

    await assert.rejects(
      fetchPage(publicUrl),
      isPageFetchErrorWithCode("RESPONSE_TOO_LARGE"),
    );
  });

  it("reports an upstream HTTP error", async () => {
    setFetchMock(
      () =>
        new Response("Not found", {
          status: 404,
          headers: { "content-type": "text/html" },
        }),
    );

    await assert.rejects(
      fetchPage(publicUrl),
      isPageFetchErrorWithCode("UPSTREAM_ERROR"),
    );
  });
});
