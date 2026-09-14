import { colIndexToLetters } from "../ingestion/ooxmlReader.js";

/**
 * Suggest editable fields from layout heuristics.
 * These are SUGGESTIONS only — must be confirmed by admin before becoming fields[].
 *
 * Heuristic: non-empty label cell + empty adjacent value cell (to the left in LTR, right in RTL).
 *
 * @param {object} workbook - WorkbookJSON
 * @returns {Array<{ id: string, row: number, column: number, label: string, type: string, confidence: 'high'|'low', cellRef: string }>}
 */
export function inferFields(workbook) {
  if (!workbook?.cells) return [];

  const direction = workbook.sheet?.direction || "ltr";
  const { startRow, endRow, startColumn, endColumn } = workbook.sheet.usedRange;
  const mergeAnchors = new Set(
    (workbook.merges || []).map((m) => `${m.startRow}:${m.startColumn}`),
  );
  const covered = new Set();
  for (const m of workbook.merges || []) {
    for (let r = m.startRow; r <= m.endRow; r += 1) {
      for (let c = m.startColumn; c <= m.endColumn; c += 1) {
        if (r === m.startRow && c === m.startColumn) continue;
        covered.add(`${r}:${c}`);
      }
    }
  }

  const byKey = new Map();
  for (const cell of workbook.cells) {
    byKey.set(`${cell.row}:${cell.column}`, cell);
  }

  const isEmpty = (cell) => {
    if (!cell) return true;
    const v = cell.value;
    return v == null || String(v).trim() === "";
  };

  const isLabel = (cell) => {
    if (!cell || isEmpty(cell)) return false;
    // Skip large merge titles spanning many columns
    const merge = (workbook.merges || []).find(
      (m) => m.startRow === cell.row && m.startColumn === cell.column,
    );
    if (merge && merge.endColumn - merge.startColumn >= 3) return false;
    const text = String(cell.value).trim();
    if (text.length > 80) return false;
    return true;
  };

  const suggestions = [];
  const valueDelta = direction === "rtl" ? -1 : 1;

  for (let r = startRow; r <= endRow; r += 1) {
    for (let c = startColumn; c <= endColumn; c += 1) {
      if (covered.has(`${r}:${c}`)) continue;
      const labelCell = byKey.get(`${r}:${c}`);
      if (!isLabel(labelCell)) continue;

      const valueCol = c + valueDelta;
      if (valueCol < startColumn || valueCol > endColumn) continue;
      if (covered.has(`${r}:${valueCol}`)) continue;

      const valueCell = byKey.get(`${r}:${valueCol}`);
      // Suggest when value cell is empty OR missing from sparse cells list
      if (!isEmpty(valueCell) && valueCell) continue;

      // Avoid suggesting decorative empties under big section headers in same column only
      const label = String(labelCell.value).trim();
      const confidence =
        label.length >= 2 && label.length <= 40 && !mergeAnchors.has(`${r}:${valueCol}`)
          ? "high"
          : "low";

      const type = guessType(label);
      suggestions.push({
        id: `sug-${r}-${valueCol}`,
        row: r,
        column: valueCol,
        label,
        type,
        confidence,
        cellRef: `${colIndexToLetters(valueCol)}${r}`,
        confirmed: false,
      });
    }
  }

  return suggestions;
}

function guessType(label) {
  const l = label.toLowerCase();
  if (/وصف|notes|description|ملاحظات|بيان/.test(l)) return "textarea";
  if (/دولة|مدينة|country|city|قسم|جهة|نوع|status|حالة/.test(l)) return "select";
  if (/رقم|id|count|عدد|كمية|amount|نسبة|%/.test(l)) return "number";
  return "text";
}

/**
 * Apply confirmed suggestions onto workbook.fields.
 * @param {object} workbook
 * @param {Array} confirmedSuggestions
 */
export function applyConfirmedFields(workbook, confirmedSuggestions) {
  const fields = confirmedSuggestions.map((s, i) => ({
    id: s.id || `field-${i + 1}`,
    label: s.label,
    type: s.type || "text",
    row: s.row,
    column: s.column,
    cellRef: s.cellRef,
    required: Boolean(s.required),
    readOnly: Boolean(s.readOnly),
  }));
  return { ...workbook, fields };
}
