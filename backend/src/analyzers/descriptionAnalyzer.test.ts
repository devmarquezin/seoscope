import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeDescription } from "./descriptionAnalyzer.js";

describe("analyzeDescription", () => {
  it("returns an error when the meta description is missing", () => {
    const result = analyzeDescription(load("<html><head></head></html>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { description: null, length: 0 });
  });

  it("returns an error when the content is empty", () => {
    const result = analyzeDescription(
      load('<meta name="description" content="   ">'),
    );

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, { description: "", length: 0 });
  });

  it("returns a warning when the description is shorter than 70 characters", () => {
    const description = "Uma descrição curta.";
    const result = analyzeDescription(
      load(`<meta name="description" content="${description}">`),
    );

    assert.equal(result.status, "warning");
    assert.equal(result.score, 8);
  });

  it("returns a warning when the description is longer than 160 characters", () => {
    const description = "A".repeat(161);
    const result = analyzeDescription(
      load(`<meta name="description" content="${description}">`),
    );

    assert.equal(result.status, "warning");
    assert.equal(result.score, 8);
  });

  it("returns success at the recommended length boundaries", () => {
    const minimumResult = analyzeDescription(
      load(`<meta name="description" content="${"A".repeat(70)}">`),
    );
    const maximumResult = analyzeDescription(
      load(`<meta name="description" content="${"A".repeat(160)}">`),
    );

    assert.equal(minimumResult.status, "success");
    assert.equal(minimumResult.score, 15);
    assert.equal(maximumResult.status, "success");
    assert.equal(maximumResult.score, 15);
  });

  it("matches the name case-insensitively and normalizes whitespace", () => {
    const expectedDescription = "A".repeat(35) + " " + "B".repeat(35);
    const result = analyzeDescription(
      load(
        `<meta name="DESCRIPTION" content="  ${"A".repeat(35)}   ${"B".repeat(35)}  ">`,
      ),
    );

    assert.equal(result.status, "success");
    assert.deepEqual(result.details, {
      description: expectedDescription,
      length: expectedDescription.length,
    });
  });
});
