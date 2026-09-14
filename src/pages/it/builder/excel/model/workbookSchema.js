/** WorkbookJSON schema version — bump when shape changes; migrate via workbookMigrations. */
export const SCHEMA_VERSION = "1.0";
export const PARSER_VERSION = "1.0";

/** MVP hard limits for form-builder Excel import. */
export const WORKBOOK_LIMITS = Object.freeze({
  maxFileBytes: 10 * 1024 * 1024,
  maxSheets: 1,
  maxRows: 1000,
  maxColumns: 100,
  maxUsedCells: 25_000,
  maxMerges: 2_000,
  maxMergeSpanRows: 200,
  maxMergeSpanCols: 50,
  maxSharedStrings: 50_000,
  maxUncompressedZipBytes: 80 * 1024 * 1024,
});

export const MULTI_SHEET_ERROR =
  "ملف Excel يحتوي على أكثر من ورقة عمل. يدعم منشئ النماذج حاليًا ورقة عمل واحدة فقط. يرجى الاحتفاظ بالورقة المطلوبة فقط ثم إعادة رفع الملف.";

export const MESSAGES = Object.freeze({
  multiSheet: MULTI_SHEET_ERROR,
  notXlsx: "يُقبل ملف .xlsx فقط. يرجى تحويل الملف إلى صيغة Excel الحديثة ثم إعادة الرفع.",
  tooLarge: "حجم الملف يتجاوز الحد المسموح (10 ميجابايت).",
  invalidZip: "الملف تالف أو ليس مصنف Excel صالحًا.",
  zipBomb: "الملف غير آمن للتحليل (حجم غير طبيعي داخل الأرشيف).",
  tooManyRows: "عدد الصفوف يتجاوز الحد المسموح (1000 صف).",
  tooManyColumns: "عدد الأعمدة يتجاوز الحد المسموح (100 عمود).",
  tooManyCells: "عدد الخلايا يتجاوز الحد المسموح (25000 خلية).",
  tooManyMerges: "عدد الخلايا المدمجة يتجاوز الحد المسموح.",
  mergeTooLarge: "نطاق دمج الخلايا أكبر من المسموح.",
  emptySheet: "ورقة العمل فارغة. يرجى رفع ملف يحتوي على بيانات.",
  parseFailed: "تعذّر تحليل ملف Excel. تأكد من سلامة الملف ثم أعد المحاولة.",
  noSheet: "لم يتم العثور على ورقة عمل في الملف.",
});

/**
 * @returns {import('./types').WorkbookJSON}
 */
export function createEmptyWorkbook({ sheetName = "Sheet1", fileName = "" } = {}) {
  return {
    schemaVersion: SCHEMA_VERSION,
    sheet: {
      name: sheetName,
      direction: "ltr",
      defaultRowHeight: 15,
      defaultColumnWidth: 8.43,
      usedRange: {
        startRow: 1,
        startColumn: 1,
        endRow: 1,
        endColumn: 1,
      },
    },
    rows: [],
    columns: [],
    cells: [],
    merges: [],
    fields: [],
    metadata: {
      source: "xlsx",
      originalFileName: fileName,
      parserVersion: PARSER_VERSION,
    },
  };
}

/**
 * Canonical empty cell style.
 * @returns {import('./types').CellStyle}
 */
export function defaultCellStyle() {
  return {
    font: {
      family: "Calibri",
      size: 11,
      bold: false,
      italic: false,
      underline: false,
      color: "#000000",
    },
    fill: { type: "none", color: null },
    alignment: {
      horizontal: "general",
      vertical: "bottom",
      wrapText: false,
      textRotation: 0,
      indent: 0,
    },
    borders: {
      top: null,
      right: null,
      bottom: null,
      left: null,
    },
  };
}
