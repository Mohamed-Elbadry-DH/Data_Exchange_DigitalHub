/**
 * Pure helpers — no Formualizer import (safe for React renderer).
 */

/**
 * Apply a CALCULATION_RESULT / READY payload onto React state bags.
 */
export function applyCalculationPayload(
  payload,
  { calculatedValues, calculationErrors },
) {
  const nextValues = { ...calculatedValues };
  const nextErrors = { ...calculationErrors };

  for (const ref of payload.removedValues || []) {
    delete nextValues[ref];
  }
  for (const [ref, val] of Object.entries(payload.changedValues || {})) {
    nextValues[ref] = val;
  }
  for (const ref of payload.clearedErrors || []) {
    delete nextErrors[ref];
  }
  for (const [ref, err] of Object.entries(payload.errors || {})) {
    if (ref === "__engine") continue;
    nextErrors[ref] = err;
    delete nextValues[ref];
  }

  return { calculatedValues: nextValues, calculationErrors: nextErrors };
}

/**
 * Unified cell display resolution.
 */
export function resolveCellValue({
  cellRef,
  cell,
  cellValues,
  calculatedValues,
  calculationErrors,
  calculationStatus,
}) {
  const err = calculationErrors?.[cellRef];
  if (err) {
    return { kind: "error", value: err.displayValue, error: err };
  }

  const isFormula = Boolean(cell?.formula);
  if (isFormula) {
    if (Object.prototype.hasOwnProperty.call(calculatedValues || {}, cellRef)) {
      return { kind: "calculated", value: calculatedValues[cellRef] };
    }
    if (calculationStatus === "initializing" || calculationStatus === "idle") {
      if (cell?.value != null && cell.value !== "") {
        return { kind: "cached", value: cell.value };
      }
    }
    return { kind: "calculated", value: null };
  }

  if (Object.prototype.hasOwnProperty.call(cellValues || {}, cellRef)) {
    return { kind: "input", value: cellValues[cellRef] };
  }

  if (cell?.value != null && cell.value !== "") {
    return { kind: "original", value: cell.value };
  }

  return { kind: "empty", value: null };
}
