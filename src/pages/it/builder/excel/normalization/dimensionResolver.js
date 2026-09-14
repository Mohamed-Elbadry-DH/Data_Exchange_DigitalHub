/**
 * Excel dimension → CSS pixel conversion.
 * Must run in normalization — never inside the renderer.
 *
 * Column width in Excel is character-based (approx width of '0' in default font).
 * Row height is in points (1 pt = 1/72 inch). We assume 96 DPI for screen.
 */

const DPI = 96;
const PX_PER_POINT = DPI / 72;

/** Default Calibri 11 max digit width approximation used by Excel on Windows. */
const DEFAULT_MDW = 7;

/**
 * @param {number} points
 * @returns {number}
 */
export function pointsToPx(points) {
  if (points == null || Number.isNaN(Number(points))) return Math.round(15 * PX_PER_POINT);
  return Math.max(1, Math.round(Number(points) * PX_PER_POINT));
}

/**
 * Convert Excel column width (character units) to pixels.
 * Formula adapted from ECMA-376 / Excel open XML docs:
 *   px = Truncate(((256 * width + Truncate(128 / MDW)) / 256) * MDW)
 *
 * @param {number} excelWidth
 * @param {number} [mdw=DEFAULT_MDW]
 * @returns {number}
 */
export function excelColumnWidthToPx(excelWidth, mdw = DEFAULT_MDW) {
  const w = Number(excelWidth);
  if (!Number.isFinite(w) || w <= 0) {
    return excelColumnWidthToPx(8.43, mdw);
  }
  const px = Math.floor(((256 * w + Math.floor(128 / mdw)) / 256) * mdw);
  return Math.max(4, px);
}

/**
 * Excel row height is stored in points.
 * @param {number} excelHeightPoints
 * @returns {number}
 */
export function excelRowHeightToPx(excelHeightPoints) {
  return pointsToPx(excelHeightPoints ?? 15);
}

/**
 * Build row/column dimension arrays for used range.
 *
 * @param {{
 *   startRow: number, endRow: number,
 *   startColumn: number, endColumn: number,
 *   defaultRowHeight: number, defaultColumnWidth: number,
 *   rowHeights: Map<number, number>,
 *   colWidths: Map<number, number>,
 * }} opts
 */
export function resolveDimensions(opts) {
  const {
    startRow,
    endRow,
    startColumn,
    endColumn,
    defaultRowHeight,
    defaultColumnWidth,
    rowHeights,
    colWidths,
  } = opts;

  const rows = [];
  for (let r = startRow; r <= endRow; r += 1) {
    const excelHeight = rowHeights.has(r) ? rowHeights.get(r) : defaultRowHeight;
    rows.push({
      index: r,
      excelHeight,
      heightPx: excelRowHeightToPx(excelHeight),
    });
  }

  const columns = [];
  for (let c = startColumn; c <= endColumn; c += 1) {
    const excelWidth = colWidths.has(c) ? colWidths.get(c) : defaultColumnWidth;
    columns.push({
      index: c,
      excelWidth,
      widthPx: excelColumnWidthToPx(excelWidth),
    });
  }

  return { rows, columns };
}
