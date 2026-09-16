import { validateUploadFile } from "./workbookValidation.js";
import { runParsePipeline } from "./runParsePipeline.js";
import { MESSAGES } from "../model/workbookSchema.js";

let workerInstance = null;
let reqId = 0;

function getWorker() {
  if (typeof Worker === "undefined") return null;
  if (workerInstance) return workerInstance;
  try {
    workerInstance = new Worker(
      new URL("../worker/excelParser.worker.js", import.meta.url),
      { type: "module" },
    );
    workerInstance.addEventListener("error", () => {
      // Force fallback on next call
      try {
        workerInstance?.terminate();
      } catch {
        /* ignore */
      }
      workerInstance = null;
    });
    return workerInstance;
  } catch {
    return null;
  }
}

const WORKER_TIMEOUT_MS = 60_000;

function parseInWorker(buffer, fileName) {
  const worker = getWorker();
  if (!worker) return null;

  const id = ++reqId;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      worker.removeEventListener("message", onMessage);
      resolve(null);
    }, WORKER_TIMEOUT_MS);

    const onMessage = (event) => {
      if (event.data?.id !== id) return;
      clearTimeout(timer);
      worker.removeEventListener("message", onMessage);
      resolve(event.data);
    };
    worker.addEventListener("message", onMessage);
    try {
      worker.postMessage({ id, type: "parse", buffer, fileName }, [buffer]);
    } catch {
      clearTimeout(timer);
      worker.removeEventListener("message", onMessage);
      resolve(null);
    }
  });
}

/**
 * Public API — validate File then parse via Web Worker (fallback: main thread).
 *
 * @param {File} file
 * @returns {Promise<{ ok: true, workbook: object } | { ok: false, error: string }>}
 */
export async function parseWorkbook(file) {
  const pre = validateUploadFile(file);
  if (!pre.ok) return pre;

  let buffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    return { ok: false, error: MESSAGES.parseFailed };
  }

  // Worker transfers the buffer — keep a copy for fallback
  const copy = buffer.slice(0);

  try {
    const workerResult = await parseInWorker(buffer, file.name);
    if (workerResult) {
      if (workerResult.ok) return { ok: true, workbook: workerResult.workbook };
      // Worker returned a domain error (validation) — trust it
      if (workerResult.error) return { ok: false, error: workerResult.error };
    }
  } catch {
    /* fall through to main thread */
  }

  try {
    return await runParsePipeline(copy, { fileName: file.name });
  } catch {
    return { ok: false, error: MESSAGES.parseFailed };
  }
}

export { validateUploadFile };
