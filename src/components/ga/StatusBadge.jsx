import { statusBadge } from "../../data/mockGa";

export default function StatusBadge({ status }) {
  const s = statusBadge[status] || { bg: "#eee", fg: "#333" };
  return (
    <span
      className="inline-flex items-center justify-center text-[13px] font-medium whitespace-nowrap"
      style={{
        width: 191,
        height: 31,
        borderRadius: 9.85,
        background: s.bg,
        color: s.fg,
      }}
    >
      {status}
    </span>
  );
}
