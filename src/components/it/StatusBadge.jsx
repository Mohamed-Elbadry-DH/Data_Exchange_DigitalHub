import { statusBadge } from "../../data/mockIt";

export default function StatusBadge({ status }) {
  const s = statusBadge[status] || { bg: "#eee", fg: "#333" };
  return (
    <span
      className="inline-flex items-center justify-center text-[13px] font-medium whitespace-nowrap px-4"
      style={{
        minWidth: 144,
        height: 31,
        borderRadius: 15,
        background: s.bg,
        color: s.fg,
      }}
    >
      {status}
    </span>
  );
}
