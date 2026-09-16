/**
 * Data source for the general admin module (`/ga`).
 *
 * Starts as a mirror of the supervisor mock. To diverge, declare the export
 * locally in this file — an explicit export takes precedence over `export *`,
 * so only the general admin pages see the new value.
 *
 * Only override presentation data here (KPI labels, chart series, column sets).
 * Business data both modules act on — requests, notes, users, workflow stages —
 * stays single-sourced (`./mock` and `src/domain/*`), otherwise the two modules
 * end up disagreeing about the same request.
 */
import { loadCreatedRequests } from "../domain/requestState";
import { requestDetailById as sharedRequestDetailById } from "./mock";

export * from "./mock";

/** مؤشرات عامة — Figma 649:10179: نماذج / إدارات / جهات / مستخدمين */
export const kpis = [
  { label: "نماذج البيان", value: 316, delta: "+3%", up: true, icon: "FileText", color: "#0986ED" },
  { label: "الإدارات العامة", value: 30, delta: "+3%", up: true, icon: "Landmark", color: "#34609A" },
  { label: "الجهات الخارجية", value: 40, delta: "-3%", up: false, icon: "Building2", color: "#C89637" },
  { label: "المستخدمين", value: 60, delta: "+3%", up: true, icon: "Users", color: "#1B75FF" },
];

/** Palette shared by the general admin indicator cards and charts */
export const gaStatusColors = {
  "لم تبدأ بعد": "#1B75FF",
  "قيد التنفيذ": "#FFC107",
  تعديل: "#FF8C08",
  "قيد المراجعة": "#9747FF",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
};

/** مؤشرات تبادل نماذج البيان / استيفاء البيانات — shared with the decision maker module */
export { exchangeStatusCards, fulfillmentStatusCards } from "./indicators";

/** توزيع نماذج البيان حسب الحالة — نسب مئوية */
export const gaStatusPie = [
  { name: "لم تبدأ بعد", value: 30, color: gaStatusColors["لم تبدأ بعد"] },
  { name: "قيد التنفيذ", value: 15, color: gaStatusColors["قيد التنفيذ"] },
  { name: "تعديل", value: 10, color: gaStatusColors["تعديل"] },
  { name: "قيد المراجعة", value: 30, color: gaStatusColors["قيد المراجعة"] },
  { name: "المتأخرة", value: 5, color: gaStatusColors["المتأخرة"] },
  { name: "معتمدة", value: 10, color: gaStatusColors["معتمدة"] },
];

/** توزيع البيانات حسب الحالة — أعداد مجموعها 251 */
export const gaStatusDonut = [
  { name: "لم تبدأ بعد", value: 95, color: gaStatusColors["لم تبدأ بعد"] },
  { name: "قيد التنفيذ", value: 76, color: gaStatusColors["قيد التنفيذ"] },
  { name: "تعديل", value: 27, color: gaStatusColors["تعديل"] },
  { name: "قيد المراجعة", value: 4, color: gaStatusColors["قيد المراجعة"] },
  { name: "المتأخرة", value: 28, color: gaStatusColors["المتأخرة"] },
  { name: "معتمدة", value: 21, color: gaStatusColors["معتمدة"] },
];
export const gaStatusDonutTotal = 251;

/** الطلبات المكتملة شهرياً */
export const gaMonthlyCompleted = [
  { month: "يناير", value: 28 },
  { month: "فبراير", value: 58 },
  { month: "مارس", value: 52 },
  { month: "أبريل", value: 39 },
  { month: "مايو", value: 83 },
  { month: "يونيو", value: 120 },
  { month: "يوليو", value: 86 },
  { month: "أغسطس", value: 108 },
  { month: "سبتمبر", value: 52 },
  { month: "أكتوبر", value: 36 },
  { month: "نوفمبر", value: 102 },
  { month: "ديسمبر", value: 66 },
];

/** توزيع الحالات شهرياً — يغذي العرض الخطي لكروت الحالة */
export const gaStatusMonthly = [
  { month: "يناير", "لم تبدأ بعد": 26, "قيد التنفيذ": 34, تعديل: 9, "قيد المراجعة": 4, المتأخرة: 5, معتمدة: 8 },
  { month: "فبراير", "لم تبدأ بعد": 29, "قيد التنفيذ": 37, تعديل: 11, "قيد المراجعة": 5, المتأخرة: 4, معتمدة: 10 },
  { month: "مارس", "لم تبدأ بعد": 31, "قيد التنفيذ": 39, تعديل: 12, "قيد المراجعة": 6, المتأخرة: 6, معتمدة: 12 },
  { month: "أبريل", "لم تبدأ بعد": 27, "قيد التنفيذ": 42, تعديل: 10, "قيد المراجعة": 5, المتأخرة: 7, معتمدة: 11 },
  { month: "مايو", "لم تبدأ بعد": 33, "قيد التنفيذ": 45, تعديل: 13, "قيد المراجعة": 7, المتأخرة: 5, معتمدة: 14 },
  { month: "يونيو", "لم تبدأ بعد": 36, "قيد التنفيذ": 48, تعديل: 12, "قيد المراجعة": 6, المتأخرة: 4, معتمدة: 17 },
  { month: "يوليو", "لم تبدأ بعد": 32, "قيد التنفيذ": 44, تعديل: 11, "قيد المراجعة": 5, المتأخرة: 6, معتمدة: 15 },
  { month: "أغسطس", "لم تبدأ بعد": 30, "قيد التنفيذ": 46, تعديل: 12, "قيد المراجعة": 7, المتأخرة: 5, معتمدة: 16 },
  { month: "سبتمبر", "لم تبدأ بعد": 28, "قيد التنفيذ": 41, تعديل: 10, "قيد المراجعة": 4, المتأخرة: 6, معتمدة: 12 },
  { month: "أكتوبر", "لم تبدأ بعد": 29, "قيد التنفيذ": 43, تعديل: 11, "قيد المراجعة": 5, المتأخرة: 7, معتمدة: 13 },
  { month: "نوفمبر", "لم تبدأ بعد": 34, "قيد التنفيذ": 47, تعديل: 13, "قيد المراجعة": 6, المتأخرة: 5, معتمدة: 16 },
  { month: "ديسمبر", "لم تبدأ بعد": 31, "قيد التنفيذ": 44, تعديل: 12, "قيد المراجعة": 5, المتأخرة: 4, معتمدة: 15 },
];

/** قائمة نماذج البيان — البيانات كما في التصميم حرفياً */
export const formsRows = [
  {
    id: 1,
    title: "بيانات السكان",
    org: "تقنية النظم والمعلومات",
    officer: "أحمد محمد",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "قيد التنفيذ",
    stageId: "create",
    currentEntity: "تقنية النظم والمعلومات",
    officerRole: "أخصائي تقنية النظم والمعلومات",
  },
  {
    id: 2,
    title: "بيانات الصناعة",
    org: "الإدارة العامة",
    officer: "محمد علي",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "بانتظار المراجعة",
    stageId: "review-form",
    currentEntity: "الإدارة العامة",
    officerRole: "الإدارة العامة",
  },
  {
    id: 3,
    title: "بيانات الصناعة",
    org: "الإدارة العامة",
    officer: "محمد علي",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "مطلوب تعديل",
    stageId: "review-form",
    currentEntity: "الإدارة العامة",
    officerRole: "الإدارة العامة",
  },
  {
    id: 4,
    title: "بيانات النقل",
    org: "مشرف الإدارة",
    officer: "سارة حسن",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "قيد المراجعة",
    stageId: "approve-form",
    currentEntity: "مشرف الإدارة",
    officerRole: "مشرف الإدارة",
  },
  {
    id: 5,
    title: "بيانات النقل",
    org: "مشرف الإدارة",
    officer: "سارة حسن",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "مطلوب تعديل",
    stageId: "approve-form",
    currentEntity: "مشرف الإدارة",
    officerRole: "مشرف الإدارة",
  },
  {
    id: 6,
    title: "بيانات الإسكان",
    org: "الإدارة العامة",
    officer: "محمد علي",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "معتمد",
    stageId: "approve-form",
    currentEntity: "الإدارة العامة",
    officerRole: "الإدارة العامة",
  },
];

/** قائمة البيانات المطلوبة — دورة الاستيفاء حتى الإغلاق */
export const requiredRows = [
  {
    id: 101,
    title: "بيانات السكان",
    org: "وزارة الصحة والسكان",
    officer: "وزارة الصحة والسكان",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "قيد التنفيذ",
    stageId: "fulfill",
    currentEntity: "الجهة الخارجية",
    officerRole: "الجهة الخارجية",
  },
  {
    id: 102,
    title: "بيانات الصناعة",
    org: "وزارة الصناعة",
    officer: "وزارة الصناعة",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "مطلوب تعديل",
    stageId: "fulfill",
    currentEntity: "الجهة الخارجية",
    officerRole: "الجهة الخارجية",
  },
  {
    id: 103,
    title: "بيانات الاستثمار",
    org: "الإدارة العامة",
    officer: "محمد علي",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "قيد المراجعة",
    stageId: "review-data",
    currentEntity: "الإدارة العامة",
    officerRole: "الإدارة العامة",
  },
  {
    id: 104,
    title: "بيانات السياحة",
    org: "مشرف الإدارة",
    officer: "سارة حسن",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "بانتظار الاعتماد",
    stageId: "final-approval",
    currentEntity: "مشرف الإدارة",
    officerRole: "مشرف الإدارة",
  },
  {
    id: 105,
    title: "بيانات النقل",
    org: "مشرف الإدارة",
    officer: "سارة حسن",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "مطلوب تعديل",
    stageId: "final-approval",
    currentEntity: "مشرف الإدارة",
    officerRole: "مشرف الإدارة",
  },
  {
    id: 106,
    title: "بيانات الإسكان",
    org: "الإدارة العامة",
    officer: "محمد علي",
    created: "01/06/2026",
    due: "15/06/2026",
    status: "معتمد",
    stageId: "close",
    currentEntity: "الإدارة العامة",
    officerRole: "الإدارة العامة",
  },
];

/** Badge palette — مطابقة تصميم القائمة */
export const statusBadge = {
  "قيد التنفيذ": { bg: "#E3EEFF", fg: "#1B75FF" },
  "مطلوب تعديل": { bg: "#FCE4E4", fg: "#DC2626" },
  "بانتظار المراجعة": { bg: "#FFF4E0", fg: "#FF8C08" },
  "قيد المراجعة": { bg: "#FFF8E1", fg: "#C49200" },
  "بانتظار الاعتماد": { bg: "#FFE8D9", fg: "#E8590C" },
  معتمد: { bg: "#DDF2E5", fg: "#16A34A" },
  معتمدة: { bg: "#DDF2E5", fg: "#16A34A" },
  "قيد الاعتماد": { bg: "#FFE8D9", fg: "#E8590C" },
};

const detailListSeed = [...formsRows, ...requiredRows];

/** Enrich shared request details with GA workflow presentation fields */
export const requestDetailById = Object.fromEntries(
  Object.entries(sharedRequestDetailById).map(([id, detail]) => {
    const listRow = detailListSeed.find((r) => String(r.id) === String(id))
      || formsRows.find((r) => String(r.id) === String(id));
    return [
      id,
      {
        ...detail,
        status: listRow?.status ?? detail.status,
        stageId: listRow?.stageId ?? detail.stageId ?? "create",
        currentEntity: listRow?.currentEntity ?? detail.currentEntity ?? "تقنية النظم والمعلومات",
        officer: listRow?.officer ?? detail.officer,
        officerRole: listRow?.officerRole ?? detail.officerRole ?? "أخصائي تقنية النظم والمعلومات",
      },
    ];
  }),
);

/**
 * Seed used by GA detail pages: merges list-row presentation (stage/status/…)
 * with shared detail content (tables/attachments). Works for ids that exist
 * only in forms/required lists (e.g. 101+) and locally created requests.
 *
 * Matrix for الدرجات العلمية (Figma 1179:812) lives on shared detail id 6
 * (`graduatesTable`: مصري/وافد × دبلوم/ماجستير/دكتوراه). New creates and
 * education-titled rows prefer that template.
 */
export function getGaRequestSeed(id) {
  const key = String(id);
  const created = loadCreatedRequests().find((r) => String(r.id) === key);
  const listRow = detailListSeed.find((r) => String(r.id) === key) || created;
  const enriched = requestDetailById[key] || requestDetailById[id];
  const title = listRow?.title || enriched?.title || "";
  const preferGraduates =
    Boolean(created) ||
    title.includes("تعليم") ||
    title.includes("درجات") ||
    title.includes("خريج");
  const graduates = requestDetailById["6"] || requestDetailById[6];
  const template =
    enriched ||
    (preferGraduates ? graduates : null) ||
    requestDetailById["1"] ||
    requestDetailById[1];

  const attachments =
    (template?.attachments && template.attachments.length > 0)
      ? template.attachments
      : [
          {
            name: "بيانات_الحاصلين_على_الدرجات_الربع_الثاني",
            type: "Excel",
            size: "245 KB",
            date: "30/06/2026",
            by: "محمد علي",
          },
          {
            name: "دليل تعبئة البيان",
            type: "PDF",
            size: "1.2 MB",
            date: "30/06/2026",
            by: "محمد علي",
          },
        ];

  return {
    ...template,
    ...(listRow || {}),
    id: listRow?.id ?? (Number.isFinite(Number(id)) ? Number(id) : id),
    title: listRow?.title ?? template?.title,
    info: created?.info
      || (preferGraduates && !enriched
        ? {
            ...(graduates?.info || {}),
            "عنوان نموذج البيان": listRow?.title || graduates?.info?.["عنوان نموذج البيان"],
          }
        : template?.info),
    yearInfo: created?.yearInfo || template?.yearInfo,
    formTable: preferGraduates && !enriched ? graduates?.formTable : template?.formTable,
    fulfillmentTable: preferGraduates && !enriched ? graduates?.fulfillmentTable : template?.fulfillmentTable,
    attachments: (created?.attachments?.length
      ? created.attachments
      : attachments),
  };
}
