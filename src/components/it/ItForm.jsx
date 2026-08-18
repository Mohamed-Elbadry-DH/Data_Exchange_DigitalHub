import { ChevronDown, SquareCheck, Square } from "lucide-react";

/**
 * Form primitives for the IT module's create surfaces.
 * Sizing comes from the Figma create modals (node 1049:911): label 20px bold
 * #1f254b with a red asterisk, control 55px tall, radius 10, border
 * rgba(5,44,101,0.16), placeholder 18px at 30% opacity.
 */
const CONTROL =
  "w-full h-[55px] rounded-[10px] border border-[rgba(5,44,101,0.16)] bg-white px-5 text-[18px] text-right text-[#1f254b] placeholder:text-[#1f254b]/30 outline-none focus:border-[#0986ed]";

export function Field({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-[20px] font-bold text-[#1f254b] text-right">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {hint && <p className="text-[14px] text-[#1f254b]/50 text-right">{hint}</p>}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text", dir }) {
  return (
    <input
      type={type}
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={CONTROL}
    />
  );
}

export function SelectInput({ value, onChange, options, placeholder = "اختر" }) {
  return (
    <div className="relative">
      <ChevronDown size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1f254b]/50 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${CONTROL} appearance-none ${value ? "" : "text-[#1f254b]/30"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-[#1f254b]">{o}</option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[10px] border border-[rgba(5,44,101,0.16)] bg-white p-5 text-[18px] text-right text-[#1f254b] placeholder:text-[#1f254b]/30 outline-none focus:border-[#0986ed] resize-none"
    />
  );
}

export function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 justify-end" dir="rtl">
      {options.map((o) => {
        const on = selected.includes(o);
        const Icon = on ? SquareCheck : Square;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={on}
            className={`flex items-center gap-2.5 text-[20px] cursor-pointer transition-colors ${
              on ? "text-[#0986ed]" : "text-[#1f254b]/50"
            }`}
          >
            <Icon size={25} />
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function FormSection({ title, children }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-8 flex flex-col gap-8">
      <h2 className="text-[22px] font-bold text-[#1f254b] text-right">{title}</h2>
      {children}
    </section>
  );
}

export function FormActions({ onCancel, submitLabel = "إنشاء", onSubmit }) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onCancel}
        className="bg-[#adb5bd] text-white text-[20px] font-semibold rounded-[8px] h-[41px] w-[142px] cursor-pointer"
      >
        إلغاء
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="bg-[#0986ed] text-white text-[20px] font-semibold rounded-[8px] h-[41px] w-[142px] cursor-pointer"
      >
        {submitLabel}
      </button>
    </div>
  );
}
