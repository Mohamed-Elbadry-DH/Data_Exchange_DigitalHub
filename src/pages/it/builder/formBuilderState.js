/** Shared shape + derived counts for the نموذج البيان builder wizard. */

export const emptyMeta = {
  title: "", admin: "", bulletin: "", entity: "", scope: "",
  methodology: "", description: "",
  groupsRequired: "", subsectionsRequired: "", columnsRequired: "", rowsRequired: "",
  yearType: "", year: "", periodicity: "", periodicityDetail: "",
  collectFrom: "", collectTo: "", dueDate: "", graceDays: "",
};

export const emptyStructure = { groups: [], columns: [], rows: [] };

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Counts actually built so far. Sub-sections are nested inside groups. */
export function structureCounts(structure) {
  return {
    groups: structure.groups.length,
    subsections: structure.groups.reduce((s, g) => s + g.subsections.length, 0),
    columns: structure.columns.length,
    rows: structure.rows.length,
  };
}

/** Rows for the validation modal, pairing each requirement with what exists. */
export function validationRows(meta, structure) {
  const c = structureCounts(structure);
  return [
    { label: "عدد المجموعات الرئيسية المطلوبة", required: num(meta.groupsRequired), current: c.groups },
    { label: "عدد الأقسام الفرعية المطلوبة", required: num(meta.subsectionsRequired), current: c.subsections },
    { label: "عدد الأعمدة المطلوبة", required: num(meta.columnsRequired), current: c.columns },
    { label: "عدد الصفوف المطلوبة", required: num(meta.rowsRequired), current: c.rows },
  ];
}

/** Percentage of the required structure that exists, capped per requirement. */
export function completionPercent(rows) {
  const active = rows.filter((r) => r.required > 0);
  if (active.length === 0) return 0;
  const total = active.reduce((s, r) => s + Math.min(1, r.current / r.required), 0);
  return Math.round((total / active.length) * 100);
}

export const isStructureComplete = (rows) => rows.every((r) => r.current >= r.required);
