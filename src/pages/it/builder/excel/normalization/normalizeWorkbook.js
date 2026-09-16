import { SCHEMA_VERSION, PARSER_VERSION, MESSAGES, createEmptyWorkbook } from "../model/workbookSchema.js";
import { createColorResolver } from "./colorResolver.js";
import { resolveDimensions } from "./dimensionResolver.js";
import { normalizeExcelJsStyle, mergeStyles } from "./normalizeStyles.js";
import { resolveSharedBorders } from "./resolveSharedBorders.js";
import { parseA1Range } from "../ingestion/ooxmlReader.js";
import { validateWorkbookLimits } from "../ingestion/workbookValidation.js";
import { normalizeFormula } from "../calculation/formulaNormalize.js";

/**
 * Merge ExcelJS snapshot + OOXML enrichment → WorkbookJSON v1.
 *
 * @param {{
 *   snapshot: object,
 *   enrichment: object,
 *   fileName: string,
 * }} input
 * @returns {{ ok: true, workbook: object } | { ok: false, error: string }}
 */
export function normalizeWorkbook({ snapshot, enrichment, fileName }) {
  if (!snapshot) {
    return { ok: false, error: MESSAGES.parseFailed };
  }

  const colorResolver = createColorResolver(enrichment?.themeColors);

  const defaultRowHeight =
    enrichment?.defaultRowHeight ?? snapshot.properties?.defaultRowHeight ?? 15;
  const defaultColumnWidth =
    enrichment?.defaultColumnWidth ?? snapshot.properties?.defaultColWidth ?? 8.43;

  const mergeList = collectMerges(snapshot.merges, enrichment?.merges);
  const covered = buildCoveredSet(mergeList);

  const rowHeightMap = new Map();
  const colWidthMap = new Map();

  // OOXML enrichment first, then ExcelJS overrides when present
  if (enrichment?.rowHeights) {
    for (const [k, v] of enrichment.rowHeights.entries?.() || Object.entries(enrichment.rowHeights)) {
      rowHeightMap.set(Number(k), Number(v));
    }
  }
  if (enrichment?.colWidths) {
    for (const [k, v] of enrichment.colWidths.entries?.() || Object.entries(enrichment.colWidths)) {
      colWidthMap.set(Number(k), Number(v));
    }
  }
  for (const [k, v] of Object.entries(snapshot.rowHeights || {})) {
    rowHeightMap.set(Number(k), Number(v));
  }
  for (const [k, v] of Object.entries(snapshot.colWidths || {})) {
    colWidthMap.set(Number(k), Number(v));
  }

  let startRow = 1;
  let startColumn = 1;
  let endRow = Math.max(1, snapshot.rowCount || 1);
  let endColumn = Math.max(1, snapshot.columnCount || 1);

  for (const cell of snapshot.cells || []) {
    endRow = Math.max(endRow, cell.row);
    endColumn = Math.max(endColumn, cell.column);
  }
  for (const m of mergeList) {
    endRow = Math.max(endRow, m.endRow);
    endColumn = Math.max(endColumn, m.endColumn);
  }

  const usedCells = (snapshot.cells || []).length;
  const limits = validateWorkbookLimits({
    rows: endRow - startRow + 1,
    cols: endColumn - startColumn + 1,
    usedCells,
    mergeCount: mergeList.length,
    merges: mergeList,
  });
  if (!limits.ok) return limits;

  if (endRow < 1 || (usedCells === 0 && mergeList.length === 0)) {
    // Allow empty styled templates with at least dimensions from sheet
    if (endRow <= 1 && endColumn <= 1 && usedCells === 0) {
      return { ok: false, error: MESSAGES.emptySheet };
    }
  }

  const { rows, columns } = resolveDimensions({
    startRow,
    endRow,
    startColumn,
    endColumn,
    defaultRowHeight,
    defaultColumnWidth,
    rowHeights: rowHeightMap,
    colWidths: colWidthMap,
  });

  const cells = [];
  for (const raw of snapshot.cells || []) {
    if (covered.has(`${raw.row}:${raw.column}`)) continue;

    const style = normalizeExcelJsStyle(colorResolver, raw.style);
    cells.push({
      row: raw.row,
      column: raw.column,
      value: raw.text != null && raw.text !== "" ? raw.text : formatValue(raw.value),
      numberFormat: raw.numFmt || "General",
      formula: normalizeFormula(raw.formula),
      style,
    });
  }

  // Ensure merge anchors exist even if empty
  for (const m of mergeList) {
    const key = `${m.startRow}:${m.startColumn}`;
    const has = cells.some((c) => c.row === m.startRow && c.column === m.startColumn);
    if (!has && !covered.has(key)) {
      cells.push({
        row: m.startRow,
        column: m.startColumn,
        value: "",
        numberFormat: "General",
        formula: null,
        style: normalizeExcelJsStyle(colorResolver, null),
      });
    }
  }

  resolveSharedBorders(cells);

  const direction =
    enrichment?.direction === "rtl" || snapshot.rightToLeft ? "rtl" : "ltr";

  const workbook = createEmptyWorkbook({
    sheetName: enrichment?.sheetName || snapshot.name || "Sheet1",
    fileName,
  });

  workbook.schemaVersion = SCHEMA_VERSION;
  workbook.sheet = {
    name: enrichment?.sheetName || snapshot.name || "Sheet1",
    direction,
    defaultRowHeight,
    defaultColumnWidth,
    usedRange: { startRow, startColumn, endRow, endColumn },
  };
  workbook.rows = rows;
  workbook.columns = columns;
  workbook.cells = cells;
  workbook.merges = mergeList;
  workbook.fields = [];
  workbook.metadata = {
    source: "xlsx",
    originalFileName: fileName,
    parserVersion: PARSER_VERSION,
  };

  // silence unused
  void mergeStyles;

  return { ok: true, workbook };
}

function formatValue(value) {
  if (value == null) return "";
  if (typeof value === "number" || typeof value === "boolean") return value;
  return String(value);
}

function collectMerges(snapshotMerges, enrichmentMerges) {
  const out = [];
  const seen = new Set();

  const add = (m) => {
    if (!m) return;
    const key = `${m.startRow}:${m.startColumn}:${m.endRow}:${m.endColumn}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(m);
  };

  for (const m of enrichmentMerges || []) {
    if (m.startRow != null) add(m);
  }

  for (const ref of snapshotMerges || []) {
    if (typeof ref === "string") {
      add(parseA1Range(ref));
    } else if (ref && ref.top != null) {
      add({
        startRow: ref.top,
        startColumn: ref.left,
        endRow: ref.bottom,
        endColumn: ref.right,
      });
    } else if (ref && ref.startRow != null) {
      add(ref);
    }
  }

  return out;
}

/** Cells covered by a merge (excluding the anchor). */
function buildCoveredSet(merges) {
  const covered = new Set();
  for (const m of merges) {
    for (let r = m.startRow; r <= m.endRow; r += 1) {
      for (let c = m.startColumn; c <= m.endColumn; c += 1) {
        if (r === m.startRow && c === m.startColumn) continue;
        covered.add(`${r}:${c}`);
      }
    }
  }
  return covered;
}
