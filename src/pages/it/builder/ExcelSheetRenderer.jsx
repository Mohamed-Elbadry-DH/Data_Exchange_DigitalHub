import { borderStyleToCss, hasColoredFill } from "./excel/normalization/normalizeStyles.js";
import {
  buildBandFillMaps,
  resolveEffectiveFill,
} from "./excel/normalization/bandFillResolver.js";
import { excelRowHeightToPx } from "./excel/normalization/dimensionResolver.js";
import { cellRefFromCoords } from "./excel/interaction/editableCellIndex.js";
import {
  formatNumericDisplay,
  parseNumericInput,
} from "./excel/interaction/parseNumericInput.js";
import { resolveCellValue } from "./excel/calculation/calculationState.js";

/** Minimum row height in preview (matches typical form rows ~23pt). */
const MIN_ROW_PX = 31;

/**
 * Renders WorkbookJSON as a CSS Grid replica.
 * In edit mode, editable cells come from editableIndex (Auto Input Policy), not fields[].
 */
export default function ExcelSheetRenderer({
  workbook,
  mode = "view",
  editableIndex = null,
  values = {},
  calculatedValues = {},
  calculationErrors = {},
  calculationStatus = "idle",
  onValueChange,
  showEditableAffordances = false,
}) {
  if (!workbook?.sheet) return null;

  const { sheet, rows, columns, cells, merges } = workbook;
  const { startRow, endRow, startColumn, endColumn } = sheet.usedRange;

  const rowCount = endRow - startRow + 1;
  const colCount = endColumn - startColumn + 1;

  const heightByIndex = new Map(rows.map((r) => [r.index, r.heightPx]));
  const widthByIndex = new Map(columns.map((c) => [c.index, c.widthPx]));

  const gridTemplateColumns = Array.from({ length: colCount }, (_, i) => {
    const idx = startColumn + i;
    return `${widthByIndex.get(idx) || 64}px`;
  }).join(" ");

  const defaultRowPx = excelRowHeightToPx(sheet.defaultRowHeight ?? 15);
  const gridTemplateRows = Array.from({ length: rowCount }, (_, i) => {
    const idx = startRow + i;
    const h = heightByIndex.get(idx) ?? defaultRowPx;
    return `${Math.max(h, MIN_ROW_PX)}px`;
  }).join(" ");

  const mergeByAnchor = new Map();
  const covered = new Set();
  for (const m of merges || []) {
    mergeByAnchor.set(`${m.startRow}:${m.startColumn}`, m);
    for (let r = m.startRow; r <= m.endRow; r += 1) {
      for (let c = m.startColumn; c <= m.endColumn; c += 1) {
        if (r === m.startRow && c === m.startColumn) continue;
        covered.add(`${r}:${c}`);
      }
    }
  }

  const cellByKey = new Map(cells.map((c) => [`${c.row}:${c.column}`, c]));
  const bandMaps = buildBandFillMaps(cells, merges, {
    startRow,
    endRow,
    startColumn,
    endColumn,
  });

  const nodes = [];
  for (let r = startRow; r <= endRow; r += 1) {
    for (let c = startColumn; c <= endColumn; c += 1) {
      const key = `${r}:${c}`;
      if (covered.has(key)) continue;

      const merge = mergeByAnchor.get(key);
      const cell = cellByKey.get(key);
      const ref = cellRefFromCoords(r, c);
      const editMeta = mode === "edit" ? editableIndex?.get(ref) : null;

      const gridColumn = merge
        ? `${c - startColumn + 1} / ${merge.endColumn - startColumn + 2}`
        : `${c - startColumn + 1}`;
      const gridRow = merge
        ? `${r - startRow + 1} / ${merge.endRow - startRow + 2}`
        : `${r - startRow + 1}`;

      const effectiveBorders = resolveEffectiveBorders(cell, r, c, cellByKey);
      const effectiveFill = resolveEffectiveFill(cell, r, c, bandMaps);
      const style = cellStyleToCss(cell?.style, {
        editableAffordance: Boolean(editMeta && showEditableAffordances),
        borders: effectiveBorders,
        fill: effectiveFill,
      });
      style.gridColumn = gridColumn;
      style.gridRow = gridRow;

      const resolved = resolveCellValue({
        cellRef: ref,
        cell,
        cellValues: values,
        calculatedValues,
        calculationErrors,
        calculationStatus,
      });

      nodes.push(
        <div
          key={key}
          className={`excel-cell min-w-0 min-h-0 overflow-hidden box-border${
            editMeta && showEditableAffordances ? " excel-cell--editable" : ""
          }${resolved.kind === "error" ? " excel-cell--calc-error" : ""}`}
          style={style}
          data-cell={ref}
          title={resolved.error?.message || undefined}
        >
          {editMeta ? (
            <NumericCellInput
              cellRef={ref}
              row={r}
              column={c}
              sheetDirection={sheet.direction || "ltr"}
              editableIndex={editableIndex}
              stored={values[ref]}
              onCommit={(numOrNull, display) => onValueChange?.(ref, numOrNull, display)}
              style={{
                ...(cell?.style || {}),
                fill: effectiveFill,
              }}
              ariaLabel={ref}
            />
          ) : (
            <span
              className={`flex items-center w-full h-full min-h-0 px-1 leading-normal${
                resolved.kind === "error"
                  ? " text-[#dc2626]"
                  : resolved.kind === "calculated" || resolved.kind === "cached"
                    ? " font-semibold"
                    : ""
              }`}
              data-calc-kind={resolved.kind}
            >
              {formatResolvedDisplay(resolved)}
            </span>
          )}
        </div>,
      );
    }
  }

  return (
    <div
      className="w-full overflow-auto rounded-[12px] border border-[#d8d8d8] bg-white"
      dir={sheet.direction || "ltr"}
    >
      <div
        className="excel-sheet-grid"
        style={{
          display: "grid",
          gridTemplateColumns,
          gridTemplateRows,
          width: "max-content",
          minWidth: "100%",
        }}
      >
        {nodes}
      </div>
    </div>
  );
}

function formatResolvedDisplay(resolved) {
  if (resolved.value == null || resolved.value === "") return "\u00a0";
  if (typeof resolved.value === "number") {
    return Number.isFinite(resolved.value) ? String(resolved.value) : "\u00a0";
  }
  return String(resolved.value);
}

function NumericCellInput({
  cellRef,
  row,
  column,
  sheetDirection = "ltr",
  editableIndex,
  stored,
  onCommit,
  style,
  ariaLabel,
}) {
  const displayValue = formatNumericDisplay(stored);

  const font = style?.font || {};
  const align = style?.alignment || {};

  return (
    <input
      type="text"
      inputMode="decimal"
      dir="ltr"
      data-excel-input={cellRef}
      className="excel-number-input w-full min-h-full h-full border-0 outline-none bg-transparent box-border px-1 py-0 m-0"
      style={{
        fontFamily: font.family ? `${font.family}, Cairo, sans-serif` : "inherit",
        fontSize: font.size ? `${font.size}pt` : "inherit",
        fontWeight: font.bold ? 700 : "inherit",
        fontStyle: font.italic ? "italic" : "inherit",
        color: font.color || "inherit",
        textAlign: mapTextAlign(align.horizontal),
        lineHeight: "normal",
      }}
      value={displayValue}
      aria-label={ariaLabel || cellRef}
      onChange={(e) => {
        const raw = e.target.value;
        const parsed = parseNumericInput(raw);
        if (parsed.ok) {
          onCommit(parsed.value, parsed.display);
        } else {
          onCommit(undefined, raw);
        }
      }}
      onKeyDown={(e) => {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;

        const move = resolveArrowNavKey(e, sheetDirection);
        if (!move) return;

        const next = findNextEditableCell(editableIndex, row, column, move);
        if (!next) {
          if (e.key === "Enter") e.preventDefault();
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        focusEditableInput(next.ref);
      }}
    />
  );
}

/** Map keyboard key → grid move, with RTL-aware left/right. Enter = down. */
function resolveArrowNavKey(e, sheetDirection) {
  const key = e.key;
  if (key === "Enter") return "down";
  if (key === "ArrowUp") return "up";
  if (key === "ArrowDown") return "down";
  if (key === "ArrowLeft") return sheetDirection === "rtl" ? "right" : "left";
  if (key === "ArrowRight") return sheetDirection === "rtl" ? "left" : "right";
  return null;
}

function findNextEditableCell(editableIndex, row, column, move) {
  if (!editableIndex?.size) return null;

  const entries = [];
  for (const [ref, meta] of editableIndex) {
    entries.push({
      ref,
      row: meta.row,
      column: meta.column,
    });
  }

  if (move === "down") {
    return entries
      .filter((e) => e.column === column && e.row > row)
      .sort((a, b) => a.row - b.row)[0] || null;
  }
  if (move === "up") {
    return entries
      .filter((e) => e.column === column && e.row < row)
      .sort((a, b) => b.row - a.row)[0] || null;
  }
  if (move === "right") {
    return entries
      .filter((e) => e.row === row && e.column > column)
      .sort((a, b) => a.column - b.column)[0] || null;
  }
  if (move === "left") {
    return entries
      .filter((e) => e.row === row && e.column < column)
      .sort((a, b) => b.column - a.column)[0] || null;
  }
  return null;
}

function focusEditableInput(ref) {
  const el = document.querySelector(`input[data-excel-input="${CSS.escape(ref)}"]`);
  if (!el) return;
  el.focus();
  const len = el.value?.length ?? 0;
  try {
    el.setSelectionRange(0, len);
  } catch {
    /* ignore */
  }
}

function cellStyleToCss(style, { editableAffordance, borders: borderOverride, fill: fillOverride } = {}) {
  const font = style?.font || {};
  const align = style?.alignment || {};
  const borders = borderOverride || style?.borders || {};
  const fill = fillOverride || style?.fill || {};
  const baseBg =
    fill.type === "solid" && fill.color ? fill.color : "#ffffff";

  const css = {
    display: "flex",
    alignItems: "center",
    justifyContent: mapJustify(align.horizontal),
    background: baseBg,
    color: hasColoredFill(style?.fill) ? "#FFFFFF" : font.color || "#000000",
    fontFamily: font.family
      ? `${font.family}, Cairo, sans-serif`
      : "Calibri, Cairo, sans-serif",
    fontSize: font.size ? `${font.size}pt` : "11pt",
    fontWeight: font.bold ? 700 : 400,
    fontStyle: font.italic ? "italic" : "normal",
    textDecoration: font.underline ? "underline" : "none",
    whiteSpace: align.wrapText ? "pre-wrap" : "nowrap",
    overflow: "hidden",
    textOverflow: align.wrapText ? "clip" : "ellipsis",
    paddingInlineStart: align.indent ? `${align.indent * 8}px` : undefined,
    boxShadow: editableAffordance
      ? "inset 0 0 0 1px rgba(9, 134, 237, 0.28)"
      : undefined,
    boxSizing: "border-box",
  };

  applyCellBorders(css, borders);

  return css;
}

/** Only borders imported from Excel (including shared edges copied from neighbors). */
function applyCellBorders(css, borders) {
  if (borders.top) {
    css.borderTop = `${borderStyleToCss(borders.top.style)} ${borders.top.color}`;
  }
  if (borders.right) {
    css.borderRight = `${borderStyleToCss(borders.right.style)} ${borders.right.color}`;
  }
  if (borders.bottom) {
    css.borderBottom = `${borderStyleToCss(borders.bottom.style)} ${borders.bottom.color}`;
  }
  if (borders.left) {
    css.borderLeft = `${borderStyleToCss(borders.left.style)} ${borders.left.color}`;
  }
}

/**
 * Excel stores one border per shared edge — mirror neighbor side without inventing styles.
 */
function resolveEffectiveBorders(cell, row, column, cellByKey) {
  const borders = {
    top: null,
    right: null,
    bottom: null,
    left: null,
    ...(cell?.style?.borders || {}),
  };

  const neighborSide = (side, key, opp) => {
    if (borders[side]) return;
    const n = cellByKey.get(key);
    const b = n?.style?.borders?.[opp];
    if (b) borders[side] = b;
  };

  neighborSide("left", `${row}:${column - 1}`, "right");
  neighborSide("right", `${row}:${column + 1}`, "left");
  neighborSide("top", `${row - 1}:${column}`, "bottom");
  neighborSide("bottom", `${row + 1}:${column}`, "top");

  return borders;
}

function mapJustify(h) {
  if (h === "center") return "center";
  if (h === "right") return "flex-end";
  if (h === "justify" || h === "distributed") return "space-between";
  return "flex-start";
}

function mapTextAlign(h) {
  if (h === "center") return "center";
  if (h === "right") return "right";
  if (h === "justify") return "justify";
  return "left";
}
