/**
 * Data source for the IT specialist module (`/it`).
 *
 * Starts as a mirror of the supervisor mock. To diverge, declare the export
 * locally in this file — an explicit export takes precedence over `export *`,
 * so only the IT specialist pages see the new value.
 *
 * Only override presentation data here (KPI labels, chart series, column sets).
 * Business data both modules act on — requests, notes, users, workflow stages —
 * stays single-sourced (`./mock` and `src/domain/*`).
 */
export * from "./mock";

export const user = {
  name: "م. مصطفى سيد",
  role: "أخصائي تقنية النظم والمعلومات",
  notifications: 6,
};

/** Status vocabulary used across the IT-specialist screens (§3.4 handover doc) */
export const itStatusColors = {
  منتظم: "#16A34A",
  متأخر: "#DC2626",
  "لا يوجد": "#7F8999",
  "قيد المراجعة": "#9747FF",
  "قيد تنفيذ": "#5C5C5C",
  "لم يبدأ بعد": "#1B75FF",
  معتمد: "#16A34A",
  معتمدة: "#16A34A",
  متأخرة: "#DC2626",
};

export const statusBadge = {
  منتظم: { bg: "#DDF2E5", fg: "#16A34A" },
  متأخر: { bg: "#FCE4E4", fg: "#DC2626" },
  "لا يوجد": { bg: "#F1F1F1", fg: "#7F8999" },
  "قيد المراجعة": { bg: "rgba(202,138,4,0.1)", fg: "#ca8a04" },
  "قيد تنفيذ": { bg: "rgba(92,92,92,0.1)", fg: "#5C5C5C" },
  "لم يبدأ بعد": { bg: "rgba(29,78,216,0.1)", fg: "#1d4ed8" },
  نشط: { bg: "rgba(22,163,74,0.1)", fg: "#16a34a" },
  "غير نشط": { bg: "rgba(200,150,55,0.1)", fg: "#c89637" },
  تعديل: { bg: "#FFE8D6", fg: "#EA580C" },
  معتمد: { bg: "#DDF2E5", fg: "#16A34A" },
  معتمدة: { bg: "#DDF2E5", fg: "#16A34A" },
  متأخرة: { bg: "#FCE4E4", fg: "#DC2626" },
};

/** مؤشرات عامة — Figma 895:2509 (LTR card order, all 43 in design) */
export const itKpis = [
  { label: "الإدارات", value: 43, icon: "Building" },
  { label: "الجهات المرتبطة", value: 43, icon: "Building2" },
  { label: "النشرات", value: 43, icon: "ScrollText" },
  { label: "المستخدمين", value: 43, icon: "Users" },
  { label: "نماذج البيان النشطة", value: 43, icon: "FileText" },
];

/** التنبيهات */
export const itAlerts = [
  { count: 3, text: "جهات لم ترفع بياناتها فى الموعد المحدد", time: "منذ 2 يوم" },
  { count: 7, text: "بيانات تجاوزت الموعد النهائى", time: "منذ 2 يوم" },
];

/** توزيع الجهات حسب النوع */
export const entityTypeDistribution = [
  { name: "وزارات", value: 30, color: "#1B75FF" },
  { name: "جامعات", value: 60, color: "#0986ED" },
  { name: "هيئات حكومية", value: 20, color: "#16A34A" },
  { name: "مؤسسات عامة", value: 10, color: "#FF8C08" },
];

/** الإدارات العامة الأعلى فى طلب نماذج البيان */
export const adminsBarSeries = [
  { name: "إدارة تقنية المعلومات", value: 28 },
  { name: "إدارة الإحصاءات الاقتصادية", value: 48 },
  { name: "إدارة تقنية المعلومات", value: 5 },
  { name: "إدارة الموارد البشرية", value: 79 },
  { name: "الادارة العامة لاحصاءات التجارة الخارجية والداخلية", value: 9 },
  { name: "الادارة العامة لاحصاءات النقل والاتصالات", value: 33 },
  { name: "الادارة العامة لاحصاءات العمل", value: 41 },
  { name: "الادارة العامة للإحصاءات الزراعية", value: 66 },
];

/** الطلبات و المهام المعلقة — يظهر فى لوحة التحكم */
export const pendingTasks = [
  { id: 1, date: "2026-04-30", status: "قيد تنفيذ", type: "بناء نموذج بيان", title: "بيانات الحاصلين على الدرجات" },
  { id: 2, date: "2026-04-30", status: "متأخرة", type: "تعديل", title: "بيانات الحاصلين على الدرجات" },
  { id: 3, date: "2026-04-30", status: "معتمد", type: "بناء نموذج بيان", title: "بيانات الحاصلين على الدرجات" },
];

/** الإدارات العامة — list (Figma 645:3671) */
export const generalAdmins = [
  { id: 1, name: "إدارة تقنية المعلومات", created: "2026-04-30", usersCount: 12, status: "منتظم", bulletinsCount: 6, entitiesCount: 8, formsCount: 13 },
  { id: 2, name: "إدارة الإحصاءات الاقتصادية", created: "2026-04-30", usersCount: 16, status: "منتظم", bulletinsCount: 12, entitiesCount: 10, formsCount: 17 },
  { id: 3, name: "إدارة الموارد البشرية", created: "2026-04-30", usersCount: 12, status: "منتظم", bulletinsCount: 6, entitiesCount: 8, formsCount: 13 },
  { id: 4, name: "الإدارة العامة لإحصاءات السكان", created: "2026-04-30", usersCount: 12, status: "منتظم", bulletinsCount: 4, entitiesCount: 6, formsCount: 18 },
  { id: 5, name: "الإدارة العامة للتنمية الصناعية", created: "2026-04-30", usersCount: 9, status: "متأخر", bulletinsCount: 3, entitiesCount: 5, formsCount: 11 },
  { id: 6, name: "الإدارة العامة للمتابعة والتقييم", created: "2026-04-30", usersCount: 7, status: "منتظم", bulletinsCount: 2, entitiesCount: 3, formsCount: 9 },
  { id: 7, name: "الإدارة العامة للإحصاء التربوي", created: "2026-04-30", usersCount: 15, status: "منتظم", bulletinsCount: 5, entitiesCount: 8, formsCount: 22 },
  { id: 8, name: "الإدارة العامة للمعلومات الصحية", created: "2026-04-30", usersCount: 11, status: "متأخر", bulletinsCount: 4, entitiesCount: 6, formsCount: 15 },
];

/** الجهات الخارجية — list */
export const externalEntities = [
  { id: 1, name: "الجهاز المركزي للتعبئة العامة والإحصاء", type: "جهة حكومية", admin: "الإدارة العامة لإحصاءات السكان", status: "منتظم", formsCount: 18, bulletinsCount: 4, created: "01/06/2026" },
  { id: 2, name: "وزارة التجارة والصناعة", type: "جهة حكومية", admin: "الإدارة العامة للتنمية الصناعية", status: "متأخر", formsCount: 11, bulletinsCount: 2, created: "03/06/2026" },
  { id: 3, name: "وزارة التربية والتعليم", type: "جهة حكومية", admin: "الإدارة العامة للإحصاء التربوي", status: "منتظم", formsCount: 22, bulletinsCount: 5, created: "05/06/2026" },
  { id: 4, name: "وزارة الصحة والسكان", type: "جهة حكومية", admin: "الإدارة العامة للمعلومات الصحية", status: "متأخر", formsCount: 15, bulletinsCount: 4, created: "01/06/2026" },
  { id: 5, name: "وزارة المالية", type: "مؤسسات مالية", admin: "الإدارة العامة للحسابات الختامية", status: "منتظم", formsCount: 7, bulletinsCount: 2, created: "07/06/2026" },
  { id: 6, name: "مصلحة الجمارك المصرية", type: "جهات حكومية", admin: "إدارة تقنية المعلومات", status: "منتظم", formsCount: 12, bulletinsCount: 12, created: "2026-04-30" },
  { id: 7, name: "الهيئة العامة للرقابة المالية", type: "هيئات رقابية", admin: "إدارة تقنية المعلومات", status: "متأخر", formsCount: 12, bulletinsCount: 12, created: "2026-04-30" },
  { id: 8, name: "اتحاد الغرف التجارية", type: "منظمات أعمال", admin: "إدارة الإحصاءات الاقتصادية", status: "منتظم", formsCount: 4, bulletinsCount: 2, created: "2026-04-30" },
];

/** النشرات — list (Figma 1060:3607) */
export const bulletins = [
  { id: 1, name: "الدرجات العلمية", admin: "إدارة تقنية المعلومات", periodicity: "شهري", entitiesCount: 3, formsCount: 3, created: "2026-04-30" },
  { id: 2, name: "الدرجات العلمية", admin: "إدارة تقنية المعلومات", periodicity: "ربع سنوي", entitiesCount: 5, formsCount: 5, created: "2026-04-30" },
  { id: 3, name: "الدرجات العلمية", admin: "إدارة تقنية المعلومات", periodicity: "سنوي", entitiesCount: 3, formsCount: 3, created: "2026-04-30" },
  { id: 4, name: "نشرة التقديرات السكانية", admin: "الإدارة العامة لإحصاءات السكان", periodicity: "شهري", entitiesCount: 3, formsCount: 8, created: "2026-04-30" },
  { id: 5, name: "نشرة المنشآت الصناعية", admin: "الإدارة العامة للتنمية الصناعية", periodicity: "ربع سنوي", entitiesCount: 2, formsCount: 5, created: "2026-04-30" },
];

/** المستخدمين — list (Figma 645:5488) */
export const itUsers = [
  { id: 1, name: "م. أحمد محمود", email: "admin@capmas.gov.eg", phone: "01123432435", affiliation: "مشرف الإدارة العامة", jobRole: "موظف", org: "وزارة التعليم العالى", joined: "2026-04-30", stopped: "-", status: "نشط" },
  { id: 2, name: "م. أحمد محمود", email: "admin@capmas.gov.eg", phone: "01123432435", affiliation: "الإدارة العامة", jobRole: "مشرف", org: "وزارة التعليم العالى", joined: "2026-04-30", stopped: "2027-01-30", status: "غير نشط" },
  { id: 3, name: "سارة علي", email: "sara@capmas.gov.eg", phone: "01123432435", affiliation: "الإدارة العامة", jobRole: "موظف", org: "وزارة التجارة والصناعة", joined: "2026-04-30", stopped: "-", status: "نشط" },
  { id: 4, name: "هدى فؤاد", email: "hoda@capmas.gov.eg", phone: "01123432435", affiliation: "مشرف الجهة الخارجية", jobRole: "مشرف", org: "وزارة الصحة والسكان", joined: "2026-04-30", stopped: "-", status: "نشط" },
  { id: 5, name: "عمر حسن", email: "omar@capmas.gov.eg", phone: "01123432435", affiliation: "الجهة الخارجية", jobRole: "موظف", org: "وزارة المالية", joined: "2026-04-30", stopped: "2026-05-30", status: "غير نشط" },
];

/** الطلبات — list (Figma 649:7406) */
export const itRequests = [
  { id: "REQ-2024-085", title: "بيانات الحاصلين على الدرجات", admin: "إدارة تقنية المعلومات", type: "بناء نموذج بيان", submitted: "2026-04-30", due: "2026-04-30", status: "قيد تنفيذ", sentBy: "أحمد محمد علي" },
  { id: "REQ-2024-084", title: "بيانات الحاصلين على الدرجات", admin: "هيئة الاتصالات", type: "تعديل", submitted: "2026-04-30", due: "2026-04-30", status: "متأخر", sentBy: "سارة علي" },
  { id: "REQ-2024-083", title: "بيانات الحاصلين على الدرجات", admin: "هيئة الإحصاء", type: "بناء نموذج بيان", submitted: "2026-04-30", due: "2026-04-30", status: "معتمد", sentBy: "هدى فؤاد" },
  { id: "REQ-2024-088", title: "بيانات المستشفيات الحكومية", admin: "الإدارة العامة للمعلومات الصحية", type: "بناء نموذج بيان", submitted: "2026-04-30", due: "2026-04-30", status: "قيد المراجعة", sentBy: "عمر حسن" },
  { id: "REQ-2024-089", title: "بيانات الإيرادات العامة", admin: "الإدارة العامة للحسابات الختامية", type: "بناء نموذج بيان", submitted: "2026-04-30", due: "2026-04-30", status: "لم يبدأ بعد", sentBy: "أحمد محمد علي" },
];

/** Status cards on قائمة الطلبات — Figma 649:7406 */
export const requestListChips = [
  { label: "إجمالي", value: 47, color: "#281df4" },
  { label: "لم يبدأ بعد", value: 3, color: "#1d4ed8" },
  { label: "قيد تنفيذ", value: 3, color: "#5c5c5c" },
  { label: "قيد المراجعة", value: 18, color: "#ca8a04" },
  { label: "تعديل", value: 2, color: "#ea580c" },
  { label: "معتمد", value: 24, color: "#16a34a" },
  { label: "متأخر", value: 3, color: "#dc2626" },
];

/** نماذج البيان shown inside an إدارة / جهة detail tab */
export const detailForms = [
  { id: "REQ-2024-085", title: "بيان الواردات اليومي", entity: "مصلحة الجمارك المصرية", admin: "إدارة تقنية المعلومات", periodicity: "ربع سنوي", status: "معتمد", delivered: "2026-04-30", delay: "لا يوجد" },
  { id: "REQ-2024-086", title: "بيان الصادرات الشهري", entity: "مصلحة الجمارك المصرية", admin: "إدارة تقنية المعلومات", periodicity: "شهري", status: "لم يبدأ بعد", delivered: "2026-04-30", delay: "لا يوجد" },
  { id: "REQ-2024-087", title: "بيان التعريفة الجمركية", entity: "وزارة التجارة والصناعة", admin: "الإدارة العامة للتنمية الصناعية", periodicity: "نصف سنوي", status: "متأخر", delivered: "2026-04-30", delay: "3 ايام" },
  { id: "REQ-2024-088", title: "بيان حركة البضائع", entity: "وزارة التجارة والصناعة", admin: "إدارة تقنية المعلومات", periodicity: "ربع سنوي", status: "تعديل", delivered: "2026-04-30", delay: "لا يوجد" },
  { id: "REQ-2024-089", title: "بيان المخازن الجمركية", entity: "الهيئة العامة للرقابة المالية", admin: "الإدارة العامة للمتابعة والتقييم", periodicity: "شهري", status: "قيد المراجعة", delivered: "2026-04-30", delay: "لا يوجد" },
  { id: "REQ-2024-090", title: "بيان الرسوم المحصلة", entity: "وزارة المالية", admin: "الإدارة العامة للحسابات الختامية", periodicity: "ربع سنوي", status: "قيد تنفيذ", delivered: "2026-04-30", delay: "لا يوجد" },
];

/** Status chip row shown above the المستخدمين detail tab (Figma 645:5488) */
export const detailUserChips = [
  { label: "المستخدمين", value: 12, color: "#1B75FF" },
  { label: "نشط", value: 10, color: "#16A34A" },
  { label: "غير نشط", value: 2, color: "#DC2626" },
];

/** Status chip row shown above the detail tables (Figma 645:5076) */
export const detailStatusChips = [
  { label: "إجمالي", value: 47, color: "#281df4" },
  { label: "لم يبدأ بعد", value: 3, color: "#1d4ed8" },
  { label: "قيد تنفيذ", value: 3, color: "#5c5c5c" },
  { label: "قيد المراجعة", value: 18, color: "#ca8a04" },
  { label: "تعديل", value: 2, color: "#ea580c" },
  { label: "معتمد", value: 24, color: "#16a34a" },
  { label: "متأخر", value: 3, color: "#dc2626" },
];

/** الصلاحيات offered when creating an إدارة عامة */
export const adminPermissions = [
  "طلب إنشاء نموذج البيان",
  "مراجعة نموذج البيان",
  "اعتماد نموذج البيان",
  "اعتماد البيانات",
  "مراجعة بيانات",
  "ادارة الجهات",
  "ادارة المستخدمين",
];

/** الصلاحيات offered when creating a جهة خارجية */
export const entityPermissions = ["إدخال بيانات", "تعديل بيانات", "اعتماد بيانات", "إرسال"];

export const entityTypes = ["جهة حكومية", "مؤسسات مالية", "هيئات رقابية", "منظمات أعمال", "جامعات"];

export const periodicities = ["شهري", "ربع سنوي", "نصف سنوي", "سنوي"];

export const yearTypes = ["ميلادية", "مالية", "دراسية"];

export const tenancies = ["الإدارة العامة", "الجهة الخارجية", "صانع القرار"];

export const jobRoles = ["مشرف إدارة", "موظف إدارة", "مشرف جهة", "موظف جهة", "صانع قرار"];

/** Detail view of a single طلب (Figma 649:7905) */
export const requestDetails = {
  "REQ-2024-085": {
    id: "REQ-2024-085",
    name: "طلب بيان الربع الأول",
    type: "بناء نموذج البيان",
    admin: "إدارة تقنية المعلومات",
    sentBy: "أحمد محمد علي",
    submitted: "2026-04-30",
    due: "2026-04-30",
    info: {
      "عنوان نموذج البيان": "بيانات الحاصلين على الدرجات العلمية",
      "الإدارة المسؤولة": "الإدارة العامة للتعليم",
      "النشرة": "نشرة التعليم العالي",
      "الجهة المسؤولة": "وزارة التعليم العالي والبحث العلمي",
      "النطاق الجغرافي": "جمهورية مصر العربية",
      "وصف البيان": "جمع بيانات أعداد الحاصلين على الدبلوم والماجستير والدكتوراه من الجامعات الحكومية والخاصة داخل جمهورية مصر العربية.",
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
    attachments: [
      { name: "بيانات_الحاصلين_على_الدرجات_الربع_الثاني_2024.xlsx", type: "Excel" },
      { name: "دليل تعبئة البيان.pdf", type: "PDF" },
    ],
    timeline: [
      { title: "تم إرسال الطلب", by: "بواسطة: أحمد محمد علي", at: "2024/05/20 - 10:30" },
      { title: "تم إنشاء الطلب", by: "بواسطة: أحمد محمد علي", at: "2024/05/20 - 10:30" },
    ],
  },
};

/** سجل النشاط — Figma 649:6968 */
export const activityLog = [
  { id: 1, datetime: "28 Apr 2026, 14:30", dateIso: "2026-04-28", user: "أحمد محمود", userSubRole: "Super Admin", actionType: "ربط", org: "مستشفى الأمل العام", details: "تم ربط الجهة الخارجية بـ \"إدارة تقنية المعلومات\"" },
  { id: 2, datetime: "28 Apr 2026, 11:15", dateIso: "2026-04-28", user: "سارة علي", userSubRole: "Sector Admin", actionType: "اعتماد", org: "مديرية التعليم الأساسي", details: "تم اعتماد التقرير المالي للربع الأول بنجاح." },
  { id: 3, datetime: "27 Apr 2026, 09:00", dateIso: "2026-04-27", user: "سارة علي", userSubRole: "Super Admin", actionType: "إنشاء", org: "إدارة الموارد البشرية", details: "تم إنشاء إدارة عامة جديدة وإضافتها للنظام." },
  { id: 4, datetime: "26 Apr 2026, 16:05", dateIso: "2026-04-26", user: "فاطمة محمود", userSubRole: "Sector Admin", actionType: "اعتماد", org: "الإدارة العامة للمعلومات الصحية", details: "تم اعتماد بيانات المستشفيات الحكومية." },
  { id: 5, datetime: "25 Apr 2026, 10:15", dateIso: "2026-04-25", user: "أحمد محمد", userSubRole: "Super Admin", actionType: "اعتماد", org: "الإدارة العامة لإحصاءات السكان", details: "تم اعتماد نموذج بيانات السكان." },
  { id: 6, datetime: "24 Apr 2026, 14:40", dateIso: "2026-04-24", user: "محمد علي", userSubRole: "Sector Admin", actionType: "إنشاء", org: "الإدارة العامة للتنمية الصناعية", details: "تم إنشاء طلب بناء نموذج جديد." },
  { id: 7, datetime: "23 Apr 2026, 09:05", dateIso: "2026-04-23", user: "سارة حسن", userSubRole: "Sector Admin", actionType: "ربط", org: "وزارة التجارة والصناعة", details: "تم ربط جهة خارجية جديدة بالإدارة." },
];
