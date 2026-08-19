import { Calendar, ChevronDown } from "lucide-react";

/**
 * Period selector — Figma `649:10625` (340×56). RTL order: calendar badge on
 * the right, label, then the chevron on the left.
 */
export default function PeriodButton({ label = "النصف الأول من عام 2026" }) {
  return (
    <button
      type="button"
      dir="rtl"
      className="flex h-[56px] w-[340px] max-w-full min-w-0 items-center gap-3 rounded-[12px] bg-white ps-4 pe-4 sm:ps-[26px] sm:pe-[26px] shadow-sm cursor-pointer"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(9,134,237,0.15)]">
        <Calendar size={24} className="text-primary" />
      </span>
      <span className="flex-1 min-w-0 truncate text-[16px] sm:text-[18px] text-[#404040] text-right">{label}</span>
      <ChevronDown size={24} className="shrink-0 text-[#404040]" />
    </button>
  );
}
