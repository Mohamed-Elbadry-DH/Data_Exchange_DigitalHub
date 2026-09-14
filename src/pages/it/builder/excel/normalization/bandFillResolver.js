import { hasColoredFill } from "./normalizeStyles.js";

/**
 * Row band preview only: col 1 colored fill → same row for sparse gaps.
 * Does NOT propagate column colors downward (CPI data cells stay white).
 */

/**
 * @param {Array} cells
 * @param {Array} merges
 * @param {{ startRow, endRow, startColumn, endColumn }} range
 */
export function buildBandFillMaps(cells, merges, range) {
  const { startColumn } = range;
  const rowFill = new Map();

  const mergeByAnchor = new Map();
  for (const m of merges || []) {
    mergeByAnchor.set(`${m.startRow}:${m.startColumn}`, m);
  }

  for (const cell of cells || []) {
    const fill = cell.style?.fill;
    if (!hasColoredFill(fill)) continue;

    if (cell.column === startColumn) {
      applyRowBand(rowFill, cell.row, fill, mergeByAnchor.get(`${cell.row}:${cell.column}`));
    }
  }

  return { rowFill, startColumn };
}

function applyRowBand(rowFill, row, fill, merge) {
  if (merge) {
    for (let r = merge.startRow; r <= merge.endRow; r += 1) {
      rowFill.set(r, fill);
    }
    return;
  }
  rowFill.set(row, fill);
}

/**
 * @param {object|null|undefined} cell
 * @param {number} row
 * @param {number} _column
 * @param {ReturnType<typeof buildBandFillMaps>} maps
 */
export function resolveEffectiveFill(cell, row, _column, maps) {
  const own = cell?.style?.fill;
  if (hasColoredFill(own)) return own;

  const rowBand = maps.rowFill.get(row);
  if (rowBand) return rowBand;

  return own || { type: "none", color: null };
}

/** No-op: do not mutate cells[] with inferred fills (preserves Excel ground truth). */
export function applyBandFillsToCells() {}
