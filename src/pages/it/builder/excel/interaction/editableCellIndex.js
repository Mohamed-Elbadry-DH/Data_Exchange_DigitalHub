import { colIndexToLetters } from "../ingestion/ooxmlReader.js";
import {
  createDefaultExcelInteractionSchema,
  resolveCellInteraction,
} from "./interactionSchema.js";
import {
  analyzeWorkbookFormulas,
  isNumericCellValue,
} from "../calculation/formulaPrecedents.js";

/**
 * Runtime editable cell index — NOT stored inside WorkbookJSON.
 * Map<"B8", { type: "number", required?: boolean }>
 */

export function cellRefFromCoords(row, column) {
  return `${colIndexToLetters(column)}${row}`;
}

export function isTrueEmptyCell(cell) {
  if (!cell) return true;
  const v = cell.value;
  return v == null || v === "";
}

/**
 * @param {object} opts
 * @returns {boolean}
 */
export function isAutoEditableNumberCell({
  cell,
  row,
  column,
  workbook,
  interactionSchema,
  mergeAnchorSet,
  coveredSet,
  hiddenRows,
  hiddenCols,
  formulaPrecedentRefs,
}) {
  const schema = interactionSchema || createDefaultExcelInteractionSchema();
  if (!schema.autoInput?.enabled || !schema.autoInput?.emptyCells) return false;

  const range = workbook?.sheet?.usedRange;
  if (!range) return false;
  if (row < range.startRow || row > range.endRow) return false;
  if (column < range.startColumn || column > range.endColumn) return false;

  if (hiddenRows?.has(row)) return false;
  if (hiddenCols?.has(column)) return false;

  const key = `${row}:${column}`;
  if (coveredSet?.has(key)) return false;

  // Auto mode: exclude ALL merged cells (including empty anchors)
  if (mergeAnchorSet?.has(key)) return false;

  if (cell?.formula) return false;

  const ref = cellRefFromCoords(row, column);
  if ((schema.excludedCells || []).includes(ref)) return false;

  // Empty cells — always editable under auto policy
  if (isTrueEmptyCell(cell)) return true;

  // Numeric cells referenced by formulas — editable so live recalc works
  if (formulaPrecedentRefs?.has(ref) && isNumericCellValue(cell?.value)) {
    return true;
  }

  return false;
}

/**
 * Build merge bookkeeping sets from workbook.merges.
 */
export function buildMergeSets(merges) {
  const mergeAnchorSet = new Set();
  const coveredSet = new Set();
  for (const m of merges || []) {
    mergeAnchorSet.add(`${m.startRow}:${m.startColumn}`);
    for (let r = m.startRow; r <= m.endRow; r += 1) {
      for (let c = m.startColumn; c <= m.endColumn; c += 1) {
        if (r === m.startRow && c === m.startColumn) continue;
        coveredSet.add(`${r}:${c}`);
      }
    }
  }
  return { mergeAnchorSet, coveredSet };
}

/**
 * @param {object} workbook
 * @param {object} interactionSchema
 * @returns {Map<string, { type: string, required?: boolean, row: number, column: number }>}
 */
export function buildEditableCellIndex(workbook, interactionSchema) {
  const index = new Map();
  if (!workbook?.sheet?.usedRange) return index;

  const schema = interactionSchema || createDefaultExcelInteractionSchema();
  const { startRow, endRow, startColumn, endColumn } = workbook.sheet.usedRange;
  const { mergeAnchorSet, coveredSet } = buildMergeSets(workbook.merges);
  const { precedentRefs } = analyzeWorkbookFormulas(workbook);

  const cellByKey = new Map();
  for (const cell of workbook.cells || []) {
    cellByKey.set(`${cell.row}:${cell.column}`, cell);
  }

  const hiddenRows = new Set(
    (workbook.rows || []).filter((r) => r.hidden).map((r) => r.index),
  );
  const hiddenCols = new Set(
    (workbook.columns || []).filter((c) => c.hidden).map((c) => c.index),
  );

  for (let r = startRow; r <= endRow; r += 1) {
    for (let c = startColumn; c <= endColumn; c += 1) {
      const key = `${r}:${c}`;
      if (coveredSet.has(key)) continue;

      const cell = cellByKey.get(key);
      const ref = cellRefFromCoords(r, c);
      const autoEligible = isAutoEditableNumberCell({
        cell,
        row: r,
        column: c,
        workbook,
        interactionSchema: schema,
        mergeAnchorSet,
        coveredSet,
        hiddenRows,
        hiddenCols,
        formulaPrecedentRefs: precedentRefs,
      });

      const resolved = resolveCellInteraction(ref, schema, autoEligible);
      if (resolved?.editable) {
        index.set(ref, {
          type: resolved.type || "number",
          required: resolved.required,
          row: r,
          column: c,
        });
      }
    }
  }

  for (const ov of schema.cellOverrides || []) {
    if (ov.editable === false) {
      index.delete(ov.cell);
      continue;
    }
    if (ov.editable === true && ov.cell && !index.has(ov.cell)) {
      const parsed = parseCellRef(ov.cell);
      if (!parsed) continue;
      index.set(ov.cell, {
        type: ov.type || schema.autoInput?.defaultType || "number",
        required: Boolean(ov.required),
        row: parsed.row,
        column: parsed.column,
      });
    }
  }

  return index;
}

/**
 * Seed cellValues for editable numeric precedents so inputs show Excel defaults.
 */
export function seedEditableCellValues(workbook, editableIndex) {
  const seeded = {};
  if (!workbook?.cells || !editableIndex?.size) return seeded;
  const cellByRef = new Map();
  for (const cell of workbook.cells) {
    cellByRef.set(cellRefFromCoords(cell.row, cell.column), cell);
  }
  for (const [ref] of editableIndex) {
    const cell = cellByRef.get(ref);
    if (!cell || cell.formula) continue;
    if (!isNumericCellValue(cell.value)) continue;
    const n =
      typeof cell.value === "number"
        ? cell.value
        : Number(String(cell.value).replace(/,/g, ""));
    if (Number.isFinite(n)) seeded[ref] = n;
  }
  return seeded;
}

function parseCellRef(ref) {
  const m = String(ref).trim().match(/^([A-Za-z]+)(\d+)$/);
  if (!m) return null;
  let col = 0;
  const letters = m[1].toUpperCase();
  for (let i = 0; i < letters.length; i += 1) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return { column: col, row: Number(m[2]) };
}

export function isEditableInIndex(index, row, column) {
  return index?.has(cellRefFromCoords(row, column)) ?? false;
}
