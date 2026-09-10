import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { load } from "cheerio";
import { analyzeHeadings } from "./headingAnalyzer.js";

describe("analyzeHeadings", () => {
  it("returns an error when the page has no headings", () => {
    const result = analyzeHeadings(load("<main><p>Conteúdo</p></main>"));

    assert.equal(result.status, "error");
    assert.equal(result.score, 0);
    assert.deepEqual(result.details, {
      total: 0,
      counts: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
      outline: [],
      skippedLevels: [],
    });
  });

  it("returns success for a sequential hierarchy", () => {
    const result = analyzeHeadings(
      load("<h1>Guia</h1><h2>Parte 1</h2><h3>Detalhe</h3><h2>Parte 2</h2>"),
    );

    assert.equal(result.status, "success");
    assert.equal(result.score, 10);
  });

  it("returns a warning when a level is skipped", () => {
    const result = analyzeHeadings(load("<h1>Guia</h1><h3>Detalhe</h3>"));

    assert.equal(result.status, "warning");
    assert.equal(result.score, 5);
    assert.deepEqual(
      (result.details as { skippedLevels: unknown[] }).skippedLevels,
      [{ from: "h1", to: "h3", position: 2, missing: ["h2"] }],
    );
  });

  it("allows moving back more than one level", () => {
    const result = analyzeHeadings(
      load("<h1>Guia</h1><h2>Parte</h2><h3>Detalhe</h3><h1>Outro guia</h1>"),
    );

    assert.equal(result.status, "success");
    assert.equal(result.score, 10);
  });

  it("does not duplicate the multiple-H1 warning", () => {
    const result = analyzeHeadings(load("<h1>Primeiro</h1><h1>Segundo</h1>"));

    assert.equal(result.status, "success");
    assert.equal(result.score, 10);
  });

  it("reports counts, normalized text and every skipped level", () => {
    const result = analyzeHeadings(
      load(
        "<h2>  Primeira seção  </h2><h4>Detalhe</h4><h2>Segunda seção</h2><h5>Outro detalhe</h5>",
      ),
    );

    assert.deepEqual(result.details, {
      total: 4,
      counts: { h1: 0, h2: 2, h3: 0, h4: 1, h5: 1, h6: 0 },
      outline: [
        { level: 2, tag: "h2", text: "Primeira seção" },
        { level: 4, tag: "h4", text: "Detalhe" },
        { level: 2, tag: "h2", text: "Segunda seção" },
        { level: 5, tag: "h5", text: "Outro detalhe" },
      ],
      skippedLevels: [
        { from: "h2", to: "h4", position: 2, missing: ["h3"] },
        { from: "h2", to: "h5", position: 4, missing: ["h3", "h4"] },
      ],
    });
  });
});
