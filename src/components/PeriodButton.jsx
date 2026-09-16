import { useEffect, useId, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export const PERIOD_OPTIONS = [
  "النصف الأول من عام 2026",
  "النصف الثاني من عام 2025",
  "الربع الأول من عام 2026",
  "الربع الثاني من عام 2026",
  "عام 2025",
];

/**
 * Period selector — Figma `649:10625` (340×56). RTL order: calendar badge on
 * the right, label, then the chevron on the left. Dropdown keeps the same chrome.
 */
export default function PeriodButton({
  label: initialLabel = PERIOD_OPTIONS[0],
  options = PERIOD_OPTIONS,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(initialLabel);
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    setLabel(initialLabel);
  }, [initialLabel]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (value) => {
    setLabel(value);
    setOpen(false);
    onChange?.(value);
  };

  return (
    <div ref={rootRef} className="relative w-[340px] max-w-full min-w-0">
      <button
        type="button"
        dir="rtl"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[56px] w-full items-center gap-3 rounded-[12px] bg-white ps-4 pe-4 sm:ps-[26px] sm:pe-[26px] shadow-sm cursor-pointer"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(9,134,237,0.15)]">
          <Calendar size={24} className="text-primary" />
        </span>
        <span className="flex-1 min-w-0 truncate text-[16px] sm:text-[18px] text-[#404040] text-right">{label}</span>
        <ChevronDown
          size={24}
          className={`shrink-0 text-[#404040] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          dir="rtl"
          className="absolute top-[calc(100%+8px)] inset-inline-0 z-50 max-h-64 overflow-auto rounded-[12px] bg-white py-2 shadow-lg border border-[#D8D8D8]"
        >
          {options.map((opt) => {
            const selected = opt === label;
            return (
              <li key={opt} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => select(opt)}
                  className={`w-full text-right px-4 py-2.5 text-[15px] transition-colors ${
                    selected
                      ? "bg-[rgba(9,134,237,0.09)] text-[#052C65] font-semibold"
                      : "text-[#404040] hover:bg-page"
                  }`}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
