import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeH1 } from "./h1Analyzer.js";

describe("analyzeH1", () => {
  it("returns an error when the page has no H1", () => {
    const result = analyzeH1(load("<main><h2>Introdução</h2></main>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { count: 0, headings: [] });
  });

  it("returns an error when the only H1 is empty", () => {
    const result = analyzeH1(load("<h1>   </h1>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { count: 1, headings: [""] });
  });

  it("returns an error when all H1 elements are empty", () => {
    const result = analyzeH1(load("<h1></h1><h1>   </h1>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
  });

  it("returns success when the page has one filled H1", () => {
    const result = analyzeH1(load("<h1>Análise técnica de SEO</h1>"));

    assert.equal(result.status, "success");
    assert.equal(result.score, 15);
    assert.deepEqual(result.details, {
      count: 1,
      headings: ["Análise técnica de SEO"],
    });
  });

  it("returns a warning when the page has multiple H1 elements", () => {
    const result = analyzeH1(load("<h1>SeoScope</h1><h1>Relatório</h1>"));

    assert.equal(result.status, "warning");
    assert.equal(result.score, 8);
    assert.deepEqual(result.details, {
      count: 2,
      headings: ["SeoScope", "Relatório"],
    });
  });

  it("normalizes whitespace inside the H1", () => {
    const expectedHeading = "Análise técnica de SEO";
    const result = analyzeH1(
      load("<h1>  Análise   técnica de\nSEO  </h1>"),
    );

    assert.deepEqual(result.details, {
      count: 1,
      headings: [expectedHeading],
    });
  });
});
