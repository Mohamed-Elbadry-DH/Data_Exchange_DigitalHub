export const SORT_OPTIONS = ["الأحدث", "الأقدم"];

export function ddmmyyyyToIso(s) {
  const raw = String(s || "");
  if (raw.includes("-")) return raw.split(" ")[0];
  const [d, m, y] = raw.split("/");
  return d && m && y ? `${y}-${m}-${d}` : "";
}

export function sortRows(rows, sort, dateKey) {
  const sorted = [...rows].sort((a, b) => ddmmyyyyToIso(a[dateKey]).localeCompare(ddmmyyyyToIso(b[dateKey])));
  return sort === "الأقدم" ? sorted : sorted.reverse();
}
