import { Calendar, ChevronDown } from "lucide-react";
import { SHELL } from "../constants/shell";

export default function PeriodButton({ label = "النصف الأول من عام 2026" }) {
  return (
    <button
      type="button"
      style={{ height: SHELL.navItemH }}
      className="flex shrink-0 items-center gap-2 rounded-[12px] bg-white px-4 text-[14px] text-[#404040] shadow-sm"
    >
      <Calendar size={16} className="text-primary" />
      {label}
      <ChevronDown size={14} />
    </button>
  );
}
