import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeTitle } from "./titleAnalyzer.js";

describe("analyzeTitle", () => {
  it("returns an error when the title tag is missing", () => {
    const result = analyzeTitle(load("<html><head></head></html>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { title: null, length: 0 });
  });

  it("returns an error when the title is empty", () => {
    const result = analyzeTitle(load("<title>   </title>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { title: "", length: 0 });
  });

  it("returns a warning when the title is shorter than 30 characters", () => {
    const result = analyzeTitle(load("<title>SeoScope</title>"));

    assert.equal(result.status, "warning");
    assert.equal(result.score, 10);
  });

  it("returns a warning when the title is longer than 60 characters", () => {
    const title = "A".repeat(61);
    const result = analyzeTitle(load(`<title>${title}</title>`));

    assert.equal(result.status, "warning");
    assert.equal(result.score, 10);
  });

  it("returns success when the title has between 30 and 60 characters", () => {
    const title = "Análise técnica de SEO para seu site";
    const result = analyzeTitle(load(`<title>${title}</title>`));

    assert.equal(result.status, "success");
    assert.equal(result.score, 20);
    assert.deepEqual(result.details, { title, length: title.length });
  });

  it("normalizes whitespace before measuring the title", () => {
    const expectedTitle = "Análise técnica de SEO para seu site";
    const result = analyzeTitle(
      load("<title>  Análise   técnica de SEO para seu site  </title>"),
    );

    assert.deepEqual(result.details, {
      title: expectedTitle,
      length: expectedTitle.length,
    });
  });
});
