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
export * from "./mock";

/** Palette shared by the general admin indicator cards and charts */
export const gaStatusColors = {
  "لم تبدأ بعد": "#1B75FF",
  "قيد التنفيذ": "#FFC107",
  تعديل: "#FF8C08",
  "قيد المراجعة": "#9747FF",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
};

/** مؤشرات تبادل نماذج البيان */
export const exchangeStatusCards = [
  { label: "لم تبدأ بعد", value: 91, delta: "+3%", up: true, icon: "FileText", color: "#0147B2" },
  { label: "قيد التنفيذ", value: 139, delta: "+3%", up: true, icon: "RefreshCw", color: "#FFC107" },
  { label: "تعديل", value: 74, delta: "+3%", up: true, icon: "FilePenLine", color: "#FF8C08" },
  { label: "قيد المراجعة", value: 61, delta: "+3%", up: true, icon: "FileSearch", color: "#9747FF" },
  { label: "المتأخرة", value: 37, delta: "-3%", up: false, icon: "TriangleAlert", color: "#DC2626" },
  { label: "معتمدة", value: 102, delta: "+3%", up: true, icon: "CircleCheckBig", color: "#16A34A" },
];

/** مؤشرات استيفاء البيانات */
export const fulfillmentStatusCards = [
  { label: "لم تبدأ بعد", value: 84, delta: "+3%", up: true, icon: "FileText", color: "#0147B2" },
  { label: "قيد التنفيذ", value: 112, delta: "+3%", up: true, icon: "RefreshCw", color: "#FFC107" },
  { label: "تعديل", value: 68, delta: "+3%", up: true, icon: "FilePenLine", color: "#FF8C08" },
  { label: "قيد المراجعة", value: 53, delta: "+3%", up: true, icon: "FileSearch", color: "#9747FF" },
  { label: "المتأخرة", value: 29, delta: "-3%", up: false, icon: "TriangleAlert", color: "#DC2626" },
  { label: "معتمدة", value: 76, delta: "+3%", up: true, icon: "CircleCheckBig", color: "#16A34A" },
];

/** توزيع نماذج البيان حسب الحالة — نسب مئوية */
export const gaStatusPie = [
  { name: "لم تبدأ بعد", value: 30, color: gaStatusColors["لم تبدأ بعد"] },
  { name: "قيد التنفيذ", value: 40, color: gaStatusColors["قيد التنفيذ"] },
  { name: "تعديل", value: 10, color: gaStatusColors["تعديل"] },
  { name: "قيد المراجعة", value: 5, color: gaStatusColors["قيد المراجعة"] },
  { name: "المتأخرة", value: 5, color: gaStatusColors["المتأخرة"] },
  { name: "معتمدة", value: 10, color: gaStatusColors["معتمدة"] },
];

/** توزيع البيانات حسب الحالة — أعداد مجموعها 251 */
export const gaStatusDonut = [
  { name: "لم تبدأ بعد", value: 94.98, color: gaStatusColors["لم تبدأ بعد"] },
  { name: "قيد التنفيذ", value: 66.61, color: gaStatusColors["قيد التنفيذ"] },
  { name: "تعديل", value: 47.27, color: gaStatusColors["تعديل"] },
  { name: "قيد المراجعة", value: 4.48, color: gaStatusColors["قيد المراجعة"] },
  { name: "المتأخرة", value: 11.18, color: gaStatusColors["المتأخرة"] },
  { name: "معتمدة", value: 26.48, color: gaStatusColors["معتمدة"] },
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
