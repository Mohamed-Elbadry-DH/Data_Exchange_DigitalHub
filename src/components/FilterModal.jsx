import { X, ChevronDown, CalendarDays } from "lucide-react";

function Field({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">{label}</div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right text-muted appearance-none"
      >
        <option value="">الكل</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function FilterModal({
  open,
  onClose,
  onClear,
  dateLabel = "تاريخ الإنشاء",
  dateValue = "",
  onDateChange = () => {},
  statusOptions = [],
  statusValue = "",
  onStatusChange = () => {},
  secondField,
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-[400px]"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-[#404040] hover:text-primary"><X size={20} /></button>
          <h3 className="text-primary font-bold text-[18px]">تصفية</h3>
        </div>

        <Field label="الحالة">
          <Select value={statusValue} onChange={onStatusChange} options={statusOptions} />
        </Field>

        {secondField && (
          <Field label={secondField.label}>
            <Select value={secondField.value} onChange={secondField.onChange} options={secondField.options} />
          </Field>
        )}

        <Field label={dateLabel}>
          <div className="relative">
            <CalendarDays size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="date"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2.5 pr-10 pl-3 text-[14px] text-right placeholder:text-gray-400"
            />
          </div>
        </Field>

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
