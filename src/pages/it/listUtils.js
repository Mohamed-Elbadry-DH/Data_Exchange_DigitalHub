import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SORT_OPTIONS = ["الأحدث", "الأقدم"];

/**
 * Create-modal state that can also be opened by a `?create=1` link, so the
 * dashboard «إجراءات سريعة» menu can deep-link into a list page's create modal.
 */
export function useCreateModal() {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(params.get("create") === "1");

  const close = () => {
    setOpen(false);
    if (params.has("create")) {
      params.delete("create");
      setParams(params, { replace: true });
    }
  };

  return [open, () => setOpen(true), close];
}

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
