import ExcelJS from "exceljs";
import { MESSAGES } from "../model/workbookSchema.js";
import { validateSheetCount } from "./workbookValidation.js";

/**
 * Parse XLSX with ExcelJS — primary cell/value/style source.
 * @param {ArrayBuffer} buffer
 * @returns {Promise<{ ok: true, workbook: import('exceljs').Workbook, sheet: import('exceljs').Worksheet } | { ok: false, error: string }>}
 */
export async function parseWithExcelJs(buffer) {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer);
  } catch {
    return { ok: false, error: MESSAGES.parseFailed };
  }

  const sheets = workbook.worksheets.filter((ws) => ws && ws.state !== "hidden");
  const countCheck = validateSheetCount(sheets.length || workbook.worksheets.length);
  if (!countCheck.ok) return countCheck;

  const sheet = sheets[0] || workbook.worksheets[0];
  if (!sheet) return { ok: false, error: MESSAGES.noSheet };

  return { ok: true, workbook, sheet };
}

/**
 * Extract a serializable snapshot from ExcelJS worksheet for normalization.
 * Avoids passing ExcelJS objects across worker boundaries after this step.
 */
export function extractExcelJsSnapshot(sheet) {
  const merges = (sheet.model?.merges || []).map((ref) => {
    // ExcelJS stores merges as "A1:B2" strings in model.merges
    if (typeof ref === "string") return ref;
    return null;
  }).filter(Boolean);

  // Also from worksheet._merges
  if (sheet._merges) {
    for (const key of Object.keys(sheet._merges)) {
      const m = sheet._merges[key];
      if (m?.model) {
        const { top, left, bottom, right } = m.model;
        merges.push({ top, left, bottom, right });
      } else if (typeof m === "string") {
        merges.push(m);
      }
    }
  }

  const colWidths = {};
  sheet.columns?.forEach((col, i) => {
    const idx = col.number || i + 1;
    if (col.width != null) colWidths[idx] = col.width;
  });

  const rowHeights = {};
  sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (row.height != null) rowHeights[rowNumber] = row.height;
  });

  const cells = [];
  let maxRow = sheet.rowCount || 0;
  let maxCol = sheet.columnCount || 0;

  sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    maxRow = Math.max(maxRow, rowNumber);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      maxCol = Math.max(maxCol, colNumber);
      const hasValue = cell.value != null && cell.value !== "";
      if (!hasValue && !cellHasExportableStyle(cell)) return;

      cells.push({
        row: rowNumber,
        column: colNumber,
        value: serializeCellValue(cell.value),
        text: cell.text != null ? String(cell.text) : valueToDisplay(cell.value),
        numFmt: cell.numFmt || null,
        formula: extractFormula(cell.value),
        style: serializeStyle({
          font: cell.font,
          fill: cell.fill,
          alignment: cell.alignment,
          border: cell.border,
        }),
      });
    });
  });

  const views = sheet.views || [];
  const rightToLeft = Boolean(views[0]?.rightToLeft);

  return {
    name: sheet.name || "Sheet1",
    rowCount: maxRow,
    columnCount: maxCol,
    properties: {
      defaultRowHeight: sheet.properties?.defaultRowHeight ?? 15,
      defaultColWidth: sheet.properties?.defaultColWidth ?? 8.43,
    },
    rightToLeft,
    merges,
    colWidths,
    rowHeights,
    cells,
  };
}

function serializeCellValue(value) {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    if (value.richText) {
      return value.richText.map((t) => t.text).join("");
    }
    if (value.text != null) return String(value.text);
    if (value.result != null) return value.result;
    if (value.formula != null) return value.result ?? "";
    if (value.sharedFormula != null) return value.result ?? "";
    if (value.error) return String(value.error);
  }
  return String(value);
}

function extractFormula(value) {
  if (!value || typeof value !== "object") return null;
  if (value.formula != null) return String(value.formula);
  if (value.sharedFormula != null) return String(value.sharedFormula);
  return null;
}

function valueToDisplay(value) {
  const v = serializeCellValue(value);
  if (v == null) return "";
  return String(v);
}

function cellHasExportableStyle(cell) {
  const fill = cell.fill;
  if (fill && fill.type !== "none" && fill.pattern !== "none") {
    const fg = fill.fgColor;
    if (fg?.argb || fg?.theme != null || fg?.indexed != null) return true;
  }
  const border = cell.border;
  if (border) {
    for (const side of ["top", "right", "bottom", "left"]) {
      if (border[side]?.style) return true;
    }
  }
  return false;
}

function serializeStyle(style) {
  if (!style) return null;
  return {
    font: style.font
      ? {
          name: style.font.name,
          size: style.font.size,
          bold: style.font.bold,
          italic: style.font.italic,
          underline: style.font.underline,
          color: style.font.color,
        }
      : undefined,
    fill: style.fill
      ? {
          type: style.fill.type,
          pattern: style.fill.pattern,
          fgColor: style.fill.fgColor,
          bgColor: style.fill.bgColor,
        }
      : undefined,
    alignment: style.alignment
      ? {
          horizontal: style.alignment.horizontal,
          vertical: style.alignment.vertical,
          wrapText: style.alignment.wrapText,
          textRotation: style.alignment.textRotation,
          indent: style.alignment.indent,
        }
      : undefined,
    border: style.border
      ? {
          top: style.border.top,
          right: style.border.right,
          bottom: style.border.bottom,
          left: style.border.left,
        }
      : undefined,
  };
}
