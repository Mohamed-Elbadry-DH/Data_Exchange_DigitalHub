import { ROLES } from "./roles";

/**
 * The request lifecycle is shared across modules: each stage names the single
 * role that owns it, so any module can tell whether the signed-in user is the
 * one expected to act, or is only watching another role's stage.
 */
export const STAGES = [
  { id: "create", label: "إنشاء نموذج البيان", owner: ROLES.GENERAL_ADMIN },
  { id: "review-form", label: "مراجعة النموذج", owner: ROLES.GA_SUPERVISOR },
  { id: "approve-form", label: "اعتماد نموذج البيان", owner: ROLES.DECISION_MAKER },
  { id: "fulfill", label: "استيفاء البيانات", owner: ROLES.ENTITY },
  { id: "review-data", label: "مراجعة البيانات", owner: ROLES.ENTITY_SUPERVISOR },
  { id: "final-approval", label: "الاعتماد النهائي", owner: ROLES.GA_SUPERVISOR },
  { id: "close", label: "غلق الطلب", owner: ROLES.GENERAL_ADMIN },
];

export const stageIndex = (stageId) => STAGES.findIndex((s) => s.id === stageId);

export const stageById = (stageId) => STAGES.find((s) => s.id === stageId);

export const ownsStage = (role, stageId) => stageById(stageId)?.owner === role;

export const nextStage = (stageId) => STAGES[stageIndex(stageId) + 1] || null;
