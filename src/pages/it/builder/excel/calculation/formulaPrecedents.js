import { colIndexToLetters } from "../ingestion/ooxmlReader.js";
import { cellRefFromCoords } from "../interaction/editableCellIndex.js";

/**
 * Collect A1-style references used by workbook formulas (single-sheet P0).
 * Expands simple ranges like B8:B12 / B8:D8.
 */

function colLettersToIndex(letters) {
  let col = 0;
  const s = String(letters).toUpperCase();
  for (let i = 0; i < s.length; i += 1) {
    col = col * 26 + (s.charCodeAt(i) - 64);
  }
  return col;
}

function addRef(set, col, row) {
  if (!col || !row || row < 1) return;
  set.add(`${colIndexToLetters(col)}${row}`);
}

/**
 * @param {string} formula
 * @returns {Set<string>}
 */
export function extractRefsFromFormula(formula) {
  const refs = new Set();
  if (!formula) return refs;
  const text = String(formula);

  // Skip cross-sheet / external early (still parse local tokens if mixed — rare)
  if (/[![]/.test(text)) {
    // Only extract refs that do NOT have a sheet bang immediately before them
  }

  const rangeRe =
    /(?:^|[^A-Za-z0-9_]!?)\$?([A-Za-z]{1,3})\$?(\d+)\s*:\s*\$?([A-Za-z]{1,3})\$?(\d+)/g;
  let m;
  while ((m = rangeRe.exec(text))) {
    const c1 = colLettersToIndex(m[1]);
    const r1 = Number(m[2]);
    const c2 = colLettersToIndex(m[3]);
    const r2 = Number(m[4]);
    const minC = Math.min(c1, c2);
    const maxC = Math.max(c1, c2);
    const minR = Math.min(r1, r2);
    const maxR = Math.max(r1, r2);
    // Cap expansion for safety
    if ((maxC - minC + 1) * (maxR - minR + 1) > 5000) continue;
    for (let r = minR; r <= maxR; r += 1) {
      for (let c = minC; c <= maxC; c += 1) {
        addRef(refs, c, r);
      }
    }
  }

  const cellRe = /\$?([A-Za-z]{1,3})\$?(\d+)/g;
  while ((m = cellRe.exec(text))) {
    // Ignore if this match is the start of a range already handled — still fine to add singles
    addRef(refs, colLettersToIndex(m[1]), Number(m[2]));
  }

  return refs;
}

/**
 * @param {object} workbook
 * @returns {{ formulaCount: number, formulaRefs: string[], precedentRefs: Set<string> }}
 */
export function analyzeWorkbookFormulas(workbook) {
  const formulaRefs = [];
  const precedentRefs = new Set();

  for (const cell of workbook?.cells || []) {
    if (!cell?.formula) continue;
    const ref = cellRefFromCoords(cell.row, cell.column);
    formulaRefs.push(ref);
    for (const p of extractRefsFromFormula(cell.formula)) {
      if (p !== ref) precedentRefs.add(p);
    }
  }

  // A formula cell is never an input precedent for editing purposes
  for (const fr of formulaRefs) precedentRefs.delete(fr);

  return {
    formulaCount: formulaRefs.length,
    formulaRefs,
    precedentRefs,
  };
}

/** True if cell value looks like a number (including numeric strings from Excel import). */
export function isNumericCellValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return true;
  if (typeof value === "string") {
    const t = value.trim().replace(/,/g, "");
    if (!t) return false;
    return /^-?\d+(\.\d+)?$/.test(t);
  }
  return false;
}
