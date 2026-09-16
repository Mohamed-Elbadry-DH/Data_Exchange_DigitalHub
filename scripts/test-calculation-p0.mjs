/**
 * Headless P0 calculation acceptance tests (HyperFormula adapter).
 * Run: node scripts/test-calculation-p0.mjs
 */
import {
  applyValuesToEngine,
  evaluateAndDiff,
  loadWorkbookIntoEngine,
} from "../src/pages/it/builder/excel/calculation/formualizerAdapter.js";
import { normalizeFormula } from "../src/pages/it/builder/excel/calculation/formulaNormalize.js";
import { normalizeInputValue } from "../src/pages/it/builder/excel/calculation/inputNormalize.js";
import { ERROR_CODES } from "../src/pages/it/builder/excel/calculation/calculationErrors.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function makeWorkbook(cells) {
  return {
    sheet: { name: "Sheet1", usedRange: { startRow: 1, endRow: 20, startColumn: 1, endColumn: 10 } },
    cells,
  };
}

async function main() {
  let failed = 0;

  assert(normalizeFormula("SUM(A1)") === "=SUM(A1)", "normalizeFormula adds =");
  assert(normalizeFormula("=A1") === "=A1", "normalizeFormula keeps =");
  assert(normalizeInputValue("") === null, "blank string → null");
  assert(normalizeInputValue("0") === 0, "zero stays 0");
  assert(normalizeInputValue("12.5") === 12.5, "decimal parse");
  console.log("OK helpers");

  {
    const wbJson = makeWorkbook([
      { row: 8, column: 2, value: 100, formula: null },
      { row: 8, column: 3, value: 200, formula: null },
      { row: 8, column: 4, value: null, formula: "=B8+C8" },
      { row: 8, column: 5, value: null, formula: "=D8*0.1" },
    ]);
    const loaded = await loadWorkbookIntoEngine({}, wbJson);
    assert(loaded.snapshotValues.D8 === 300, `D8 expected 300 got ${loaded.snapshotValues.D8}`);
    assert(loaded.snapshotValues.E8 === 30, `E8 expected 30 got ${loaded.snapshotValues.E8}`);

    applyValuesToEngine(loaded.wb, loaded.sheetId, { B8: 150 });
    const diff = evaluateAndDiff(loaded.wb, loaded.sheetId, loaded.state);
    assert(diff.changedValues.D8 === 350, `D8→350 got ${diff.changedValues.D8}`);
    assert(diff.changedValues.E8 === 35, `E8→35 got ${diff.changedValues.E8}`);
    console.log("OK arithmetic chain");
  }

  {
    const wbJson = makeWorkbook([
      { row: 1, column: 1, value: 10, formula: null },
      { row: 1, column: 2, value: null, formula: "=A1*2" },
    ]);
    const loaded = await loadWorkbookIntoEngine({}, wbJson);
    applyValuesToEngine(loaded.wb, loaded.sheetId, { A1: normalizeInputValue("") });
    const diff = evaluateAndDiff(loaded.wb, loaded.sheetId, loaded.state);
    const b1 = diff.changedValues.B1 ?? loaded.state.previousValues.B1;
    assert(b1 === 0, `blank A1 should yield 0 for A1*2 got ${b1}`);
    console.log("OK blank input", b1);
  }

  {
    const wbJson = makeWorkbook([
      { row: 8, column: 2, value: 0, formula: null },
      { row: 8, column: 4, value: null, formula: "=100/B8" },
    ]);
    const loaded = await loadWorkbookIntoEngine({}, wbJson);
    assert(
      loaded.snapshotErrors.D8?.code === ERROR_CODES.DIVIDE_BY_ZERO,
      `expected DIV/0 got ${loaded.snapshotErrors.D8?.code}`,
    );
    assert(!("D8" in loaded.snapshotValues), "error cell not in calculatedValues");

    applyValuesToEngine(loaded.wb, loaded.sheetId, { B8: 20 });
    const diff = evaluateAndDiff(loaded.wb, loaded.sheetId, loaded.state);
    assert(diff.changedValues.D8 === 5, `recovery D8=5 got ${diff.changedValues.D8}`);
    assert(diff.clearedErrors.includes("D8"), "clearedErrors should include D8");
    console.log("OK error recovery");
  }

  {
    const wbJson = makeWorkbook([
      { row: 1, column: 1, value: null, formula: "=B1" },
      { row: 1, column: 2, value: null, formula: "=A1" },
    ]);
    const loaded = await loadWorkbookIntoEngine({}, wbJson);
    assert(
      loaded.snapshotErrors.A1?.code === ERROR_CODES.CIRCULAR_REFERENCE ||
        loaded.snapshotErrors.B1?.code === ERROR_CODES.CIRCULAR_REFERENCE,
      "circular expected",
    );
    console.log("OK circular");
  }

  {
    const wbJson = makeWorkbook([
      { row: 1, column: 1, value: null, formula: "=Sheet2!B8" },
    ]);
    const loaded = await loadWorkbookIntoEngine({}, wbJson);
    assert(
      loaded.snapshotErrors.A1?.code === ERROR_CODES.CROSS_SHEET_REFERENCE_NOT_SUPPORTED,
      `cross-sheet got ${loaded.snapshotErrors.A1?.code}`,
    );
    console.log("OK cross-sheet blocked");
  }

  {
    const wbJson = makeWorkbook([
      { row: 1, column: 1, value: 1, formula: null },
      { row: 1, column: 2, value: null, formula: "=VLOOKUP(A1,A1:A1,1,FALSE)" },
    ]);
    const loaded = await loadWorkbookIntoEngine({}, wbJson);
    assert(
      loaded.snapshotErrors.B1?.code === ERROR_CODES.UNSUPPORTED_FUNCTION,
      `unsupported got ${loaded.snapshotErrors.B1?.code}`,
    );
    console.log("OK unsupported function");
  }

  console.log("\nAll P0 calculation tests passed.");
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error("FAIL", e);
  process.exit(1);
});
