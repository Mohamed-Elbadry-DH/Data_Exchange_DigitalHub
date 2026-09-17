import { ROLES } from "./roles";

/**
 * The request lifecycle is shared across modules: each stage names the single
 * role that owns it, so any module can tell whether the signed-in user is the
 * one expected to act, or is only watching another role's stage.
 */
export const STAGES = [
  { id: "create", label: "إنشاء نموذج البيان", owner: ROLES.GENERAL_ADMIN },
  { id: "review-form", label: "مراجعة نموذج البيان", owner: ROLES.GA_SUPERVISOR },
  { id: "approve-form", label: "اعتماد نموذج البيان", owner: ROLES.DECISION_MAKER },
  { id: "fulfill", label: "استيفاء البيانات", owner: ROLES.ENTITY },
  { id: "review-data", label: "مراجعة البيانات", owner: ROLES.ENTITY_SUPERVISOR },
  { id: "final-approval", label: "الاعتماد النهائي", owner: ROLES.GA_SUPERVISOR },
  { id: "close", label: "إغلاق الطلب", owner: ROLES.GENERAL_ADMIN },
];

/** مراحل دورة نماذج البيان فقط — تنتهي باعتماد نموذج البيان */
export const FORMS_STAGES = STAGES.slice(0, 3);

/** مراحل دورة البيانات المطلوبة — تبدأ باستيفاء البيانات */
export const REQUIRED_STAGES = STAGES.slice(3);

/**
 * Stepper المعروض في تفاصيل /ga/forms:
 * الثلاث مراحل + خطوة ختامية للعرض فقط.
 * معتمد (1182:1529): «جاهز للإرسال» رمادي · تم الإرسال (2334:1687): أخضر «تم الإرسال».
 */
export const FORMS_STEPPER = [
  ...FORMS_STAGES,
  { id: "ready-to-send", label: "جاهز للإرسال", doneLabel: "تم الإرسال" },
];

/** Forms-lane terminal: approved and/or sent to entity (stepper complete). */
export const isFormsApprovedStatus = (status) =>
  status === "معتمد"
  || status === "معتمدة"
  || status === "إرسال للجهة"
  || status === "تم الإرسال"
  || status === "تم إرساله للجهة";

/** Sent-to-entity only — Figma list «تم إرساله للجهة» / InfoTile «إرسال للجهة». */
export const isFormsEntitySentStatus = (status) =>
  status === "إرسال للجهة"
  || status === "تم الإرسال"
  || status === "تم إرساله للجهة";

/** @deprecated use isFormsApprovedStatus */
export const isFormsSentStatus = isFormsApprovedStatus;

/**
 * Stepper المعروض في تفاصيل /ga/required (Figma 1183:1955) —
 * نفس REQUIRED_STAGES بعناوين مطابقة للتصميم.
 */
export const REQUIRED_STEPPER = REQUIRED_STAGES.map((s) => {
  if (s.id === "final-approval") return { ...s, label: "اعتماد نهائي" };
  if (s.id === "close") return { ...s, label: "غلق الطلب" };
  return s;
});

export const stageIndex = (stageId) => STAGES.findIndex((s) => s.id === stageId);

export const stageById = (stageId) => STAGES.find((s) => s.id === stageId);

export const ownsStage = (role, stageId) => stageById(stageId)?.owner === role;

export const nextStage = (stageId) => STAGES[stageIndex(stageId) + 1] || null;

/** True when current stage is at/after the target in the shared lifecycle. */
export const hasReachedStage = (currentId, targetId) => {
  const current = stageIndex(currentId);
  const target = stageIndex(targetId);
  return current >= 0 && target >= 0 && current >= target;
};

/** طلب ما زال في مسار نماذج البيان (قبل الاستيفاء) */
export const isFormsStage = (stageId) => {
  const i = stageIndex(stageId || "create");
  return i >= 0 && i < FORMS_STAGES.length;
};

/** طلب انتقل لمسار البيانات المطلوبة (الاستيفاء فما بعده) */
export const isRequiredStage = (stageId) => hasReachedStage(stageId, "fulfill");

/** مسار تفاصيل الطلب حسب المرحلة */
export const gaDetailBasePath = (stageId) =>
  isRequiredStage(stageId) ? "/ga/required" : "/ga/forms";

/**
 * «مسار الاعتماد» shown while a نموذج البيان template is being built
 * (Figma 645:3331). This is the template-authoring approval path and is
 * deliberately separate from `STAGES`, which is the request lifecycle that
 * begins only once the template exists — do not merge the two.
 */
export const FORM_BUILD_STEPS = [
  { id: "create-template", label: "إنشاء القالب", owner: "مرسل الطلب - الإدارة" },
  { id: "build-structure", label: "بناء الهيكل", owner: "مدير النظام" },
  { id: "supervisor-approval", label: "اعتماد المشرف", owner: "مشرف الإدارة" },
  { id: "send-to-entity", label: "إرسال للجهة الخارجية", owner: "مرسل الطلب - الجهة" },
];

export const FORM_BUILD_STATUS = {
  DONE: "مكتمل",
  ACTIVE: "جاري العمل",
  WAITING: "في الانتظار",
};

/**
 * The three-step wizard the IT specialist walks through to author a template
 * (Figma 279:77 → 282:185 → 645:3331). Distinct from FORM_BUILD_STEPS above,
 * which is the approval path displayed *inside* the final wizard step.
 */
export const FORM_WIZARD_STEPS = [
  { id: "metadata", title: "البيانات الوصفية لنموذج البيان", subtitle: "المعلومات الأساسية" },
  { id: "structure", title: "بناء نموذج البيان", subtitle: "الأعمدة و المجموعات" },
  { id: "review", title: "مراجعة و إرسال", subtitle: "التحقق من الصحة و الإرسال" },
];
