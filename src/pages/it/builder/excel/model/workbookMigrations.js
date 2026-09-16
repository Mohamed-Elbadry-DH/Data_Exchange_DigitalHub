import { SCHEMA_VERSION, createEmptyWorkbook } from "./workbookSchema.js";

/**
 * Migrate stored WorkbookJSON to the current schema version.
 * Stub for v1 — identity transform when already current.
 *
 * @param {unknown} raw
 * @returns {{ ok: true, workbook: object } | { ok: false, error: string }}
 */
export function migrateWorkbook(raw) {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "نموذج المصنف غير صالح." };
  }

  const doc = /** @type {Record<string, unknown>} */ (raw);
  const version = typeof doc.schemaVersion === "string" ? doc.schemaVersion : null;

  if (!version) {
    return { ok: false, error: "نموذج المصنف يفتقد schemaVersion." };
  }

  if (version === SCHEMA_VERSION) {
    return { ok: true, workbook: doc };
  }

  // Future: v1 → v2 → … chain here.
  return {
    ok: false,
    error: `إصدار نموذج المصنف غير مدعوم (${version}). المتوقع ${SCHEMA_VERSION}.`,
  };
}

/** Ensure a workbook object has required top-level keys (defensive). */
export function ensureWorkbookShape(workbook, { fileName = "" } = {}) {
  const base = createEmptyWorkbook({ fileName });
  return {
    ...base,
    ...workbook,
    sheet: { ...base.sheet, ...(workbook?.sheet || {}) },
    metadata: { ...base.metadata, ...(workbook?.metadata || {}), originalFileName: fileName || workbook?.metadata?.originalFileName || "" },
    rows: workbook?.rows || [],
    columns: workbook?.columns || [],
    cells: workbook?.cells || [],
    merges: workbook?.merges || [],
    fields: workbook?.fields || [],
  };
}
