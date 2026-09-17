import { statusBadge } from "../../data/mockGa";

/** List/detail status chip — Figma 1094:847 (191×31, radius 9.85). */
export default function StatusBadge({ status, label }) {
  const text = label || status;
  const s = statusBadge[status] || statusBadge[text] || { bg: "#eee", fg: "#333" };
  return (
    <span
      className="inline-flex items-center justify-center text-[15px] sm:text-[16px] font-medium whitespace-nowrap tracking-[0.17px]"
      style={{
        width: 191,
        height: 31,
        borderRadius: 9.85,
        background: s.bg,
        color: s.fg,
      }}
    >
      {text}
    </span>
  );
}
