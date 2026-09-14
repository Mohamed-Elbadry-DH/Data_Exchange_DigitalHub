import { DEFAULT_THEME_COLORS } from "../normalization/colorResolver.js";

/**
 * OOXML enrichment layer — always runs alongside ExcelJS.
 * Extracts theme colors, sheet defaults, merges, column/row dims from XML.
 */

function textContent(el) {
  return el?.textContent?.trim() || "";
}

function parseXml(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("malformed XML");
  }
  return doc;
}

function localName(el) {
  return el.localName || el.nodeName?.replace(/^.*:/, "") || "";
}

function childrenByLocal(parent, name) {
  if (!parent) return [];
  const kids = parent.children ? [...parent.children] : [...(parent.childNodes || [])].filter((n) => n.nodeType === 1);
  return kids.filter((c) => localName(c) === name);
}

function firstByLocal(parent, name) {
  return childrenByLocal(parent, name)[0] || null;
}

function deepByLocal(root, name) {
  // Prefer getElementsByTagName (works in browser + xmldom); NS wildcard is flaky.
  const tagged = root.getElementsByTagName?.(name);
  if (tagged?.length) return [...tagged];
  try {
    const ns = root.getElementsByTagNameNS?.("*", name);
    if (ns?.length) return [...ns];
  } catch {
    /* ignore */
  }
  // Manual walk fallback
  const out = [];
  const walk = (node) => {
    if (!node) return;
    if (localName(node) === name) out.push(node);
    const kids = node.childNodes || [];
    for (let i = 0; i < kids.length; i += 1) walk(kids[i]);
  };
  walk(root.documentElement || root);
  return out;
}

/**
 * @param {import('jszip')} zip
 * @returns {Promise<object>}
 */
export async function readOoxmlEnrichment(zip) {
  const enrichment = {
    themeColors: [...DEFAULT_THEME_COLORS],
    sheetName: null,
    direction: "ltr",
    defaultRowHeight: 15,
    defaultColumnWidth: 8.43,
    merges: [],
    colWidths: /** @type {Map<number, number>} */ (new Map()),
    rowHeights: /** @type {Map<number, number>} */ (new Map()),
    sheetPath: null,
    workbookViewsRtl: false,
  };

  try {
    const themeFile = zip.file(/xl\/theme\/theme1\.xml$/i)[0];
    if (themeFile) {
      const xml = await themeFile.async("string");
      enrichment.themeColors = parseThemeColors(xml) || enrichment.themeColors;
    }
  } catch {
    /* keep defaults */
  }

  try {
    const wbFile = zip.file(/xl\/workbook\.xml$/i)[0];
    if (wbFile) {
      const xml = await wbFile.async("string");
      const meta = parseWorkbookXml(xml);
      enrichment.sheetName = meta.sheetName;
      enrichment.sheetPath = meta.sheetPath;
      enrichment.workbookViewsRtl = meta.rtl;
      if (meta.rtl) enrichment.direction = "rtl";
    }
  } catch {
    /* ignore */
  }

  // Resolve worksheet path via workbook relationships if needed
  let sheetEntry =
    enrichment.sheetPath &&
    zip.file(new RegExp(`${escapeRe(enrichment.sheetPath.replace(/^\//, ""))}$`, "i"))[0];

  if (!sheetEntry) {
    sheetEntry = zip.file(/xl\/worksheets\/sheet1\.xml$/i)[0];
  }

  if (sheetEntry) {
    try {
      const xml = await sheetEntry.async("string");
      const sheetMeta = parseWorksheetXml(xml);
      Object.assign(enrichment, {
        defaultRowHeight: sheetMeta.defaultRowHeight ?? enrichment.defaultRowHeight,
        defaultColumnWidth: sheetMeta.defaultColumnWidth ?? enrichment.defaultColumnWidth,
        merges: sheetMeta.merges,
        colWidths: sheetMeta.colWidths,
        rowHeights: sheetMeta.rowHeights,
        direction: sheetMeta.rightToLeft ? "rtl" : enrichment.direction,
      });
    } catch {
      /* ignore malformed sheet */
    }
  }

  return enrichment;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseThemeColors(xml) {
  try {
    const doc = parseXml(xml);
    const scheme = deepByLocal(doc, "clrScheme")[0];
    if (!scheme) return null;

    // Order in OOXML clrScheme: dk1, lt1, dk2, lt2, accent1..6, hlink, folHlink
    // Excel theme index mapping: 0=lt1, 1=dk1, 2=lt2, 3=dk2, 4=accent1…
    const byName = {};
    for (const child of scheme.children ? [...scheme.children] : [...(scheme.childNodes || [])].filter((n) => n.nodeType === 1)) {
      const name = localName(child);
      const srgb = deepByLocal(child, "srgbClr")[0];
      const sys = deepByLocal(child, "sysClr")[0];
      let hex = null;
      if (srgb) hex = srgb.getAttribute("val");
      else if (sys) hex = sys.getAttribute("lastClr") || sys.getAttribute("val");
      if (hex) byName[name] = hex.toUpperCase();
    }

    const excelOrder = ["lt1", "dk1", "lt2", "dk2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
    return excelOrder.map((n, i) => byName[n] || DEFAULT_THEME_COLORS[i]);
  } catch {
    return null;
  }
}

function parseWorkbookXml(xml) {
  const doc = parseXml(xml);
  const sheets = deepByLocal(doc, "sheet");
  const first = sheets[0];
  const sheetName = first?.getAttribute("name") || "Sheet1";
  const rId = first?.getAttribute("r:id") || first?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");

  let rtl = false;
  const views = deepByLocal(doc, "workbookView");
  if (views[0]?.getAttribute("rightToLeft") === "1") rtl = true;

  return { sheetName, sheetPath: null, sheetCount: sheets.length, rId, rtl };
}

/**
 * Count sheets quickly from workbook.xml string.
 */
export function countSheetsInWorkbookXml(xml) {
  try {
    const doc = parseXml(xml);
    const n = deepByLocal(doc, "sheet").length;
    if (n > 0) return n;
  } catch {
    /* fall through */
  }
  // Regex fallback (namespaced or plain)
  const matches = String(xml).match(/<[^>]*:?sheet\s[^>]*name=/gi);
  return matches ? matches.length : 0;
}

function parseWorksheetXml(xml) {
  const doc = parseXml(xml);
  const sheetFormat = deepByLocal(doc, "sheetFormatPr")[0];
  const defaultRowHeight = sheetFormat
    ? Number(sheetFormat.getAttribute("defaultRowHeight")) || 15
    : 15;
  const defaultColumnWidth = sheetFormat
    ? Number(sheetFormat.getAttribute("defaultColWidth")) ||
      Number(sheetFormat.getAttribute("baseColWidth")) ||
      8.43
    : 8.43;

  const sheetView = deepByLocal(doc, "sheetView")[0];
  const rightToLeft = sheetView?.getAttribute("rightToLeft") === "1";

  const merges = [];
  for (const mr of deepByLocal(doc, "mergeCell")) {
    const ref = mr.getAttribute("ref");
    if (!ref) continue;
    const parsed = parseA1Range(ref);
    if (parsed) merges.push(parsed);
  }

  const colWidths = new Map();
  for (const col of deepByLocal(doc, "col")) {
    const min = Number(col.getAttribute("min"));
    const max = Number(col.getAttribute("max"));
    const width = Number(col.getAttribute("width"));
    if (!min || !max || !Number.isFinite(width)) continue;
    for (let c = min; c <= max; c += 1) colWidths.set(c, width);
  }

  const rowHeights = new Map();
  for (const row of deepByLocal(doc, "row")) {
    const r = Number(row.getAttribute("r"));
    const ht = row.getAttribute("ht");
    const custom = row.getAttribute("customHeight");
    if (r && ht && (custom === "1" || custom == null)) {
      rowHeights.set(r, Number(ht));
    }
  }

  return {
    defaultRowHeight,
    defaultColumnWidth,
    merges,
    colWidths,
    rowHeights,
    rightToLeft,
  };
}

/** Parse A1:B2 → { startRow, startColumn, endRow, endColumn } (1-based). */
export function parseA1Range(ref) {
  const parts = String(ref).split(":");
  const a = parseA1Cell(parts[0]);
  const b = parseA1Cell(parts[1] || parts[0]);
  if (!a || !b) return null;
  return {
    startRow: Math.min(a.row, b.row),
    startColumn: Math.min(a.column, b.column),
    endRow: Math.max(a.row, b.row),
    endColumn: Math.max(a.column, b.column),
  };
}

export function parseA1Cell(a1) {
  const m = String(a1)
    .trim()
    .match(/^([A-Za-z]+)(\d+)$/);
  if (!m) return null;
  return { column: colLettersToIndex(m[1]), row: Number(m[2]) };
}

export function colLettersToIndex(letters) {
  let n = 0;
  const s = letters.toUpperCase();
  for (let i = 0; i < s.length; i += 1) {
    n = n * 26 + (s.charCodeAt(i) - 64);
  }
  return n;
}

export function colIndexToLetters(index) {
  let n = index;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// silence unused helpers in tree-shaking edge cases
void textContent;
void firstByLocal;
void parseWorkbookXml;
