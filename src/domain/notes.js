import { notesByRequestId } from "../data/mock";

/**
 * Notes are shared business data: a note written in one module must be visible
 * in every other module looking at the same request, so both the supervisor and
 * the general admin read and write this single key.
 */
const key = (requestId) => `mped-notes-${requestId}`;

export function loadNotes(requestId) {
  try {
    const raw = localStorage.getItem(key(requestId));
    if (raw !== null) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  return notesByRequestId[requestId] || notesByRequestId[String(requestId)] || [];
}

export function saveNotes(requestId, notes) {
  try {
    localStorage.setItem(key(requestId), JSON.stringify(notes));
  } catch {
    /* storage unavailable */
  }
}
