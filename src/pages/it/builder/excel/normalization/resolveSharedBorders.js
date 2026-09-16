/**
 * Mirror Excel shared-edge borders onto adjacent cells (same style/color as imported).
 * Does not invent borders — only copies from a neighbor that has that side defined.
 *
 * @param {Array<{ row: number, column: number, style?: object }>} cells
 */
export function resolveSharedBorders(cells) {
  const byKey = new Map(cells.map((c) => [`${c.row}:${c.column}`, c]));

  for (const cell of cells) {
    if (!cell.style) cell.style = { borders: {} };
    if (!cell.style.borders) cell.style.borders = {};

    const { row, column } = cell;
    const b = cell.style.borders;

    if (!b.left) {
      const n = byKey.get(`${row}:${column - 1}`);
      if (n?.style?.borders?.right) b.left = n.style.borders.right;
    }
    if (!b.right) {
      const n = byKey.get(`${row}:${column + 1}`);
      if (n?.style?.borders?.left) b.right = n.style.borders.left;
    }
    if (!b.top) {
      const n = byKey.get(`${row - 1}:${column}`);
      if (n?.style?.borders?.bottom) b.top = n.style.borders.bottom;
    }
    if (!b.bottom) {
      const n = byKey.get(`${row + 1}:${column}`);
      if (n?.style?.borders?.top) b.bottom = n.style.borders.top;
    }
  }
}
