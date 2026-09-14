/**
 * Optional configuration panel for inferred label→value pairs.
 * Empty cells are already numeric-editable via Auto Input Policy —
 * this panel only applies type/override hints, it does not gate input.
 */
export default function FieldConfirmPanel({
  suggestions,
  selectedIds,
  onToggle,
  onConfirm,
  onClear,
}) {
  if (!suggestions?.length) {
    return (
      <div className="rounded-[12px] border border-[#d8d8d8] bg-white p-4 text-right" dir="rtl">
        <p className="text-[14px] text-[#adb5bd]">
          الخلايا الفارغة جاهزة للإدخال تلقائيًا. لم تُكتشف أزواج تسمية إضافية للتهيئة.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#d8d8d8] bg-white p-4 flex flex-col gap-3" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-[#052c65]">تهيئة الحقول (اختياري)</h3>
        <span className="text-[13px] text-[#adb5bd]">{suggestions.length} اقتراح</span>
      </div>
      <p className="text-[13px] text-[#7f8999]">
        الإدخال الرقمي متاح مباشرة في الخانات الفارغة. استخدم هذه القائمة فقط لتحسين نوع الحقل أو ربطه بتسمية.
      </p>
      <ul className="flex flex-col gap-2 max-h-[220px] overflow-auto">
        {suggestions.map((s) => {
          const checked = selectedIds.has(s.id);
          return (
            <li key={s.id}>
              <label className="flex items-center gap-3 rounded-[10px] border border-[#eaeaeb] px-3 py-2 cursor-pointer hover:border-[#0986ed]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(s.id)}
                  className="size-4 accent-[#0986ed]"
                />
                <span className="flex-1 text-[14px] font-semibold text-[#052c65] text-right">
                  {s.cellRef} → {s.label}
                </span>
                <span className="text-[12px] text-[#7f8999]">{s.type}</span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    s.confidence === "high" ? "bg-[#e8f5e9] text-[#16a34a]" : "bg-[#fff8e6] text-[#c89637]"
                  }`}
                >
                  {s.confidence === "high" ? "مرجح" : "محتمل"}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-2 justify-start" dir="ltr">
        <button
          type="button"
          onClick={onConfirm}
          disabled={selectedIds.size === 0}
          className="h-[40px] px-4 rounded-[10px] bg-[#0986ed] text-white text-[14px] font-semibold disabled:opacity-40 cursor-pointer"
        >
          تطبيق التهيئة
        </button>
        <button
          type="button"
          onClick={onClear}
          className="h-[40px] px-4 rounded-[10px] bg-[#e0e0e0] text-[#052c65] text-[14px] font-semibold cursor-pointer"
        >
          إعادة ضبط الإعداد
        </button>
      </div>
    </div>
  );
}
