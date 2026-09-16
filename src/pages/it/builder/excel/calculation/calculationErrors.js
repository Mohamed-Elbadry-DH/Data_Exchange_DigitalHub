export const ERROR_CODES = {
  CIRCULAR_REFERENCE: "CIRCULAR_REFERENCE",
  INVALID_FORMULA: "INVALID_FORMULA",
  DIVIDE_BY_ZERO: "DIVIDE_BY_ZERO",
  INVALID_REFERENCE: "INVALID_REFERENCE",
  VALUE_ERROR: "VALUE_ERROR",
  NAME_ERROR: "NAME_ERROR",
  UNSUPPORTED_FUNCTION: "UNSUPPORTED_FUNCTION",
  CALCULATION_ERROR: "CALCULATION_ERROR",
  CROSS_SHEET_REFERENCE_NOT_SUPPORTED: "CROSS_SHEET_REFERENCE_NOT_SUPPORTED",
  EXTERNAL_REFERENCE_NOT_SUPPORTED: "EXTERNAL_REFERENCE_NOT_SUPPORTED",
};

const EXCEL_DISPLAY = {
  CIRCULAR_REFERENCE: "#CIRC!",
  DIVIDE_BY_ZERO: "#DIV/0!",
  INVALID_REFERENCE: "#REF!",
  VALUE_ERROR: "#VALUE!",
  NAME_ERROR: "#NAME?",
  INVALID_FORMULA: "#ERROR!",
  UNSUPPORTED_FUNCTION: "#NAME?",
  CALCULATION_ERROR: "#ERROR!",
  CROSS_SHEET_REFERENCE_NOT_SUPPORTED: "#REF!",
  EXTERNAL_REFERENCE_NOT_SUPPORTED: "#REF!",
};

const ARABIC_MESSAGES = {
  CIRCULAR_REFERENCE: "مرجع دائري في المعادلة",
  DIVIDE_BY_ZERO: "قسمة على صفر",
  INVALID_REFERENCE: "مرجع خلية غير صالح",
  VALUE_ERROR: "قيمة غير صالحة",
  NAME_ERROR: "اسم دالة غير معروف",
  INVALID_FORMULA: "معادلة غير صالحة",
  UNSUPPORTED_FUNCTION: "دالة غير مدعومة في هذا الإصدار",
  CALCULATION_ERROR: "خطأ في الحساب",
  CROSS_SHEET_REFERENCE_NOT_SUPPORTED: "مراجع الشيتات الأخرى غير مدعومة حاليًا",
  EXTERNAL_REFERENCE_NOT_SUPPORTED: "المراجع الخارجية غير مدعومة حاليًا",
};

export function displayValueForCode(code) {
  return EXCEL_DISPLAY[code] || "#ERROR!";
}

export function arabicMessageForCode(code) {
  return ARABIC_MESSAGES[code] || ARABIC_MESSAGES.CALCULATION_ERROR;
}

export function makeError(code, extras = {}) {
  return {
    code,
    displayValue: displayValueForCode(code),
    message: arabicMessageForCode(code),
    ...extras,
  };
}

/** Map Formualizer / Excel error tokens to platform codes. */
export function mapEngineErrorToken(token) {
  const t = String(token || "").toUpperCase();
  if (t.includes("CIRC") || t.includes("CYCLE") || t === "#CIRC!" || t === "#CYCLE!") {
    return ERROR_CODES.CIRCULAR_REFERENCE;
  }
  if (t.includes("DIV/0") || t === "#DIV/0!") return ERROR_CODES.DIVIDE_BY_ZERO;
  if (t.includes("#REF")) return ERROR_CODES.INVALID_REFERENCE;
  if (t.includes("#VALUE")) return ERROR_CODES.VALUE_ERROR;
  if (t.includes("#NAME")) return ERROR_CODES.NAME_ERROR;
  if (t.includes("#N/A") || t.includes("#NUM") || t.includes("#NULL") || t.includes("#ERROR")) {
    return ERROR_CODES.CALCULATION_ERROR;
  }
  if (t.startsWith("#")) return ERROR_CODES.CALCULATION_ERROR;
  return null;
}

export function isExcelErrorToken(value) {
  return typeof value === "string" && value.trim().startsWith("#");
}
