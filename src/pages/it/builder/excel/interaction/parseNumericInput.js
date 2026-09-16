/**
 * Parse user text into a number (Arabic-Indic digits + western decimals).
 * Returns null for empty/invalid intermediate strings (keep as text in UI).
 */

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function normalizeDigits(s) {
  let out = "";
  for (const ch of s) {
    const a = ARABIC_DIGITS.indexOf(ch);
    if (a >= 0) {
      out += String(a);
      continue;
    }
    const e = EASTERN_DIGITS.indexOf(ch);
    if (e >= 0) {
      out += String(e);
      continue;
    }
    out += ch;
  }
  return out.replace(/,/g, ".").replace(/\u066B/g, ".").replace(/\u066C/g, "");
}

/**
 * @param {string} raw
 * @returns {{ ok: true, value: number | null, display: string } | { ok: false, display: string }}
 */
export function parseNumericInput(raw) {
  const display = raw == null ? "" : String(raw);
  const trimmed = display.trim();
  if (trimmed === "") {
    return { ok: true, value: null, display: "" };
  }

  const normalized = normalizeDigits(trimmed);
  // Allow intermediate typing: "-", ".", "-."
  if (normalized === "-" || normalized === "." || normalized === "-.") {
    return { ok: false, display };
  }

  if (!/^-?\d*\.?\d+$/.test(normalized)) {
    return { ok: false, display };
  }

  const n = Number(normalized);
  if (!Number.isFinite(n)) return { ok: false, display };
  return { ok: true, value: n, display };
}

export function formatNumericDisplay(value) {
  if (value == null || value === "") return "";
  if (typeof value === "object" && value != null && "display" in value) {
    return String(value.display ?? "");
  }
  return String(value);
}
