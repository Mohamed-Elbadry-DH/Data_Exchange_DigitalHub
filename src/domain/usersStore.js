import { usersRows as seedUsers } from "../data/mock";

/**
 * Shared module-admin users list (supervisor + GA).
 * Additive domain store — mock seed until first write, then localStorage.
 */
const STORAGE_KEY = "mped-users-v1";

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

/** Current users list (persisted or seed). */
export function loadUsers() {
  return readStored() ?? seedUsers.map((u) => ({ ...u }));
}

/** Replace entire list and persist. */
export function saveUsers(users) {
  writeStored(users);
  return users;
}

export function upsertUser(form, editingId = null) {
  const list = loadUsers();
  if (editingId != null) {
    const next = list.map((u) => (u.id === editingId ? { ...u, ...form } : u));
    return saveUsers(next);
  }
  const id = Math.max(0, ...list.map((u) => Number(u.id) || 0)) + 1;
  const row = {
    id,
    ...form,
    joined: todayIso(),
    stopped: "-",
    status: "نشط",
  };
  return saveUsers([row, ...list]);
}

export function removeUser(id) {
  return saveUsers(loadUsers().filter((u) => u.id !== id));
}

export function toggleUserActive(id) {
  const next = loadUsers().map((u) => {
    if (u.id !== id) return u;
    if (u.status === "نشط") {
      return { ...u, status: "غير نشط", stopped: todayIso() };
    }
    return { ...u, status: "نشط", stopped: "-" };
  });
  return saveUsers(next);
}
