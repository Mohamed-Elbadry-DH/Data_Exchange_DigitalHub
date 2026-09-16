/* eslint-disable no-restricted-globals */
import init, { Workbook, parse } from "formualizer";
import {
  applyValuesToEngine,
  evaluateAndDiff,
  loadWorkbookIntoEngine,
} from "./formualizerAdapter.js";
import { FORMULA_PROFILE } from "./formulaRegistry.js";
import { makeError, ERROR_CODES } from "./calculationErrors.js";

/** @type {Awaited<ReturnType<typeof loadWorkbookIntoEngine>> | null} */
let runtime = null;
let activeWorkbookId = null;
let wasmReady = false;
let engineVersion = "unknown";

async function ensureWasm() {
  if (wasmReady) return;
  await init();
  engineVersion = "0.9.3";
  wasmReady = true;
}

function reply(type, requestId, workbookId, payload) {
  self.postMessage({ type, requestId, workbookId, payload });
}

self.onmessage = async (event) => {
  const msg = event.data || {};
  const { type, requestId, workbookId, payload } = msg;

  try {
    switch (type) {
      case "INIT_WORKBOOK": {
        await ensureWasm();
        if (runtime?.wb) {
          runtime = null;
        }
        activeWorkbookId = workbookId;
        const loaded = await loadWorkbookIntoEngine(
          { Workbook, parse, engineVersion },
          payload.workbook,
        );
        runtime = loaded;
        reply("READY", requestId, workbookId, {
          meta: {
            ...loaded.meta,
            workbookId,
            formulaProfile: FORMULA_PROFILE,
          },
          warnings: loaded.state.initWarnings,
          changedValues: loaded.snapshotValues || loaded.changedValues || {},
          removedValues: [],
          errors: loaded.snapshotErrors || loaded.errors || {},
          clearedErrors: [],
        });
        break;
      }

      case "SET_CELL": {
        if (!guardSession(requestId, workbookId)) return;
        applyValuesToEngine(runtime.wb, runtime.sheetName, {
          [payload.cellRef]: payload.value,
        });
        postCalcResult(requestId, workbookId);
        break;
      }

      case "SET_CELLS": {
        if (!guardSession(requestId, workbookId)) return;
        applyValuesToEngine(runtime.wb, runtime.sheetName, payload.values || {});
        postCalcResult(requestId, workbookId);
        break;
      }

      case "RECALCULATE": {
        if (!guardSession(requestId, workbookId)) return;
        postCalcResult(requestId, workbookId);
        break;
      }

      case "DESTROY": {
        runtime = null;
        const id = workbookId || activeWorkbookId;
        activeWorkbookId = null;
        reply("DESTROYED", requestId, id, {});
        break;
      }

      default:
        reply("ENGINE_ERROR", requestId, workbookId, {
          error: makeError(ERROR_CODES.CALCULATION_ERROR, {
            detail: `Unknown message type: ${type}`,
          }),
        });
    }
  } catch (e) {
    reply("ENGINE_ERROR", requestId, workbookId, {
      error: makeError(ERROR_CODES.CALCULATION_ERROR, {
        detail: String(e?.message || e),
      }),
    });
  }
};

function guardSession(requestId, workbookId) {
  if (!runtime?.wb || workbookId !== activeWorkbookId) {
    reply("ENGINE_ERROR", requestId, workbookId, {
      error: makeError(ERROR_CODES.CALCULATION_ERROR, {
        detail: "Stale or missing workbook session",
      }),
    });
    return false;
  }
  return true;
}

function postCalcResult(requestId, workbookId) {
  const diff = evaluateAndDiff(runtime.wb, runtime.sheetName, runtime.state);
  if (diff.engineError) {
    reply("CALCULATION_ERROR", requestId, workbookId, {
      error: makeError(ERROR_CODES.CALCULATION_ERROR, {
        detail: diff.engineError,
      }),
      ...diff,
    });
    return;
  }
  reply("CALCULATION_RESULT", requestId, workbookId, {
    changedValues: diff.changedValues,
    removedValues: diff.removedValues,
    errors: diff.errors,
    clearedErrors: diff.clearedErrors,
  });
}
