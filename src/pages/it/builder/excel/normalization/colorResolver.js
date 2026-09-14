/**
 * Resolve OOXML / ExcelJS colors (RGB, ARGB, theme + tint) to #RRGGBB.
 */

/** Default Office theme palette (fallback when theme1.xml missing). */
export const DEFAULT_THEME_COLORS = Object.freeze([
  "FFFFFF", // lt1 / bg1
  "000000", // dk1 / tx1
  "E7E6E6", // lt2 / bg2
  "44546A", // dk2 / tx2
  "4472C4", // accent1
  "ED7D31", // accent2
  "A5A5A5", // accent3
  "FFC000", // accent4
  "5B9BD5", // accent5
  "70AD47", // accent6
  "0563C1", // hlink
  "954F72", // folHlink
]);

function clampByte(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function hexToRgb(hex) {
  const h = String(hex).replace(/^#/, "").replace(/^FF/i, "").toUpperCase();
  const full = h.length === 8 ? h.slice(2) : h.length === 6 ? h : h.padStart(6, "0").slice(-6);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const to = (n) => clampByte(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${to(r)}${to(g)}${to(b)}`;
}

/**
 * Apply OOXML tint (-1..1) to an RGB hex.
 * Positive tint → toward white; negative → toward black.
 */
export function applyTint(hex, tint) {
  if (tint == null || tint === 0 || Number.isNaN(Number(tint))) {
    return rgbToHex(hexToRgb(hex));
  }
  const { r, g, b } = hexToRgb(hex);
  const t = Number(tint);
  const channel = (c) => {
    if (t < 0) return c * (1 + t);
    return c + (255 - c) * t;
  };
  return rgbToHex({ r: channel(r), g: channel(g), b: channel(b) });
}

/**
 * @param {string[]} themeColors - 12 theme colors as RRGGBB (no #)
 */
export function createColorResolver(themeColors = DEFAULT_THEME_COLORS) {
  const theme = themeColors.length >= 12 ? themeColors : DEFAULT_THEME_COLORS;

  /**
   * @param {object|string|null|undefined} color
   * ExcelJS color: { argb } | { theme, tint } | { indexed }
   * OOXML-ish: { rgb } | { theme, tint }
   * @returns {string|null} #RRGGBB
   */
  function resolve(color) {
    if (color == null) return null;
    if (typeof color === "string") {
      const s = color.trim();
      if (!s) return null;
      if (s.startsWith("#")) return applyTint(s, 0);
      if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s.toUpperCase()}`;
      if (/^[0-9A-Fa-f]{8}$/.test(s)) return `#${s.slice(2).toUpperCase()}`;
      return null;
    }

    if (typeof color !== "object") return null;

    if (color.argb != null) {
      const a = String(color.argb).replace(/^#/, "").toUpperCase();
      if (a.length === 8) return `#${a.slice(2)}`;
      if (a.length === 6) return `#${a}`;
    }

    if (color.theme == null && color.tint == null && color.indexed == null && color.rgb == null) {
      // ExcelJS sometimes nests as { color: { argb } }
      const nested = color.color;
      if (nested) return resolve(nested);
    }

    if (color.rgb) {
      return resolve(String(color.rgb));
    }

    if (color.theme != null) {
      const idx = Number(color.theme);
      const base = theme[idx] || theme[0] || "000000";
      return applyTint(base, color.tint);
    }

    // Indexed palette — common defaults
    if (color.indexed != null) {
      const indexed = INDEXED_COLORS[Number(color.indexed)];
      if (indexed) return `#${indexed}`;
    }

    return null;
  }

  return { resolve, theme };
}

/** Subset of Excel indexed colors commonly seen. */
const INDEXED_COLORS = {
  0: "000000",
  1: "FFFFFF",
  2: "FF0000",
  3: "00FF00",
  4: "0000FF",
  5: "FFFF00",
  6: "FF00FF",
  7: "00FFFF",
  8: "000000",
  9: "FFFFFF",
  10: "FF0000",
  11: "00FF00",
  12: "0000FF",
  13: "FFFF00",
  14: "FF00FF",
  15: "00FFFF",
  64: "000000",
};
