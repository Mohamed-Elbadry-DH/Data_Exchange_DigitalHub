import { X, ChevronDown, CalendarDays } from "lucide-react";

/**
 * Generic filter modal for the IT module. The shared FilterModal is fixed to
 * status + one extra select + a date; these screens vary the fields per list
 * and add a «ترتيب حسب» sort control.
 */
function Field({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">{label}</div>
      {children}
    </div>
  );
}

export default function ItFilterModal({ open, onClose, onClear, fields = [] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-[400px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-[#404040] hover:text-primary" aria-label="إغلاق"><X size={20} /></button>
          <h3 className="text-primary font-bold text-[18px]">تصفية</h3>
        </div>

        {fields.map((f) => (
          <Field key={f.label} label={f.label}>
            {f.type === "date" ? (
              <div className="relative">
                <CalendarDays size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="date"
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg py-2.5 pr-10 pl-3 text-[14px] text-right"
                />
              </div>
            ) : (
              <div className="relative">
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <select
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right text-muted appearance-none"
                >
                  <option value="">{f.placeholder || "الكل"}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            )}
          </Field>
        ))}

        <button
          onClick={onClear}
          className="bg-primary text-white rounded-lg px-6 py-2.5 text-[14px] font-medium"
        >
          مسح الكل
        </button>
      </div>
    </div>
  );
}
