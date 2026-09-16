/**
 * Canonical input values for the calculation engine.
 * UI empty string → BLANK (null), never "".
 * 0 is a real value and must not become blank.
 */

export function normalizeInputValue(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") {
    if (Number.isNaN(value)) return null;
    return value;
  }
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const normalized = trimmed.replace(/,/g, "");
    if (/^[+-]?\d+(\.\d+)?$/.test(normalized)) {
      return Number(normalized);
    }
    return trimmed;
  }
  return value;
}

/** True when the UI/storage considers this an empty input. */
export function isBlankInput(value) {
  return normalizeInputValue(value) === null;
}
