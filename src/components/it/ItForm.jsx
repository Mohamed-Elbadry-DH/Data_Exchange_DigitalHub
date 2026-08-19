import { useState } from "react";
import { ChevronDown, ChevronsUpDown, CalendarDays, SquareCheck, Square, Eye, EyeOff, Info } from "lucide-react";

/**
 * Form primitives for the IT module's create surfaces.
 * Sizing comes from the Figma create modals (node 1049:911): label 20px bold
 * #1f254b with a red asterisk, control 55px tall, radius 10, border
 * rgba(5,44,101,0.16), placeholder 18px at 30% opacity.
 */
export const CONTROL =
  "w-full h-[55px] rounded-[10px] border border-[rgba(5,44,101,0.16)] bg-white px-5 text-[18px] text-right text-[#1f254b] placeholder:text-[#1f254b]/30 outline-none focus:border-[#0986ed]";

/** Figma 631:9181 / 631:9243 — 55px field, radius 9.785, type comes from `.it-compact-control`. */
export const CONTROL_COMPACT =
  "it-compact-control w-full h-[55px] rounded-[9.785px] border border-[rgba(5,44,101,0.16)] bg-white px-5 text-right outline-none focus:border-[#0986ed]";

export function Field({ label, required, children, hint, hintIcon = false, compact = false }) {
  return (
    <div className={`flex flex-col w-full ${compact ? "gap-[22px]" : "gap-3"}`}>
      <label
        className={`${compact ? "text-[16.634px] leading-normal" : "text-[20px]"} font-bold text-[#1f254b] text-right`}
      >
        {label}
        {required && <span className={compact ? "text-[#dc2626]" : "text-danger"}> *</span>}
      </label>
      {children}
      {hint && hintIcon ? (
        <div className="flex items-center gap-[13px]" dir="rtl">
          <Info size={20} className="text-[#121212]/20 shrink-0" />
          <p className="text-[20px] text-[#121212]/20 text-right">{hint}</p>
        </div>
      ) : hint ? (
        <p className="text-[14px] text-[#1f254b]/50 text-right">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text", dir, className = "", compact = false }) {
  return (
    <input
      type={type}
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${compact ? CONTROL_COMPACT : CONTROL} ${className}`}
    />
  );
}

export function PhoneInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span dir="ltr" className="absolute left-5 top-1/2 -translate-y-1/2 text-[18px] font-bold text-[#121212] pointer-events-none">
        +20
      </span>
      <input
        type="tel"
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${CONTROL} pl-[72px]`}
      />
    </div>
  );
}

export function PasswordInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${CONTROL} pl-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1f254b]/50 cursor-pointer"
      >
        {visible ? <Eye size={25} /> : <EyeOff size={25} />}
      </button>
    </div>
  );
}

export function NumberInput({ value, onChange, placeholder = "0", className = "", compact = false }) {
  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        value={value}
        dir="ltr"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${compact ? CONTROL_COMPACT : CONTROL} pl-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className}`}
      />
      <ChevronsUpDown size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
    </div>
  );
}

export function DateInput({ value, onChange, placeholder = "mm/dd/yyyy", className = "", compact = false }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        dir="ltr"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${compact ? CONTROL_COMPACT : CONTROL} ${compact && !value ? "it-compact-empty" : ""} pl-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${className}`}
      />
      <CalendarDays size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
    </div>
  );
}

export function SelectInput({ value, onChange, options, placeholder = "اختر", className = "", emptyClassName = "text-[#1f254b]/30", compact = false }) {
  return (
    <div className="relative">
      <ChevronDown size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f254b] pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${compact ? CONTROL_COMPACT : CONTROL} appearance-none ${className} ${
          compact ? (value ? "" : "it-compact-empty") : (value ? "text-[#1f254b]" : emptyClassName)
        }`}
      >
        {placeholder != null && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o} className="text-[#1f254b]">{o}</option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({ value, onChange, placeholder, rows = 5, className = "", compact = false }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={
        compact
          ? `it-compact-control w-full rounded-[9.785px] border border-[rgba(5,44,101,0.16)] bg-white px-5 pt-[13px] pb-3 text-right outline-none focus:border-[#0986ed] resize-none ${className}`
          : `w-full rounded-[10px] border border-[rgba(5,44,101,0.16)] bg-white p-5 text-[18px] text-right text-[#1f254b] placeholder:text-[#1f254b]/30 outline-none focus:border-[#0986ed] resize-none ${className}`
      }
    />
  );
}

export function CheckboxGroup({ options, selected, onToggle, vertical = false, columns }) {
  const layout = vertical
    ? "flex flex-col items-start gap-4"
    : columns === 3
      ? "grid grid-cols-3 gap-x-[9px] gap-y-[15px]"
      : "flex flex-wrap gap-x-8 gap-y-4 justify-start";
  const compact = columns === 3;

  return (
    <div className={layout} dir="rtl">
      {options.map((o) => {
        const on = selected.includes(o);
        const Icon = on ? SquareCheck : Square;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={on}
            className={`flex items-center cursor-pointer transition-colors ${
              compact ? "gap-[9px] text-[18px] font-medium" : "gap-2.5 text-[20px]"
            } ${on ? "text-[#0986ed]" : "text-[#1f254b]/50"}`}
          >
            <Icon size={compact ? 24 : 25} className="shrink-0" />
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function FormSection({ title, icon: Icon, children, className = "", titleClassName = "" }) {
  const heading = titleClassName || "text-[22px] font-bold text-[#1f254b] text-right";
  return (
    <section className={`bg-white rounded-[20px] shadow-sm p-8 flex flex-col gap-8 ${className}`}>
      {Icon ? (
        <div className="flex items-center gap-2" dir="rtl">
          <Icon size={24} className="text-[#052c65]" />
          <h2 className={heading}>{title}</h2>
        </div>
      ) : (
        <h2 className={heading}>{title}</h2>
      )}
      {children}
    </section>
  );
}

export function FormActions({ onCancel, submitLabel = "إنشاء", onSubmit, className = "" }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
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
