import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeOpenGraph } from "./openGraphAnalyzer.js";

const allProperties = `
  <meta property="og:title" content="SeoScope">
  <meta property="og:description" content="Análise técnica de SEO">
  <meta property="og:image" content="https://example.com/image.png">
  <meta property="og:url" content="https://example.com/page">
`;

describe("analyzeOpenGraph", () => {
  it("returns an error when every required property is missing", () => {
    const result = analyzeOpenGraph(load("<head></head>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, {
      required: ["og:title", "og:description", "og:image", "og:url"],
      present: 0,
      missing: ["og:title", "og:description", "og:image", "og:url"],
      empty: [],
      values: {
        "og:title": null,
        "og:description": null,
        "og:image": null,
        "og:url": null,
      },
    });
  });

  it("returns an error and distinguishes empty properties", () => {
    const result = analyzeOpenGraph(
      load(`
        <meta property="og:title" content="">
        <meta property="og:description">
        <meta property="og:image" content="   ">
        <meta property="og:url" content="">
      `),
    );

    assert.equal(result.status, "error");
    assert.deepEqual(
      (result.details as { missing: unknown[]; empty: unknown[] }).missing,
      [],
    );
    assert.deepEqual(
      (result.details as { missing: unknown[]; empty: unknown[] }).empty,
      ["og:title", "og:description", "og:image", "og:url"],
    );
  });

  it("returns success when every required property is filled", () => {
    const result = analyzeOpenGraph(load(allProperties));

    assert.equal(result.status, "success");
    assert.equal(result.score, 10);
  });

  it("returns a proportional warning when only some properties are filled", () => {
    const result = analyzeOpenGraph(
      load(`
        <meta property="og:title" content="SeoScope">
        <meta property="og:description" content="Análise técnica de SEO">
      `),
    );

    assert.equal(result.status, "warning");
    assert.equal(result.score, 5);
    assert.deepEqual(
      (result.details as { missing: unknown[] }).missing,
      ["og:image", "og:url"],
    );
  });

  it("matches property names case-insensitively", () => {
    const result = analyzeOpenGraph(
      load(allProperties.replace('property="og:title"', 'property="OG:TITLE"')),
    );

    assert.equal(result.status, "success");
  });

  it("uses a filled duplicate when the first matching property is empty", () => {
    const result = analyzeOpenGraph(
      load(`<meta property="og:title" content="">${allProperties}`),
    );

    assert.equal(result.status, "success");
    assert.equal(
      (result.details as { values: Record<string, string> }).values["og:title"],
      "SeoScope",
    );
  });
});
