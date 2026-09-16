import { normalizeFormula } from "./formulaNormalize.js";
import { P0_FUNCTIONS } from "./formulaRegistry.js";
import {
  ERROR_CODES,
  makeError,
} from "./calculationErrors.js";

/**
 * Walk a Formualizer-like AST (optional) — kept for compatibility.
 */
export function validateFormulaAst(ast) {
  const functions = [];
  const errors = [];

  function walk(node) {
    if (!node || typeof node !== "object") return;

    if (node.type === "error") {
      const msg = String(node.message || "");
      if (/external reference/i.test(msg)) {
        errors.push(makeError(ERROR_CODES.EXTERNAL_REFERENCE_NOT_SUPPORTED, { detail: msg }));
      } else {
        errors.push(makeError(ERROR_CODES.INVALID_FORMULA, { detail: msg }));
      }
      return;
    }

    if (node.type === "reference" && node.reference) {
      const sheet = node.reference.sheet;
      if (sheet != null && String(sheet).trim() !== "") {
        errors.push(
          makeError(ERROR_CODES.CROSS_SHEET_REFERENCE_NOT_SUPPORTED, {
            detail: String(sheet),
          }),
        );
      }
    }

    if (node.type === "function" && node.name) {
      const name = String(node.name).toUpperCase();
      functions.push(name);
      if (!P0_FUNCTIONS.has(name)) {
        errors.push(
          makeError(ERROR_CODES.UNSUPPORTED_FUNCTION, {
            detail: name,
            functionName: name,
          }),
        );
      }
    }

    if (node.left) walk(node.left);
    if (node.right) walk(node.right);
    if (node.operand) walk(node.operand);
    if (Array.isArray(node.args)) {
      for (const arg of node.args) walk(arg);
    }
  }

  walk(ast);

  const seen = new Set();
  const unique = [];
  for (const err of errors) {
    const key = `${err.code}:${err.detail || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(err);
  }

  return { ok: unique.length === 0, functions, errors: unique };
}

/**
 * Sync P0 validation without WASM — used by HyperFormula adapter.
 */
export function validateFormulaTextSimple(formula) {
  const canonical = normalizeFormula(formula);
  if (!canonical) {
    return {
      ok: false,
      formula: null,
      functions: [],
      errors: [makeError(ERROR_CODES.INVALID_FORMULA)],
    };
  }

  const errors = [];
  const functions = [];

  if (/\[[^\]]*\]/.test(canonical)) {
    errors.push(makeError(ERROR_CODES.EXTERNAL_REFERENCE_NOT_SUPPORTED));
  }

  // Sheet2!A1 or 'Name'!A1
  if (/(?:'[^']+'|[A-Za-z0-9_]+)!/.test(canonical)) {
    errors.push(makeError(ERROR_CODES.CROSS_SHEET_REFERENCE_NOT_SUPPORTED));
  }

  const fnRe = /([A-Za-z_][A-Za-z0-9_.]*)\s*\(/g;
  let m;
  while ((m = fnRe.exec(canonical))) {
    const name = m[1].toUpperCase();
    // Skip Excel structured-ish noise; treat as function names
    if (name === "IF" || name.length >= 2) {
      functions.push(name);
      if (!P0_FUNCTIONS.has(name)) {
        errors.push(
          makeError(ERROR_CODES.UNSUPPORTED_FUNCTION, {
            detail: name,
            functionName: name,
          }),
        );
      }
    }
  }

  const seen = new Set();
  const unique = [];
  for (const err of errors) {
    const key = `${err.code}:${err.detail || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(err);
  }

  return {
    ok: unique.length === 0,
    formula: canonical,
    functions,
    errors: unique,
  };
}

export function validateFormulaText(formula, parseFn) {
  if (!parseFn) {
    return Promise.resolve(validateFormulaTextSimple(formula));
  }
  const canonical = normalizeFormula(formula);
  if (!canonical) {
    return Promise.resolve({
      ok: false,
      formula: null,
      functions: [],
      errors: [makeError(ERROR_CODES.INVALID_FORMULA)],
    });
  }
  return Promise.resolve(parseFn(canonical)).then((ast) => {
    const result = validateFormulaAst(ast);
    return { ...result, formula: canonical };
  });
}
