/**
 * Supervisor-lane status overrides (forms / required).
 * Separate from GA workflow `requestState` so approve/edit labels stay
 * مشرف-facing (معتمدة / تعديل) without rewriting stage simulation.
 */
const STORAGE_KEY = "mped-supervisor-status-v1";

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

function storageKey(lane, id) {
  return `${lane}:${id}`;
}

/** @param {"forms"|"required"} lane */
export function loadSupervisorStatus(lane, id) {
  const all = readAll();
  const entry = all[storageKey(lane, id)];
  return entry?.status ?? null;
}

/** @param {"forms"|"required"} lane */
export function saveSupervisorStatus(lane, id, status) {
  const all = readAll();
  all[storageKey(lane, id)] = { status, updatedAt: Date.now() };
  writeAll(all);
  return status;
}

/** Mark request معتمدة after supervisor approve. */
export function approveSupervisorRequest(lane, id) {
  return saveSupervisorStatus(lane, id, "معتمدة");
}

/** Mark request تعديل after supervisor modification request. */
export function requestSupervisorModification(lane, id) {
  return saveSupervisorStatus(lane, id, "تعديل");
}

/** Merge list rows with any persisted supervisor status. */
export function resolveSupervisorList(rows, lane) {
  return rows.map((r) => {
    const status = loadSupervisorStatus(lane, r.id);
    return status ? { ...r, status } : r;
  });
}

/** Merge detail seed with persisted supervisor status. */
export function resolveSupervisorDetail(seed, lane, id = seed?.listId ?? seed?.id) {
  const status = loadSupervisorStatus(lane, id);
  if (!status) return { ...seed };
  return { ...seed, status };
}
