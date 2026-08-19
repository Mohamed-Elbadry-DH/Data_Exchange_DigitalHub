import { useEffect, useState } from "react";
import { X, ChevronDown, CalendarDays, Search } from "lucide-react";

/**
 * Generic filter modal for the IT module (Figma 1057:2271 / 1060:5077).
 * `type: "searchable"` adds a search icon (اسم الإدارة).
 */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[17px] items-end w-full">
      <div className="text-[15px] font-bold text-[#1f254b] text-right">{label}</div>
      {children}
    </div>
  );
}

const controlClass =
  "w-full h-[55px] border-[0.978px] border-[rgba(5,44,101,0.16)] rounded-[15px] text-[15px] font-semibold text-right outline-none focus:border-primary bg-white";

function SearchableSelect({ value, onChange, options = [], placeholder = "الكل" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const filtered = options.filter((o) => !q.trim() || o.includes(q.trim()));
  const shown = open ? q : value;

  return (
    <div className="relative w-full">
      <Search size={18} className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
      <ChevronDown size={20} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
      <input
        value={shown}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className={`${controlClass} pr-10 pl-10 ${shown ? "text-[#1f254b]" : "text-[#1f254b]/40"}`}
      />
      {open && (
        <ul className="absolute z-20 top-full mt-1 right-0 left-0 max-h-48 overflow-y-auto bg-white rounded-[12px] border border-[rgba(5,44,101,0.16)] shadow-sm text-right">
          <li>
            <button
              type="button"
              className="w-full px-4 py-2.5 text-[14px] text-[#1f254b]/50 hover:bg-page cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(""); setOpen(false); }}
            >
              {placeholder}
            </button>
          </li>
          {filtered.map((o) => (
            <li key={o}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-[14px] text-[#1f254b] hover:bg-page cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(o); setOpen(false); }}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ItFilterModal({ open, onClose, onClear, fields = [] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-[20px] pt-5 px-7 pb-5 w-[400px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary font-bold text-[18px]">تصفية</h3>
          <button onClick={onClose} className="text-[#404040] hover:text-primary cursor-pointer" aria-label="إغلاق">
            <X size={30} />
          </button>
        </div>

        <div className="flex flex-col gap-[14px] items-stretch">
          {fields.map((f) => (
            <Field key={f.label} label={f.label}>
              {f.type === "date" ? (
                <div className="relative w-full">
                  <CalendarDays size={20} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
                  <input
                    type="date"
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    className={`${controlClass} pr-4 pl-10 ${f.value ? "text-[#1f254b]" : "text-[#1f254b]/40"} [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-[14px] [&::-webkit-calendar-picker-indicator]:opacity-0`}
                  />
                </div>
              ) : f.type === "searchable" ? (
                <SearchableSelect
                  value={f.value}
                  onChange={f.onChange}
                  options={f.options}
                  placeholder={f.placeholder || "الكل"}
                />
              ) : (
                <div className="relative w-full">
                  <ChevronDown size={20} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
                  <select
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    className={`${controlClass} appearance-none pr-[19px] pl-10 ${f.value ? "text-[#1f254b]" : "text-[#1f254b]/40"}`}
                  >
                    <option value="">{f.placeholder || "الكل"}</option>
                    {(f.options || []).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              )}
            </Field>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClear}
            className="bg-primary text-white rounded-[10px] w-[123px] h-[38px] text-[16px] font-semibold cursor-pointer"
          >
            مسح الكل
          </button>
        </div>
      </div>
    </div>
  );
}
