/**
 * Status chips for مشرف الجهة الخارجية — Figma 1689:4626 list badges.
 */
const MAP = {
  "قيد الاعتماد النهائي": { bg: "rgba(37,99,235,0.12)", fg: "#2563EB" },
  "قيد الاعتماد": { bg: "rgba(37,99,235,0.12)", fg: "#2563EB" },
  "لم تبدأ بعد": { bg: "rgba(27,117,255,0.12)", fg: "#1B75FF" },
  "قيد المراجعة": { bg: "rgba(151,71,255,0.12)", fg: "#9747FF" },
  تعديل: { bg: "rgba(234,88,12,0.12)", fg: "#EA580C" },
  "مطلوب تعديل": { bg: "rgba(234,88,12,0.12)", fg: "#EA580C" },
  المتأخرة: { bg: "rgba(220,38,38,0.12)", fg: "#DC2626" },
  متأخر: { bg: "rgba(220,38,38,0.12)", fg: "#DC2626" },
  معتمد: { bg: "rgba(22,163,74,0.12)", fg: "#16A34A" },
  معتمدة: { bg: "rgba(22,163,74,0.12)", fg: "#16A34A" },
};

/** Icon-tile chrome for الحالة InfoTile — matches badge family */
export const STATUS_TILE = {
  "قيد الاعتماد النهائي": { bg: "rgba(37,99,235,0.3)", fg: "#2563EB" },
  "قيد الاعتماد": { bg: "rgba(37,99,235,0.3)", fg: "#2563EB" },
  "لم تبدأ بعد": { bg: "rgba(27,117,255,0.3)", fg: "#1B75FF" },
  "قيد المراجعة": { bg: "rgba(151,71,255,0.3)", fg: "#9747FF" },
  تعديل: { bg: "rgba(234,88,12,0.3)", fg: "#EA580C" },
  "مطلوب تعديل": { bg: "rgba(234,88,12,0.3)", fg: "#EA580C" },
  المتأخرة: { bg: "rgba(220,38,38,0.3)", fg: "#DC2626" },
  متأخر: { bg: "rgba(220,38,38,0.3)", fg: "#DC2626" },
  معتمد: { bg: "rgba(22,163,74,0.3)", fg: "#16A34A" },
  معتمدة: { bg: "rgba(22,163,74,0.3)", fg: "#16A34A" },
};

export function statusTileChrome(status) {
  return STATUS_TILE[status] || { bg: "rgba(9,134,237,0.3)", fg: "#0986ED" };
}

export default function StatusBadge({ status, size = "sm" }) {
  const s = MAP[status] || { bg: "#EEF2F9", fg: "#052C65" };
  const sizeClass =
    size === "lg"
      ? "text-[18px] font-bold px-4 py-1.5"
      : "text-[13px] font-semibold px-4 py-1.5";
  return (
    <span
      className={`inline-block rounded-lg whitespace-nowrap ${sizeClass}`}
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}
