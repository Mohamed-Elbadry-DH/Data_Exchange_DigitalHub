import { defaultCellStyle } from "../model/workbookSchema.js";

const BORDER_STYLES = new Set([
  "thin",
  "medium",
  "thick",
  "dotted",
  "dashed",
  "double",
  "hair",
  "mediumDashed",
  "dashDot",
  "mediumDashDot",
  "dashDotDot",
  "mediumDashDotDot",
  "slantDashDot",
]);

/**
 * @param {ReturnType<import('./colorResolver.js').createColorResolver>} colorResolver
 * @param {object|undefined} excelJsStyle - ExcelJS cell style
 */
export function normalizeExcelJsStyle(colorResolver, excelJsStyle) {
  const base = defaultCellStyle();
  if (!excelJsStyle) return base;

  const font = excelJsStyle.font || {};
  base.font = {
    family: font.name || base.font.family,
    size: typeof font.size === "number" ? font.size : base.font.size,
    bold: Boolean(font.bold),
    italic: Boolean(font.italic),
    underline: Boolean(font.underline),
    color: colorResolver.resolve(font.color) ?? null,
  };

  const fillObj = excelJsStyle.fill;
  if (fillObj && fillObj.type !== "none") {
    const fg = colorResolver.resolve(fillObj.fgColor);
    const bg = colorResolver.resolve(fillObj.bgColor);
    const pattern = fillObj.pattern || fillObj.type;
    // Pattern solid / gray125: foreground is the visible fill in Excel.
    const c =
      pattern === "solid" || pattern === "gray125" || pattern === "gray0625"
        ? fg || bg
        : fg || bg;
    if (c) {
      base.fill = { type: "solid", color: c };
    }
  }

  const align = excelJsStyle.alignment || {};
  base.alignment = {
    horizontal: mapHorizontal(align.horizontal),
    vertical: mapVertical(align.vertical),
    wrapText: Boolean(align.wrapText),
    textRotation: typeof align.textRotation === "number" ? align.textRotation : 0,
    indent: typeof align.indent === "number" ? align.indent : 0,
  };

  base.borders = {
    top: normalizeBorder(colorResolver, excelJsStyle.border?.top),
    right: normalizeBorder(colorResolver, excelJsStyle.border?.right),
    bottom: normalizeBorder(colorResolver, excelJsStyle.border?.bottom),
    left: normalizeBorder(colorResolver, excelJsStyle.border?.left),
  };

  if (base.font.color == null) {
    base.font.color = "#000000";
  }

  if (hasColoredFill(base.fill)) {
    base.font.color = "#FFFFFF";
  }

  return base;
}

export function hasColoredFill(fill) {
  if (!fill || fill.type !== "solid" || !fill.color) return false;
  const hex = String(fill.color).replace(/^#/, "").toUpperCase();
  const full = hex.length === 6 ? hex : hex.length === 8 ? hex.slice(2) : null;
  if (!full) return false;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (r >= 248 && g >= 248 && b >= 248) return false;
  return true;
}

function mapHorizontal(h) {
  const map = {
    left: "left",
    center: "center",
    right: "right",
    fill: "fill",
    justify: "justify",
    centerContinuous: "center",
    distributed: "distributed",
    general: "general",
  };
  return map[h] || "general";
}

function mapVertical(v) {
  const map = {
    top: "top",
    middle: "middle",
    center: "middle",
    bottom: "bottom",
    distributed: "distributed",
    justify: "justify",
  };
  return map[v] || "bottom";
}

function normalizeBorder(colorResolver, side) {
  if (!side || !side.style) return null;
  const style = BORDER_STYLES.has(side.style) ? side.style : "thin";
  return {
    style,
    color: colorResolver.resolve(side.color) || "#000000",
  };
}

/**
 * Merge enrichment style (partial) onto a canonical style.
 */
export function mergeStyles(base, patch) {
  if (!patch) return base;
  return {
    font: { ...base.font, ...(patch.font || {}) },
    fill: patch.fill ? { ...base.fill, ...patch.fill } : base.fill,
    alignment: { ...base.alignment, ...(patch.alignment || {}) },
    borders: {
      top: patch.borders?.top !== undefined ? patch.borders.top : base.borders.top,
      right: patch.borders?.right !== undefined ? patch.borders.right : base.borders.right,
      bottom: patch.borders?.bottom !== undefined ? patch.borders.bottom : base.borders.bottom,
      left: patch.borders?.left !== undefined ? patch.borders.left : base.borders.left,
    },
  };
}

/** CSS border-width from Excel border style name. */
export function borderStyleToCss(style) {
  switch (style) {
    case "hair":
    case "dotted":
      return "1px dotted";
    case "dashed":
    case "dashDot":
    case "dashDotDot":
      return "1px dashed";
    case "medium":
    case "mediumDashed":
    case "mediumDashDot":
    case "mediumDashDotDot":
      return "2px solid";
    case "thick":
      return "3px solid";
    case "double":
      return "3px double";
    case "thin":
    default:
      return "1px solid";
  }
}
