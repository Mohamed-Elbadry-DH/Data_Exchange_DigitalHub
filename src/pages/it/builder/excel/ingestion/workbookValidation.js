import { WORKBOOK_LIMITS, MESSAGES, MULTI_SHEET_ERROR } from "../model/workbookSchema.js";

const XLSX_EXT = /\.xlsx$/i;
const XLS_EXT = /\.xls$/i;
const ALLOWED_MIME = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
  "application/zip",
  "",
]);

/**
 * Fast pre-parse checks on the File object (main thread).
 * @param {File} file
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateUploadFile(file) {
  if (!file) return { ok: false, error: MESSAGES.parseFailed };

  if (XLS_EXT.test(file.name) && !XLSX_EXT.test(file.name)) {
    return { ok: false, error: MESSAGES.notXlsx };
  }
  if (!XLSX_EXT.test(file.name)) {
    return { ok: false, error: MESSAGES.notXlsx };
  }
  if (file.size > WORKBOOK_LIMITS.maxFileBytes) {
    return { ok: false, error: MESSAGES.tooLarge };
  }
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    // Soft: some browsers leave type empty; only reject clearly wrong types
    if (file.type.startsWith("image/") || file.type.startsWith("text/")) {
      return { ok: false, error: MESSAGES.notXlsx };
    }
  }
  return { ok: true };
}

/**
 * Validate ZIP PK header and uncompressed size estimate.
 * @param {ArrayBuffer} buffer
 * @param {import('jszip')} JSZip
 */
export async function validateZipStructure(buffer, JSZip) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    return { ok: false, error: MESSAGES.invalidZip };
  }

  let zip;
  try {
    zip = await JSZip.loadAsync(buffer, { checkCRC32: true });
  } catch {
    return { ok: false, error: MESSAGES.invalidZip };
  }

  let uncompressed = 0;
  const names = Object.keys(zip.files);
  if (!names.some((n) => n === "[Content_Types].xml" || n.endsWith("[Content_Types].xml"))) {
    // Some zips nest; still require xl/workbook.xml
    if (!names.some((n) => /xl\/workbook\.xml$/i.test(n))) {
      return { ok: false, error: MESSAGES.invalidZip };
    }
  }

  for (const name of names) {
    const f = zip.files[name];
    if (f.dir) continue;
    // JSZip exposes _data.uncompressedSize when available
    const size = f._data?.uncompressedSize ?? 0;
    uncompressed += size;
    if (uncompressed > WORKBOOK_LIMITS.maxUncompressedZipBytes) {
      return { ok: false, error: MESSAGES.zipBomb };
    }
  }

  return { ok: true, zip };
}

/**
 * @param {number} sheetCount
 */
export function validateSheetCount(sheetCount) {
  if (sheetCount < 1) return { ok: false, error: MESSAGES.noSheet };
  if (sheetCount > WORKBOOK_LIMITS.maxSheets) {
    return { ok: false, error: MULTI_SHEET_ERROR };
  }
  return { ok: true };
}

/**
 * @param {{ rows: number, cols: number, usedCells: number, mergeCount: number, merges: Array<{startRow,endRow,startColumn,endColumn}> }} dims
 */
export function validateWorkbookLimits(dims) {
  if (dims.rows > WORKBOOK_LIMITS.maxRows) {
    return { ok: false, error: MESSAGES.tooManyRows };
  }
  if (dims.cols > WORKBOOK_LIMITS.maxColumns) {
    return { ok: false, error: MESSAGES.tooManyColumns };
  }
  if (dims.usedCells > WORKBOOK_LIMITS.maxUsedCells) {
    return { ok: false, error: MESSAGES.tooManyCells };
  }
  if (dims.mergeCount > WORKBOOK_LIMITS.maxMerges) {
    return { ok: false, error: MESSAGES.tooManyMerges };
  }
  for (const m of dims.merges || []) {
    const spanR = m.endRow - m.startRow + 1;
    const spanC = m.endColumn - m.startColumn + 1;
    if (spanR > WORKBOOK_LIMITS.maxMergeSpanRows || spanC > WORKBOOK_LIMITS.maxMergeSpanCols) {
      return { ok: false, error: MESSAGES.mergeTooLarge };
    }
  }
  return { ok: true };
}
