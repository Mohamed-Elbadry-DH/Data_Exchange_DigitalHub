/**
 * Data source for the decision maker module (`/dm`), built from Figma section
 * `455:19763` (screen `649:10179`).
 *
 * Same contract as `mockGa.js`: start from the shared mock, and declare an
 * export locally only where this module's design genuinely differs — an
 * explicit export takes precedence over `export *`.
 */
export * from "./mock";

/** Identical card sets to the general admin dashboard — single-sourced */
export { exchangeStatusCards, fulfillmentStatusCards } from "./indicators";

/** Palette shared by the indicator cards and the status charts */
export const dmStatusColors = {
  "لم تبدأ بعد": "#1B75FF",
  "قيد التنفيذ": "#FFC107",
  تعديل: "#FF8C08",
  "قيد المراجعة": "#9747FF",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
};

/** مؤشرات عامة — four cards (the shared `kpis` has three; this design adds الإدارات العامة) */
export const kpis = [
  { label: "نماذج البيان", value: 316, delta: "+3%", up: true, icon: "FileText", color: "#0986ED" },
  { label: "الإدارات العامة", value: 30, delta: "+3%", up: true, icon: "Building", color: "#9747FF" },
  { label: "الجهات الخارجية", value: 40, delta: "-3%", up: false, icon: "Building2", color: "#C89637" },
  { label: "المستخدمين", value: 60, delta: "+3%", up: true, icon: "Users", color: "#34609A" },
];

/** حالات استيفاء البيانات — six segments summing to the donut total */
export const dmFulfillmentDonut = [
  { name: "لم تبدأ بعد", value: 94.98, color: dmStatusColors["لم تبدأ بعد"] },
  { name: "قيد التنفيذ", value: 39.65, color: dmStatusColors["قيد التنفيذ"] },
  { name: "تعديل", value: 47.27, color: dmStatusColors["تعديل"] },
  { name: "قيد المراجعة", value: 4.48, color: dmStatusColors["قيد المراجعة"] },
  { name: "المتأخرة", value: 38.34, color: dmStatusColors["المتأخرة"] },
  { name: "معتمدة", value: 26.48, color: dmStatusColors["معتمدة"] },
];
export const dmFulfillmentDonutTotal = 251;

/** توزيع نماذج البيان حسب الإدارات */
export const dmAdminsPie = [
  { name: "الماليه والاسعار", value: 30, color: "#1B75FF" },
  { name: "إدارة التخطيط", value: 60, color: "#C89637" },
  { name: "إدارة الإحصاء", value: 20, color: "#9747FF" },
  { name: "إدارة تقنية المعلومات", value: 10, color: "#4B6F1F" },
];

/** اتجاه نماذج البيان خلال الأشهر — يناير→يونيو */
export const DM_TREND_KEYS = ["البيانات المكتملة", "البيانات المتأخرة"];
export const DM_TREND_COLORS = {
  "البيانات المكتملة": "#16A34A",
  "البيانات المتأخرة": "#DC2626",
};
export const dmMonthlyTrend = [
  { month: "يناير", "البيانات المكتملة": 118, "البيانات المتأخرة": 137 },
  { month: "فبراير", "البيانات المكتملة": 99, "البيانات المتأخرة": 125 },
  { month: "مارس", "البيانات المكتملة": 152, "البيانات المتأخرة": 122 },
  { month: "أبريل", "البيانات المكتملة": 170, "البيانات المتأخرة": 128 },
  { month: "مايو", "البيانات المكتملة": 185, "البيانات المتأخرة": 28 },
  { month: "يونيو", "البيانات المكتملة": 80, "البيانات المتأخرة": 160 },
];

/** التنبيهات */
export const dmAlerts = [
  { count: 3, text: "جهات لم ترفع بياناتها فى الموعد المحدد", time: "منذ 2 يوم" },
  { count: 7, text: "بيانات تجاوزت الموعد النهائى", time: "منذ 2 يوم" },
];
