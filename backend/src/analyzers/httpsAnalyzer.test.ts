import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeHttps } from "./httpsAnalyzer.js";

describe("analyzeHttps", () => {
  it("returns success for an HTTPS URL", () => {
    const result = analyzeHttps("https://example.com/page");

    assert.equal(result.status, "success");
    assert.equal(result.score, 5);
    assert.deepEqual(result.details, {
      url: "https://example.com/page",
      protocol: "https:",
    });
  });

  it("keeps the complete final URL in details", () => {
    const result = analyzeHttps("https://example.com:8443/page?source=test#result");

    assert.deepEqual(result.details, {
      url: "https://example.com:8443/page?source=test#result",
      protocol: "https:",
    });
  });

  it("returns an error for an HTTP URL", () => {
    const result = analyzeHttps("http://example.com/page");

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.ok(result.recommendation);
    assert.deepEqual(result.details, {
      url: "http://example.com/page",
      protocol: "http:",
    });
  });

  it("returns an error when the URL is invalid", () => {
    const result = analyzeHttps("not-a-url");

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, {
      url: "not-a-url",
      protocol: null,
    });
  });
});
