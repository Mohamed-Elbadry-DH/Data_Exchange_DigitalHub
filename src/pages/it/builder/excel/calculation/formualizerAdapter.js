import { HyperFormula } from "hyperformula";
import { colIndexToLetters } from "../ingestion/ooxmlReader.js";
import { normalizeFormula } from "./formulaNormalize.js";
import { normalizeInputValue } from "./inputNormalize.js";
import { FORMULA_PROFILE, P0_FUNCTIONS } from "./formulaRegistry.js";
import {
  ERROR_CODES,
  makeError,
  mapEngineErrorToken,
} from "./calculationErrors.js";
import { validateFormulaTextSimple } from "./formulaValidation.js";

/**
 * HyperFormula-backed load / evaluate / diff.
 * Coordinates: Excel 1-based → HF 0-based.
 */

export function createEmptyCalcState() {
  return {
    formulaCells: new Map(),
    previousValues: {},
    previousErrors: {},
    initWarnings: [],
  };
}

export function cellRefFromRowCol(row, column) {
  return `${colIndexToLetters(column)}${row}`;
}

export function parseCellRef(ref) {
  const m = String(ref).trim().match(/^([A-Za-z]+)(\d+)$/);
  if (!m) return null;
  let col = 0;
  const letters = m[1].toUpperCase();
  for (let i = 0; i < letters.length; i += 1) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return { column: col, row: Number(m[2]) };
}

function toHfAddr(sheetId, row, column) {
  return { sheet: sheetId, row: row - 1, col: column - 1 };
}

export function extractWorkbookPayload(workbook) {
  const sheetName = workbook?.sheet?.name || "Sheet1";
  const formulaCells = [];
  const valueCells = [];

  for (const cell of workbook?.cells || []) {
    const ref = cellRefFromRowCol(cell.row, cell.column);
    const formula = normalizeFormula(cell.formula);
    if (formula) {
      formulaCells.push({
        ref,
        row: cell.row,
        column: cell.column,
        formula,
        cachedResult: cell.value ?? null,
      });
      continue;
    }
    if (cell.value != null && cell.value !== "") {
      valueCells.push({
        ref,
        row: cell.row,
        column: cell.column,
        value: normalizeInputValue(cell.value),
      });
    }
  }

  return { sheetName, formulaCells, valueCells };
}

/**
 * @param {object} _deps unused — kept for call-site compatibility
 * @param {object} workbook
 */
export async function loadWorkbookIntoEngine(_deps, workbook) {
  const { sheetName, formulaCells, valueCells } = extractWorkbookPayload(workbook);

  const hf = HyperFormula.buildEmpty({
    licenseKey: "gpl-v3",
    useColumnIndex: false,
  });
  // Ensure sheet exists with a stable name
  const names = hf.getSheetNames();
  if (!names.includes(sheetName)) {
    if (names.length === 1 && names[0] === "Sheet1" && sheetName !== "Sheet1") {
      hf.renameSheet(0, sheetName);
    } else if (!names.length) {
      hf.addSheet(sheetName);
    } else {
      hf.addSheet(sheetName);
    }
  }
  const sheetId = hf.getSheetId(sheetName);

  const state = createEmptyCalcState();

  for (const fc of formulaCells) {
    const validation = validateFormulaTextSimple(fc.formula);
    if (!validation.ok) {
      const primary = validation.errors[0];
      state.previousErrors[fc.ref] = primary;
      state.initWarnings.push({ cellRef: fc.ref, ...primary });
      state.formulaCells.set(fc.ref, fc);
      continue;
    }
    state.formulaCells.set(fc.ref, fc);
    hf.setCellContents(toHfAddr(sheetId, fc.row, fc.column), [[fc.formula]]);
  }

  for (const vc of valueCells) {
    if (vc.value === null) continue;
    hf.setCellContents(toHfAddr(sheetId, vc.row, vc.column), [[vc.value]]);
  }

  const result = evaluateAndDiff(hf, sheetId, state);

  return {
    wb: hf,
    sheetId,
    sheetName,
    state,
    meta: {
      engine: "hyperformula",
      engineVersion: HyperFormula.version || "3.x",
      formulaProfile: FORMULA_PROFILE,
    },
    ...result,
  };
}

export function applyValuesToEngine(hf, sheetId, valuesMap) {
  for (const [ref, raw] of Object.entries(valuesMap || {})) {
    const coords = parseCellRef(ref);
    if (!coords) continue;
    const value = normalizeInputValue(raw);
    // null clears the cell
    hf.setCellContents(toHfAddr(sheetId, coords.row, coords.column), [[value]]);
  }
}

export function evaluateAndDiff(hf, sheetId, state) {
  const nextValues = {};
  const nextErrors = { ...pickBlockedErrors(state) };

  try {
    for (const [ref, meta] of state.formulaCells) {
      if (nextErrors[ref] && isBlockedInitError(nextErrors[ref])) {
        continue;
      }

      const raw = hf.getCellValue(toHfAddr(sheetId, meta.row, meta.column));

      if (raw != null && typeof raw === "object" && raw.type) {
        const token = raw.value || raw.type;
        const code = mapEngineErrorToken(token) || mapHfErrorType(raw.type);
        nextErrors[ref] = makeError(code, { engineToken: token });
        continue;
      }

      if (raw === undefined || raw === null || raw === "") {
        continue;
      }

      nextValues[ref] = raw;
    }
  } catch (e) {
    return {
      changedValues: {},
      removedValues: [],
      errors: {
        ...state.previousErrors,
        __engine: makeError(ERROR_CODES.CALCULATION_ERROR, {
          detail: String(e?.message || e),
        }),
      },
      clearedErrors: [],
      engineError: String(e?.message || e),
    };
  }

  const changedValues = {};
  const removedValues = [];
  const clearedErrors = [];
  const errorsDelta = {};

  const prevValues = state.previousValues;
  const prevErrors = state.previousErrors;

  for (const [ref, val] of Object.entries(nextValues)) {
    if (!Object.is(prevValues[ref], val)) {
      changedValues[ref] = val;
    }
  }
  for (const ref of Object.keys(prevValues)) {
    if (!(ref in nextValues)) {
      removedValues.push(ref);
    }
  }

  for (const [ref, err] of Object.entries(nextErrors)) {
    const prev = prevErrors[ref];
    if (!prev || prev.code !== err.code || prev.displayValue !== err.displayValue) {
      errorsDelta[ref] = err;
    }
  }
  for (const ref of Object.keys(prevErrors)) {
    if (!(ref in nextErrors)) {
      clearedErrors.push(ref);
    }
  }

  state.previousValues = nextValues;
  state.previousErrors = nextErrors;

  return {
    changedValues,
    removedValues,
    errors: errorsDelta,
    clearedErrors,
    snapshotValues: nextValues,
    snapshotErrors: nextErrors,
  };
}

function mapHfErrorType(type) {
  const t = String(type || "").toUpperCase();
  if (t.includes("CYCLE") || t.includes("CIRC")) return ERROR_CODES.CIRCULAR_REFERENCE;
  if (t.includes("DIV")) return ERROR_CODES.DIVIDE_BY_ZERO;
  if (t.includes("REF")) return ERROR_CODES.INVALID_REFERENCE;
  if (t.includes("VALUE")) return ERROR_CODES.VALUE_ERROR;
  if (t.includes("NAME")) return ERROR_CODES.NAME_ERROR;
  if (t.includes("NUM") || t.includes("NA") || t.includes("ERROR")) {
    return ERROR_CODES.CALCULATION_ERROR;
  }
  return ERROR_CODES.CALCULATION_ERROR;
}

function pickBlockedErrors(state) {
  const out = {};
  for (const [ref, err] of Object.entries(state.previousErrors || {})) {
    if (isBlockedInitError(err)) out[ref] = err;
  }
  return out;
}

function isBlockedInitError(err) {
  if (!err?.code) return false;
  return (
    err.code === ERROR_CODES.UNSUPPORTED_FUNCTION ||
    err.code === ERROR_CODES.CROSS_SHEET_REFERENCE_NOT_SUPPORTED ||
    err.code === ERROR_CODES.EXTERNAL_REFERENCE_NOT_SUPPORTED ||
    err.code === ERROR_CODES.INVALID_FORMULA
  );
}

// silence unused import warning if tree-shaken oddly
void P0_FUNCTIONS;
