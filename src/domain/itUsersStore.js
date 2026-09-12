import { itUsers as seedUsers } from "../data/mockIt";

/**
 * IT module users list — presentation seed from mockIt, writes in localStorage.
 * Additive domain store (IT-only key; does not touch supervisor usersStore).
 */
const STORAGE_KEY = "mped-it-users-v1";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable */
  }
}

export function loadItUsers() {
  return readStored() ?? seedUsers.map((u) => ({ ...u }));
}

export function saveItUsers(users) {
  writeStored(users);
  return users;
}

export function getItUser(id) {
  const n = Number(id);
  return loadItUsers().find((u) => Number(u.id) === n) ?? null;
}

export function upsertItUser(form, editingId = null) {
  const list = loadItUsers();
  if (editingId != null) {
    const next = list.map((u) =>
      Number(u.id) === Number(editingId)
        ? {
            ...u,
            name: form.name,
            email: form.email,
            phone: form.phone,
            affiliation: form.tenancy || u.affiliation,
            jobRole: form.jobRole || u.jobRole,
            status: form.status || u.status,
            org: form.org || u.org,
          }
        : u,
    );
    return saveItUsers(next);
  }
  const id = Math.max(0, ...list.map((u) => Number(u.id) || 0)) + 1;
  const row = {
    id,
    name: form.name,
    email: form.email,
    phone: form.phone,
    affiliation: form.tenancy || "",
    jobRole: form.jobRole || "",
    org: form.org || "",
    joined: todayIso(),
    stopped: form.status === "غير نشط" ? todayIso() : "-",
    status: form.status || "نشط",
  };
  return saveItUsers([row, ...list]);
}

export function removeItUser(id) {
  return saveItUsers(loadItUsers().filter((u) => Number(u.id) !== Number(id)));
}

export function toggleItUserActive(id) {
  const next = loadItUsers().map((u) => {
    if (Number(u.id) !== Number(id)) return u;
    if (u.status === "نشط") {
      return { ...u, status: "غير نشط", stopped: todayIso() };
    }
    return { ...u, status: "نشط", stopped: "-" };
  });
  return saveItUsers(next);
}
