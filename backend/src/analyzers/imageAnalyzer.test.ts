import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeImages } from "./imageAnalyzer.js";

describe("analyzeImages", () => {
  it("returns success when the page has no images", () => {
    const result = analyzeImages(load("<main><p>Conteúdo</p></main>"));

    assert.equal(result.status, "success");
    assert.equal(result.score, 15);
    assert.deepEqual(result.details, {
      total: 0,
      withAlt: 0,
      emptyAlt: 0,
      withoutAlt: 0,
      missingAltImages: [],
    });
  });

  it("returns success when every image has alt text", () => {
    const result = analyzeImages(
      load('<img src="logo.png" alt="SeoScope"><img src="chart.png" alt="Gráfico">'),
    );

    assert.equal(result.status, "success");
    assert.equal(result.score, 15);
  });

  it("counts an empty alt as a present attribute", () => {
    const result = analyzeImages(
      load('<img src="decoration.svg" alt=""><img src="space.svg" alt="   ">'),
    );

    assert.equal(result.status, "success");
    assert.deepEqual(result.details, {
      total: 2,
      withAlt: 2,
      emptyAlt: 2,
      withoutAlt: 0,
      missingAltImages: [],
    });
  });

  it("returns an error when no image has an alt attribute", () => {
    const result = analyzeImages(
      load('<img src="first.png"><img src="second.png">'),
    );

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, {
      total: 2,
      withAlt: 0,
      emptyAlt: 0,
      withoutAlt: 2,
      missingAltImages: [
        { index: 1, src: "first.png" },
        { index: 2, src: "second.png" },
      ],
    });
  });

  it("returns a proportional warning when some images lack alt", () => {
    const result = analyzeImages(
      load('<img alt="Primeira"><img alt="Segunda"><img src="third.png">'),
    );

    assert.equal(result.status, "warning");
    assert.equal(result.score, 10);
  });

  it("reports a null source when an image without alt has no src", () => {
    const result = analyzeImages(load('<img alt="Ícone"><img>'));

    assert.deepEqual(
      (result.details as { missingAltImages: unknown[] }).missingAltImages,
      [{ index: 2, src: null }],
    );
  });
});
