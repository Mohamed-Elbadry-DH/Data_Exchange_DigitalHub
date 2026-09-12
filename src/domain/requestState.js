import {
  nextStage, stageById, isFormsStage, isRequiredStage, hasReachedStage,
} from "./workflow";
import { ROLES } from "./roles";

const STORAGE_KEY = "mped-ga-request-state-v5";
const CREATED_KEY = "mped-ga-created-requests-v1";

/** Default presentation when a request enters / sits on a stage */
export const STAGE_DEFAULTS = {
  create: {
    status: "قيد التنفيذ",
    currentEntity: "تقنية النظم والمعلومات",
    officer: "أحمد محمد",
    officerRole: "أخصائي تقنية النظم والمعلومات",
  },
  "review-form": {
    status: "بانتظار المراجعة",
    currentEntity: "الإدارة العامة",
    officer: "محمد علي",
    officerRole: ROLES.GENERAL_ADMIN,
  },
  "approve-form": {
    status: "قيد المراجعة",
    currentEntity: "مشرف الإدارة",
    officer: "سارة حسن",
    officerRole: ROLES.GA_SUPERVISOR,
  },
  fulfill: {
    status: "قيد التنفيذ",
    currentEntity: "الجهة الخارجية",
    officer: "محمد علي",
    officerRole: ROLES.ENTITY,
  },
  "review-data": {
    status: "قيد المراجعة",
    currentEntity: "الإدارة العامة",
    officer: "محمد علي",
    officerRole: ROLES.GENERAL_ADMIN,
  },
  "final-approval": {
    status: "بانتظار الاعتماد",
    currentEntity: "مشرف الإدارة",
    officer: "سارة حسن",
    officerRole: ROLES.GA_SUPERVISOR,
  },
  close: {
    status: "معتمد",
    currentEntity: "الإدارة العامة",
    officer: "محمد علي",
    officerRole: ROLES.GENERAL_ADMIN,
  },
};

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(all) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadRequestState(id) {
  const all = readAll();
  return all[String(id)] || null;
}

export function saveRequestState(id, patch) {
  const all = readAll();
  const key = String(id);
  all[key] = { ...all[key], ...patch, updatedAt: Date.now() };
  writeAll(all);
  return all[key];
}

/** Merge seed mock row/detail with any live simulation overrides. */
export function resolveRequest(seed, id = seed?.id) {
  const live = loadRequestState(id);
  if (!live) return { ...seed };
  return { ...seed, ...live };
}

export function resolveRequestList(rows) {
  return rows.map((r) => resolveRequest(r, r.id));
}

/**
 * Merge forms + required seed rows into one catalog (unique by id).
 * Forms seed wins on conflict so live stage can move a forms request into required.
 */
export function mergeRequestCatalog(formsRows = [], requiredRows = []) {
  const map = new Map();
  for (const r of requiredRows) map.set(String(r.id), r);
  for (const r of formsRows) map.set(String(r.id), r);
  return [...map.values()];
}

/** قائمة نماذج البيان — صفوف البذور + الطلبات المُنشأة محلياً */
export function resolveFormsList(formsRows = []) {
  return resolveRequestList([...formsRows, ...loadCreatedRequests()]);
}

/** قائمة البيانات المطلوبة — نفس الطلب (نفس المعرّف) عند الاستيفاء فما بعده */
export function resolveRequiredList(formsRows = [], requiredRows = []) {
  return resolveRequestList(
    mergeRequestCatalog([...formsRows, ...loadCreatedRequests()], requiredRows),
  ).filter((r) => isRequiredStage(r.stageId || "create"));
}

function readCreated() {
  try {
    return JSON.parse(localStorage.getItem(CREATED_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCreated(rows) {
  localStorage.setItem(CREATED_KEY, JSON.stringify(rows));
}

/** طلبات أُنشئت من مودال «إنشاء طلب نموذج بيان» (mock persist). */
export function loadCreatedRequests() {
  return readCreated();
}

/**
 * Create a new GA forms-lane request from the dashboard modal.
 * Persists a list row + live stage state, returns the new id.
 */
export function createGaRequest(form = {}) {
  const defaults = STAGE_DEFAULTS.create;
  const existing = readCreated();
  const seedIds = [1, 2, 3, 4, 5, 6, 101, 102, 103, 104, 105, 106];
  const maxExisting = Math.max(900, ...seedIds, ...existing.map((r) => Number(r.id) || 0));
  const id = maxExisting + 1;
  const today = new Date();
  const created = today.toLocaleDateString("en-GB");
  const dueDate = form.dueDate
    ? form.dueDate.includes("-")
      ? form.dueDate.split("-").reverse().join("/")
      : form.dueDate
    : created;

  const title = (form.title || "").trim() || "طلب نموذج بيان جديد";
  const info = {
    "عنوان نموذج البيان": title,
    "الإدارة المسؤولة": form.department || "",
    "النشرة": form.bulletin || "",
    "الجهة المسؤولة": form.entity || "",
    "النطاق الجغرافي": form.geoScope || "",
    "وصف البيان": form.description || "",
    "المنهجية": form.methodology || "",
  };
  const yearInfo = {
    "نوع السنة": form.yearType || "ميلادية",
    "السنة": form.year || "",
    "الدورية": form.periodicity || "",
    "تفصيل الدورية": form.periodicityDetail || "",
    "فترة تجميع البيان (من - إلى)": [form.collectFrom, form.collectTo].filter(Boolean).join(" - ") || "",
    "تاريخ الاستحقاق": dueDate,
    "فترة السماح (أيام)": form.graceDays ? `${form.graceDays} أيام` : "",
  };
  const attachments = form.uploadName
    ? [{
        name: String(form.uploadName).replace(/\.[^.]+$/, "") || form.uploadName,
        type: /\.pdf$/i.test(form.uploadName) ? "PDF" : "Excel",
        size: "—",
        date: created,
        by: form.assignTo || defaults.officer,
      }]
    : [];

  const row = {
    id,
    title,
    org: form.entity || form.department || defaults.currentEntity,
    officer: form.assignTo || defaults.officer,
    created,
    due: dueDate,
    status: defaults.status,
    stageId: "create",
    currentEntity: defaults.currentEntity,
    officerRole: defaults.officerRole,
    entity: form.entity || "",
    bulletin: form.bulletin || "",
    description: form.description || "",
    uploadName: form.uploadName || "",
    info,
    yearInfo,
    attachments,
  };

  writeCreated([row, ...existing]);
  saveRequestState(id, {
    stageId: "create",
    status: defaults.status,
    currentEntity: defaults.currentEntity,
    officer: row.officer,
    officerRole: defaults.officerRole,
    title: row.title,
    org: row.org,
    due: row.due,
    info,
    yearInfo,
    attachments,
    uploadName: row.uploadName,
  });
  return row;
}

/**
 * Advance to the next workflow stage and apply its default presentation.
 * Returns the updated live state, or null if already at the last stage.
 * Advancing from اعتماد نموذج البيان → استيفاء البيانات moves the request into البيانات المطلوبة.
 */
export function advanceRequest(id, seed = {}) {
  const current = resolveRequest(seed, id);
  const nxt = nextStage(current.stageId || "create");
  if (!nxt) return null;
  const defaults = STAGE_DEFAULTS[nxt.id] || {};
  return saveRequestState(id, {
    stageId: nxt.id,
    status: defaults.status,
    currentEntity: defaults.currentEntity,
    officer: defaults.officer ?? current.officer,
    officerRole: defaults.officerRole,
  });
}

/** Mark request as needing modification while staying on the current stage. */
export function markModification(id, seed = {}) {
  const current = resolveRequest(seed, id);
  return saveRequestState(id, {
    stageId: current.stageId || "create",
    status: "مطلوب تعديل",
    currentEntity: current.currentEntity,
    officer: current.officer,
    officerRole: current.officerRole,
  });
}

/** After modification, resubmit into the review/fulfill stage of the current lane. */
export function resubmitAfterModification(id, seed = {}) {
  const current = resolveRequest(seed, id);
  const stageId = current.stageId || "create";
  let target;
  if (!hasReachedStage(stageId, "fulfill")) {
    target = "review-form";
  } else if (stageId === "fulfill") {
    target = "fulfill";
  } else {
    target = "review-data";
  }
  const defaults = STAGE_DEFAULTS[target];
  return saveRequestState(id, {
    stageId: target,
    status: defaults.status,
    currentEntity: defaults.currentEntity,
    officer: defaults.officer,
    officerRole: defaults.officerRole,
  });
}

/** Clear live simulation for a request so it returns to its seed mock. */
export function resetRequestState(id) {
  const all = readAll();
  delete all[String(id)];
  writeAll(all);
}

/** Reset to the beginning of the experiment (create / قيد التنفيذ). */
export function resetRequestToStart(id, seed = {}) {
  const defaults = STAGE_DEFAULTS.create;
  return saveRequestState(id, {
    stageId: "create",
    status: defaults.status,
    currentEntity: defaults.currentEntity,
    officer: seed.officer || defaults.officer,
    officerRole: defaults.officerRole,
    title: seed.title,
    org: seed.org,
  });
}

export function stageLabel(stageId) {
  return stageById(stageId)?.label || "إنشاء نموذج البيان";
}
