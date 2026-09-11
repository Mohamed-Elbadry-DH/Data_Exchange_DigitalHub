/**
 * Data source for the external-entity module (`/ent`) — موظف الجهة الخارجية.
 * Built from Figma `1702:7443` (لوحة التحكم) and `1705:8613` (البيانات المطلوبة).
 *
 * Same contract as the other role modules: start from the shared mock and
 * declare an export locally only where this role's design genuinely differs.
 */
export * from "./mock";

/** Palette shared by the indicator cards and the status charts */
export const entStatusColors = {
  "لم تبدأ بعد": "#1B75FF",
  "قيد المراجعة": "#9747FF",
  "مطلوب تعديل": "#FF8C08",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
};

/**
 * مؤشرات لوحة التحكم — سبعة كروت.
 * Figma orders them right→left starting at البيانات المطلوبة.
 */
export const entStatusCards = [
  { label: "البيانات المطلوبة", value: 95, delta: "+3%", up: true, icon: "FileText", color: "#0147B2" },
  { label: "الإدارات العامة", value: 200, delta: "+3%", up: true, icon: "Building", color: "#9747FF" },
  { label: "لم تبدأ بعد", value: 60, delta: "+3%", up: true, icon: "FileText", color: "#1B75FF" },
  { label: "قيد المراجعة", value: 3, delta: "+3%", up: true, icon: "FileSearch", color: "#9747FF" },
  { label: "مطلوب تعديل", value: 10, delta: "+3%", up: true, icon: "FilePenLine", color: "#FF8C08" },
  { label: "متأخرة", value: 2, delta: "-3%", up: false, icon: "TriangleAlert", color: "#DC2626" },
  { label: "معتمدة", value: 20, delta: "+3%", up: true, icon: "CircleCheckBig", color: "#16A34A" },
];

/** توزيع البيانات حسب الحالة — النسب كما في التصميم، والمركز 95 */
export const entStatusDonut = [
  { name: "لم تبدأ بعد", value: 60, color: entStatusColors["لم تبدأ بعد"] },
  { name: "قيد المراجعة", value: 30, color: entStatusColors["قيد المراجعة"] },
  { name: "مطلوب تعديل", value: 10, color: entStatusColors["مطلوب تعديل"] },
  { name: "المتأخرة", value: 5, color: entStatusColors.المتأخرة },
  { name: "معتمدة", value: 2, color: entStatusColors.معتمدة },
];
export const entStatusDonutTotal = 95;

/** نسبة الإنجاز لأعلى 5 إدارات */
export const entTopAdmins = [
  { name: "الادارة العامة لاحصاءات المالية والاسعار", value: 78 },
  { name: "الادارة العامة لاحصاءات الخدمات", value: 52 },
  { name: "الادارة العامة لاحصاءات التعليم والكفايات العلمية", value: 40 },
  { name: "الادارة العامة لاحصاءات التجارة الخارجية والداخلية", value: 66 },
  { name: "الادارة العامة لاحصاءات البيئة", value: 71 },
];

/** البيانات المطلوبة شهرياً — سلسلتان: معتمد / تعديل */
export const ENT_TREND_KEYS = ["معتمد", "تعديل"];
export const ENT_TREND_COLORS = { معتمد: "#16A34A", تعديل: "#FFC107" };
export const entMonthlyTrend = [
  { month: "يناير", معتمد: 34, تعديل: 52 },
  { month: "فبراير", معتمد: 60, تعديل: 44 },
  { month: "مارس", معتمد: 46, تعديل: 68 },
  { month: "أبريل", معتمد: 72, تعديل: 40 },
  { month: "مايو", معتمد: 58, تعديل: 62 },
  { month: "يونيو", معتمد: 84, تعديل: 55 },
  { month: "يوليو", معتمد: 66, تعديل: 78 },
  { month: "أغسطس", معتمد: 95, تعديل: 60 },
  { month: "سبتمبر", معتمد: 74, تعديل: 88 },
  { month: "أكتوبر", معتمد: 102, تعديل: 70 },
  { month: "نوفمبر", معتمد: 88, تعديل: 96 },
  { month: "ديسمبر", معتمد: 118, تعديل: 82 },
];

/** تنبيهات عاجلة — أربعة صفوف */
export const entUrgentAlerts = [
  { id: 1, title: "بيانات المستفيدين من الدعم", org: "الإدارة العامة للخدمات", due: "12/06/2026", note: "متأخر منذ يومين", late: true },
  { id: 2, title: "بيانات المستفيدين من الدعم", org: "الإدارة العامة للخدمات", due: "12/06/2026", note: "متأخر منذ يومين", late: true },
  { id: 3, title: "بيانات المستفيدين من الدعم", org: "الإدارة العامة للخدمات", due: "12/06/2026", note: "متبقي 3 أيام", late: false },
  { id: 4, title: "بيانات المستفيدين من الدعم", org: "الإدارة العامة للخدمات", due: "12/06/2026", note: "متبقي 3 أيام", late: false },
];

/** قائمة البيانات المطلوبة — كما في التصميم */
export const entRequiredRows = [
  {
    id: 201, title: "بيانات السكان", stageLabel: "استيفاء البيانات", org: "الجهة الخارجية",
    currentEntity: "الجهة الخارجية", officer: "أحمد محمد", status: "لم تبدأ بعد",
    created: "01/06/2026", due: "15/06/2026",
  },
  {
    id: 202, title: "بيانات الصناعة", stageLabel: "استيفاء البيانات", org: "الجهة الخارجية",
    currentEntity: "الجهة الخارجية", officer: "وزارة الصناعة", status: "مطلوب تعديل",
    created: "01/06/2026", due: "15/06/2026",
  },
  {
    id: 203, title: "بيانات الاستثمار", stageLabel: "مراجعة البيانات", org: "مشرف الجهة",
    currentEntity: "مشرف الجهة", officer: "محمد على", status: "قيد المراجعة",
    created: "01/06/2026", due: "15/06/2026",
  },
  {
    id: 204, title: "بيانات النقل", stageLabel: "الاعتماد النهائي", org: "مشرف الإدارة",
    currentEntity: "مشرف الإدارة", officer: "ساره شمس", status: "مطلوب تعديل",
    created: "01/06/2026", due: "15/06/2026",
  },
  {
    id: 205, title: "بيانات الإسكان", stageLabel: "إغلاق الطلب", org: "الإدارة العامة",
    currentEntity: "الإدارة العامة", officer: "محمد على", status: "معتمد",
    created: "01/06/2026", due: "15/06/2026",
  },
];

/** تفاصيل الطلب — Figma 1706:8969 / 1706:9252 */
export const entRequestDetail = {
  name: "بيانات التعليم العام",
  status: "لم تبدأ بعد",
  stage: "استيفاء البيانات",
  admin: "الإدارة العامة للتعليم",
  officer: "أحمد محمد",
  officerRole: "أخصائي تقنية النظم والمعلومات",
  due: "15/06/2026",
  info: {
    "عنوان نموذج البيان": "بيانات الحاصلين على الدرجات العلمية",
    "الإدارة المسؤولة": "الإدارة العامة للتعليم",
    "النشرة": "نشرة التعليم العالي",
    "الجهة المسؤولة": "وزارة التعليم العالي والبحث العلمي",
    "النطاق الجغرافي": "جمهورية مصر العربية",
    "وصف البيان":
      "جمع بيانات أعداد الحاصلين على الدبلوم والماجستير والدكتوراه من الجامعات الحكومية والخاصة داخل جمهورية مصر العربية",
    "المنهجية":
      "أسند 6: يتضمن خريجي التعليم العالي (بكالوريوس، ليسانس) الحاصلين على درجة الدبلوم",
  },
  yearInfo: {
    "نوع السنة": "ميلادية",
    "السنة": "2026",
    "الدورية": "ربع سنوي",
    "تفصيل الدورية": "الربع الثاني",
    "فترة تجميع البيان (من - إلى)": "01/04/2026 - 30/06/2026",
    "تاريخ الاستحقاق": "15/07/2026",
    "فترة السماح (أيام)": "7 أيام",
  },
  /** مصفوفة استيفاء البيانات — أعمدة مجمّعة (دبلوم/ماجستير/دكتوراه/الإجمالي × ذكور/إناث) */
  matrix: {
    rowHeader: "التخصص",
    groups: [
      { label: "دبلوم", columns: ["ذكور", "إناث"] },
      { label: "ماجستير", columns: ["ذكور", "إناث"] },
      { label: "دكتوراه", columns: ["ذكور", "إناث"] },
      { label: "الإجمالي", columns: ["ذكور", "إناث", "الإجمالي الكلي"] },
    ],
    rows: [
      { id: 1, name: "الهندسة" },
      { id: 2, name: "الطب والعلوم الصحية" },
      { id: 3, name: "العلوم الطبيعية" },
      { id: 4, name: "العلوم الاجتماعية" },
      { id: 5, name: "الآداب والفنون" },
    ],
    /** عدد البيانات المطلوب إدخالها للتحقق قبل الإرسال (Figma 914:3960) */
    requiredCount: 6,
  },
  attachments: [
    { name: "بيانات_الحاصلين_على_الدرجات_الربع_الثاني_2026.xlsx", type: "Excel" },
    { name: "دليل تعبئة البيان.pdf", type: "PDF" },
  ],
};
