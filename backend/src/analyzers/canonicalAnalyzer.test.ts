import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeCanonical } from "./canonicalAnalyzer.js";

describe("analyzeCanonical", () => {
  it("returns an error when the canonical is missing", () => {
    const result = analyzeCanonical(load("<head></head>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { count: 0, urls: [], emptyCount: 0 });
  });

  it("returns an error when href is missing", () => {
    const result = analyzeCanonical(load('<link rel="canonical">'));

    assert.equal(result.status, "error");
    assert.deepEqual(result.details, {
      count: 1,
      urls: [null],
      emptyCount: 1,
    });
  });

  it("returns an error when href is empty", () => {
    const result = analyzeCanonical(
      load('<link rel="canonical" href="   ">'),
    );

    assert.equal(result.status, "error");
    assert.deepEqual(result.details, {
      count: 1,
      urls: [""],
      emptyCount: 1,
    });
  });

  it("returns success for one filled canonical", () => {
    const url = "https://example.com/page";
    const result = analyzeCanonical(
      load(`<link rel="canonical" href="${url}">`),
    );

    assert.equal(result.status, "success");
    assert.equal(result.score, 10);
    assert.deepEqual(result.details, {
      count: 1,
      urls: [url],
      emptyCount: 0,
    });
  });

  it("matches canonical in a case-insensitive list of rel values", () => {
    const result = analyzeCanonical(
      load('<link rel="alternate CANONICAL" href="https://example.com">'),
    );

    assert.equal(result.status, "success");
  });

  it("returns a warning and reports every canonical when there are multiple", () => {
    const result = analyzeCanonical(
      load(
        '<link rel="canonical" href="https://example.com/first"><link rel="canonical" href="">',
      ),
    );

    assert.equal(result.status, "warning");
    assert.equal(result.score, 5);
    assert.deepEqual(result.details, {
      count: 2,
      urls: ["https://example.com/first", ""],
      emptyCount: 1,
    });
  });
});
