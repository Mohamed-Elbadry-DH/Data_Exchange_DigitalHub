/**
 * Status chips for the external-entity module — Figma 1705:8613.
 * Module-local (like `ga/StatusBadge` and `it/StatusBadge`) because the shared
 * map in `data/mock.js` belongs to the frozen supervisor module.
 */
const MAP = {
  "لم تبدأ بعد": { bg: "#E3EEFF", fg: "#1B75FF" },
  "قيد التنفيذ": { bg: "#FFF7E0", fg: "#C89637" },
  "مطلوب تعديل": { bg: "#FFF1DE", fg: "#FF8C08" },
  "قيد المراجعة": { bg: "#F1E8FF", fg: "#9747FF" },
  "المتأخرة": { bg: "#FCE4E4", fg: "#DC2626" },
  متأخر: { bg: "#FCE4E4", fg: "#DC2626" },
  معتمد: { bg: "#DDF2E5", fg: "#16A34A" },
  معتمدة: { bg: "#DDF2E5", fg: "#16A34A" },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] || { bg: "#EEF2F9", fg: "#052C65" };
  return (
    <span
      className="inline-block rounded-lg px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}
