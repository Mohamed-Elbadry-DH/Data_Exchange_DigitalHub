/**
 * Main-thread calculation facade (HyperFormula — pure JS, Vite-safe).
 */

import {
  applyValuesToEngine,
  evaluateAndDiff,
  loadWorkbookIntoEngine,
} from "./formualizerAdapter.js";
import { FORMULA_PROFILE } from "./formulaRegistry.js";
import { ERROR_CODES, makeError } from "./calculationErrors.js";

export {
  applyCalculationPayload,
  resolveCellValue,
} from "./calculationState.js";

let nextWorkbookSeq = 1;

export function createWorkbookId() {
  const id = `wb-${nextWorkbookSeq}`;
  nextWorkbookSeq += 1;
  return id;
}

/**
 * @param {object} handlers
 * @param {(msg: object) => void} [handlers.onMessage]
 */
export function createCalculationEngine(handlers = {}) {
  let requestSeq = 0;
  let latestAppliedRequestId = 0;
  let currentWorkbookId = null;
  let destroyed = false;
  /** @type {Awaited<ReturnType<typeof loadWorkbookIntoEngine>> | null} */
  let runtime = null;
  let ready = false;
  /** @type {Record<string, unknown>} */
  let queuedValues = {};

  function emit(type, requestId, payload) {
    const msg = {
      type,
      requestId,
      workbookId: currentWorkbookId,
      payload,
    };

    const isResult = type === "CALCULATION_RESULT" || type === "READY";
    if (typeof requestId === "number" && isResult) {
      if (requestId < latestAppliedRequestId) {
        return msg;
      }
      latestAppliedRequestId = Math.max(latestAppliedRequestId, requestId);
    }

    handlers.onMessage?.(msg);
    return msg;
  }

  async function flushQueue(requestId) {
    const batch = queuedValues;
    queuedValues = {};
    if (!runtime?.wb || !Object.keys(batch).length) {
      return emit("CALCULATION_RESULT", requestId, {
        changedValues: {},
        removedValues: [],
        errors: {},
        clearedErrors: [],
      });
    }
    applyValuesToEngine(runtime.wb, runtime.sheetId, batch);
    return emitDiff(requestId);
  }

  function emitDiff(requestId) {
    const diff = evaluateAndDiff(runtime.wb, runtime.sheetId, runtime.state);
    if (diff.engineError) {
      return emit("CALCULATION_ERROR", requestId, {
        error: makeError(ERROR_CODES.CALCULATION_ERROR, {
          detail: diff.engineError,
        }),
        changedValues: diff.changedValues,
        removedValues: diff.removedValues,
        errors: diff.errors,
        clearedErrors: diff.clearedErrors,
      });
    }
    return emit("CALCULATION_RESULT", requestId, {
      changedValues: diff.changedValues,
      removedValues: diff.removedValues,
      errors: diff.errors,
      clearedErrors: diff.clearedErrors,
    });
  }

  return {
    get workbookId() {
      return currentWorkbookId;
    },

    get isReady() {
      return ready && !destroyed;
    },

    async initialize(workbook, { workbookId } = {}) {
      if (destroyed) throw new Error("Calculation engine destroyed");
      currentWorkbookId = workbookId || createWorkbookId();
      latestAppliedRequestId = 0;
      ready = false;
      queuedValues = {};
      requestSeq += 1;
      const requestId = requestSeq;

      try {
        const loaded = await loadWorkbookIntoEngine({}, workbook);
        runtime = loaded;
        ready = true;
        const msg = emit("READY", requestId, {
          meta: {
            ...loaded.meta,
            workbookId: currentWorkbookId,
            formulaProfile: FORMULA_PROFILE,
          },
          warnings: loaded.state.initWarnings,
          changedValues: loaded.snapshotValues || {},
          removedValues: [],
          errors: loaded.snapshotErrors || {},
          clearedErrors: [],
        });

        if (Object.keys(queuedValues).length) {
          requestSeq += 1;
          await flushQueue(requestSeq);
        }
        return msg;
      } catch (e) {
        ready = false;
        runtime = null;
        console.error("[calculationEngine] init failed", e);
        return emit("ENGINE_ERROR", requestId, {
          error: makeError(ERROR_CODES.CALCULATION_ERROR, {
            detail: String(e?.message || e),
          }),
        });
      }
    },

    async setValue(cellRef, value) {
      return this.setValues({ [cellRef]: value });
    },

    async setValues(values) {
      if (destroyed) throw new Error("Calculation engine destroyed");
      requestSeq += 1;
      const requestId = requestSeq;

      if (!ready || !runtime?.wb) {
        queuedValues = { ...queuedValues, ...(values || {}) };
        return {
          type: "CALCULATION_RESULT",
          requestId,
          workbookId: currentWorkbookId,
          payload: {
            changedValues: {},
            removedValues: [],
            errors: {},
            clearedErrors: [],
            queued: true,
          },
        };
      }

      applyValuesToEngine(runtime.wb, runtime.sheetId, values || {});
      return emitDiff(requestId);
    },

    async recalculate() {
      if (destroyed) throw new Error("Calculation engine destroyed");
      requestSeq += 1;
      const requestId = requestSeq;
      if (!ready || !runtime?.wb) {
        return emit("ENGINE_ERROR", requestId, {
          error: makeError(ERROR_CODES.CALCULATION_ERROR, {
            detail: "Engine not ready",
          }),
        });
      }
      return emitDiff(requestId);
    },

    async destroy() {
      if (destroyed) return null;
      requestSeq += 1;
      const requestId = requestSeq;
      const id = currentWorkbookId;
      if (runtime?.wb && typeof runtime.wb.destroy === "function") {
        try {
          runtime.wb.destroy();
        } catch {
          /* ignore */
        }
      }
      runtime = null;
      ready = false;
      queuedValues = {};
      destroyed = true;
      currentWorkbookId = null;
      return {
        type: "DESTROYED",
        requestId,
        workbookId: id,
        payload: {},
      };
    },
  };
}
