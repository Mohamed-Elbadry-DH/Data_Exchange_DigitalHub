/* eslint-disable no-restricted-globals */
import { runParsePipeline } from "../ingestion/runParsePipeline.js";

/**
 * Excel parse worker — receives ArrayBuffer, returns WorkbookJSON or error.
 * Message in:  { id, type: 'parse', buffer, fileName }
 * Message out: { id, ok: true, workbook } | { id, ok: false, error }
 */
self.onmessage = async (event) => {
  const data = event.data || {};
  const { id, type, buffer, fileName } = data;

  if (type !== "parse") {
    self.postMessage({ id, ok: false, error: "طلب غير معروف." });
    return;
  }

  try {
    const result = await runParsePipeline(buffer, { fileName });
    if (result.ok) {
      self.postMessage({ id, ok: true, workbook: result.workbook });
    } else {
      self.postMessage({ id, ok: false, error: result.error });
    }
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: err?.message || "تعذّر تحليل ملف Excel.",
    });
  }
};
