import { statusBadge } from "../data/mock";

export default function StatusBadge({ status }) {
  const s = statusBadge[status] || { bg: "#eee", fg: "#333" };
  return (
    <span
      className="inline-block rounded-lg px-4 py-1.5 text-[13px] font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}
