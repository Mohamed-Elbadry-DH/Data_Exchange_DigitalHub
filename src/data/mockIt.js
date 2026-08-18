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
  "قيد المراجعة": { bg: "#F1E8FF", fg: "#9747FF" },
  "قيد تنفيذ": { bg: "rgba(92,92,92,0.1)", fg: "#5C5C5C" },
  "لم يبدأ بعد": { bg: "#E3EEFF", fg: "#1B75FF" },
  معتمد: { bg: "#DDF2E5", fg: "#16A34A" },
  معتمدة: { bg: "#DDF2E5", fg: "#16A34A" },
  متأخرة: { bg: "#FCE4E4", fg: "#DC2626" },
};

/** مؤشرات عامة — دورة النصف الأول من عام 2026 */
export const itKpis = [
  { label: "نماذج البيان النشطة", value: 43, icon: "FileText" },
  { label: "المستخدمين", value: 60, icon: "Users" },
  { label: "النشرات", value: 18, icon: "Users" },
  { label: "الجهات المرتبطة", value: 24, icon: "Building2" },
  { label: "الإدارات", value: 12, icon: "Building" },
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
  { name: "الادارة العامة للإحصاءات الزراعية", value: 66 },
];

/** الطلبات و المهام المعلقة — يظهر فى لوحة التحكم */
export const pendingTasks = [
  { id: 1, date: "2026-04-30", status: "قيد تنفيذ", type: "بناء نموذج بيان", title: "بيانات الحاصلين على الدرجات" },
  { id: 2, date: "2026-04-30", status: "متأخرة", type: "تعديل", title: "بيانات الحاصلين على الدرجات" },
  { id: 3, date: "2026-04-30", status: "معتمد", type: "بناء نموذج بيان", title: "بيانات الحاصلين على الدرجات" },
];

/** الإدارات العامة — list */
export const generalAdmins = [
  { id: 1, name: "الإدارة العامة لإحصاءات السكان", created: "01/06/2026", usersCount: 12, status: "منتظم", bulletinsCount: 4, entitiesCount: 6, formsCount: 18 },
  { id: 2, name: "الإدارة العامة للتنمية الصناعية", created: "03/06/2026", usersCount: 9, status: "متأخر", bulletinsCount: 3, entitiesCount: 5, formsCount: 11 },
  { id: 3, name: "الإدارة العامة للمتابعة والتقييم", created: "02/06/2026", usersCount: 7, status: "منتظم", bulletinsCount: 2, entitiesCount: 3, formsCount: 9 },
  { id: 4, name: "الإدارة العامة للإحصاء التربوي", created: "05/06/2026", usersCount: 15, status: "منتظم", bulletinsCount: 5, entitiesCount: 8, formsCount: 22 },
  { id: 5, name: "الإدارة العامة لشئون الطلاب والخريجين", created: "04/06/2026", usersCount: 6, status: "لا يوجد", bulletinsCount: 1, entitiesCount: 2, formsCount: 4 },
  { id: 6, name: "الإدارة العامة لمسوح الأسرة", created: "06/06/2026", usersCount: 8, status: "منتظم", bulletinsCount: 3, entitiesCount: 4, formsCount: 10 },
  { id: 7, name: "الإدارة العامة للمعلومات الصحية", created: "01/06/2026", usersCount: 11, status: "متأخر", bulletinsCount: 4, entitiesCount: 6, formsCount: 15 },
  { id: 8, name: "الإدارة العامة للحسابات الختامية", created: "07/06/2026", usersCount: 5, status: "منتظم", bulletinsCount: 2, entitiesCount: 3, formsCount: 7 },
];

/** الجهات الخارجية — list */
export const externalEntities = [
  { id: 1, name: "الجهاز المركزي للتعبئة العامة والإحصاء", type: "جهة حكومية", admin: "الإدارة العامة لإحصاءات السكان", status: "منتظم", formsCount: 18 },
  { id: 2, name: "وزارة التجارة والصناعة", type: "جهة حكومية", admin: "الإدارة العامة للتنمية الصناعية", status: "متأخر", formsCount: 11 },
  { id: 3, name: "وزارة التربية والتعليم", type: "جهة حكومية", admin: "الإدارة العامة للإحصاء التربوي", status: "منتظم", formsCount: 22 },
  { id: 4, name: "وزارة الصحة والسكان", type: "جهة حكومية", admin: "الإدارة العامة للمعلومات الصحية", status: "متأخر", formsCount: 15 },
  { id: 5, name: "وزارة المالية", type: "مؤسسات مالية", admin: "الإدارة العامة للحسابات الختامية", status: "منتظم", formsCount: 7 },
  { id: 6, name: "مصلحة الجمارك المصرية", type: "جهة حكومية", admin: "الإدارة العامة للحسابات الختامية", status: "منتظم", formsCount: 5 },
  { id: 7, name: "الهيئة العامة للرقابة المالية", type: "هيئات رقابية", admin: "الإدارة العامة للمتابعة والتقييم", status: "لا يوجد", formsCount: 2 },
];

/** النشرات — list */
export const bulletins = [
  { id: 1, name: "نشرة التقديرات السكانية", admin: "الإدارة العامة لإحصاءات السكان", periodicity: "شهري", entitiesCount: 3, formsCount: 8, created: "01/06/2026" },
  { id: 2, name: "نشرة المنشآت الصناعية", admin: "الإدارة العامة للتنمية الصناعية", periodicity: "ربع سنوي", entitiesCount: 2, formsCount: 5, created: "03/06/2026" },
  { id: 3, name: "نشرة التعليم قبل الجامعي", admin: "الإدارة العامة للإحصاء التربوي", periodicity: "سنوي", entitiesCount: 5, formsCount: 12, created: "05/06/2026" },
  { id: 4, name: "نشرة الخدمات الصحية", admin: "الإدارة العامة للمعلومات الصحية", periodicity: "ربع سنوي", entitiesCount: 4, formsCount: 9, created: "01/06/2026" },
  { id: 5, name: "نشرة المالية العامة", admin: "الإدارة العامة للحسابات الختامية", periodicity: "ربع سنوي", entitiesCount: 2, formsCount: 4, created: "07/06/2026" },
];

/** المستخدمين — list */
export const itUsers = [
  { id: 1, name: "أحمد محمد", phone: "01123432435", affiliation: "مشرف الإدارة العامة", jobRole: "مشرف إدارة", org: "الإدارة العامة لإحصاءات السكان", joined: "2026-04-30", stopped: "-", status: "منتظم" },
  { id: 2, name: "سارة علي", phone: "01123432435", affiliation: "الإدارة العامة", jobRole: "موظف إدارة", org: "الإدارة العامة للتنمية الصناعية", joined: "2026-04-30", stopped: "-", status: "منتظم" },
  { id: 3, name: "هدى فؤاد", phone: "01123432435", affiliation: "مشرف الجهة الخارجية", jobRole: "مشرف جهة", org: "وزارة التجارة والصناعة", joined: "2026-04-30", stopped: "2026-05-30", status: "متأخر" },
  { id: 4, name: "عمر حسن", phone: "01123432435", affiliation: "الجهة الخارجية", jobRole: "موظف جهة", org: "وزارة الصحة والسكان", joined: "2026-04-30", stopped: "-", status: "منتظم" },
  { id: 5, name: "خالد عبد الرحمن", phone: "01123432435", affiliation: "صانع القرار", jobRole: "صانع قرار", org: "-", joined: "2026-04-30", stopped: "-", status: "منتظم" },
];

/** الطلبات — list */
export const itRequests = [
  { id: "REQ-2024-085", title: "بيانات السكان", admin: "الإدارة العامة لإحصاءات السكان", type: "بناء نموذج بيان", submitted: "01/06/2026", due: "15/06/2026", status: "قيد تنفيذ" },
  { id: "REQ-2024-086", title: "بيانات المنشآت الصناعية", admin: "الإدارة العامة للتنمية الصناعية", type: "بناء نموذج بيان", submitted: "03/06/2026", due: "18/06/2026", status: "متأخرة" },
  { id: "REQ-2024-087", title: "بيانات الطلاب المقيدين", admin: "الإدارة العامة للإحصاء التربوي", type: "بناء نموذج بيان", submitted: "05/06/2026", due: "22/06/2026", status: "قيد تنفيذ" },
  { id: "REQ-2024-088", title: "بيانات المستشفيات الحكومية", admin: "الإدارة العامة للمعلومات الصحية", type: "بناء نموذج بيان", submitted: "01/06/2026", due: "16/06/2026", status: "متأخرة" },
  { id: "REQ-2024-089", title: "بيانات الإيرادات العامة", admin: "الإدارة العامة للحسابات الختامية", type: "بناء نموذج بيان", submitted: "07/06/2026", due: "28/06/2026", status: "قيد تنفيذ" },
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

/** Status chip row shown above the detail tables */
export const detailStatusChips = [
  { label: "متأخر", value: 3, color: "#DC2626" },
  { label: "معتمد", value: 24, color: "#16A34A" },
  { label: "تعديل", value: 2, color: "#FF8C08" },
  { label: "قيد المراجعة", value: 18, color: "#9747FF" },
  { label: "قيد تنفيذ", value: 47, color: "#5C5C5C" },
  { label: "لم يبدأ بعد", value: 3, color: "#1B75FF" },
  { label: "إجمالي", value: 97, color: "#052C65" },
];

/** الصلاحيات offered when creating an إدارة عامة */
export const adminPermissions = [
  "طلب إنشاء نموذج البيان",
  "مراجعة نموذج البيان",
  "اعتماد نموذج البيان",
  "ادارة الجهات",
  "مراجعة بيانات",
  "اعتماد البيانات",
  "ادارة المستخدمين",
];

/** الصلاحيات offered when creating a جهة خارجية */
export const entityPermissions = ["إرسال", "اعتماد بيانات", "تعديل بيانات", "إدخال بيانات"];

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

/** سجل النشاط — list */
export const activityLog = [
  { id: 1, datetime: "30/06/2026 - 10:15 ص", user: "أحمد محمد", userSubRole: "Super Admin", actionType: "اعتماد", org: "الإدارة العامة لإحصاءات السكان", details: "تم اعتماد نموذج بيانات السكان" },
  { id: 2, datetime: "29/06/2026 - 02:40 م", user: "محمد علي", userSubRole: "Sector Admin", actionType: "إنشاء", org: "الإدارة العامة للتنمية الصناعية", details: "تم إنشاء طلب بناء نموذج جديد" },
  { id: 3, datetime: "28/06/2026 - 09:05 ص", user: "سارة حسن", userSubRole: "Sector Admin", actionType: "ربط", org: "وزارة التجارة والصناعة", details: "تم ربط جهة خارجية جديدة بالإدارة" },
  { id: 4, datetime: "27/06/2026 - 11:20 ص", user: "نورا عبد الله", userSubRole: "Sector Admin", actionType: "إنشاء", org: "الإدارة العامة للإحصاء التربوي", details: "تم إنشاء نشرة جديدة" },
  { id: 5, datetime: "26/06/2026 - 04:05 م", user: "فاطمة محمود", userSubRole: "Sector Admin", actionType: "اعتماد", org: "الإدارة العامة للمعلومات الصحية", details: "تم اعتماد بيانات المستشفيات الحكومية" },
];
