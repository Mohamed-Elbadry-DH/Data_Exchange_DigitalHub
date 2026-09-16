/**
 * Canonical Excel formula text always starts with "=".
 * ExcelJS often stores formulas without the leading equals.
 */
export function normalizeFormula(formula) {
  if (formula == null) return null;
  const raw = String(formula).trim();
  if (!raw) return null;
  return raw.startsWith("=") ? raw : `=${raw}`;
}
