import JSZip from "jszip";
import { MESSAGES } from "../model/workbookSchema.js";
import {
  validateZipStructure,
  validateSheetCount,
} from "./workbookValidation.js";
import { parseWithExcelJs, extractExcelJsSnapshot } from "./excelJsParser.js";
import { readOoxmlEnrichment, countSheetsInWorkbookXml } from "./ooxmlReader.js";
import { normalizeWorkbook } from "../normalization/normalizeWorkbook.js";

/**
 * Full ingestion pipeline (runs on main thread or inside worker).
 * @param {ArrayBuffer} buffer
 * @param {{ fileName?: string }} [opts]
 */
export async function runParsePipeline(buffer, opts = {}) {
  const fileName = opts.fileName || "workbook.xlsx";

  const zipCheck = await validateZipStructure(buffer, JSZip);
  if (!zipCheck.ok) return zipCheck;

  const { zip } = zipCheck;

  // Sheet count from OOXML before heavy ExcelJS work
  try {
    const wbFile = zip.file(/xl\/workbook\.xml$/i)[0];
    if (wbFile) {
      const xml = await wbFile.async("string");
      const count = countSheetsInWorkbookXml(xml);
      if (count > 0) {
        const sc = validateSheetCount(count);
        if (!sc.ok) return sc;
      }
      // count === 0: XML quirks — defer to ExcelJS sheet list
    }
  } catch {
    return { ok: false, error: MESSAGES.invalidZip };
  }

  // Parallel: ExcelJS + OOXML enrichment
  const [excelResult, enrichment] = await Promise.all([
    parseWithExcelJs(buffer.slice(0)),
    readOoxmlEnrichment(zip),
  ]);

  if (!excelResult.ok) return excelResult;

  const snapshot = extractExcelJsSnapshot(excelResult.sheet);
  return normalizeWorkbook({ snapshot, enrichment, fileName });
}
