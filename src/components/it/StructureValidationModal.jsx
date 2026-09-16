import { createPortal } from "react-dom";
import { X, TriangleAlert } from "lucide-react";

/**
 * «لم يتم استكمال بناء الهيكل» — blocks step 2 → 3 until every structure
 * requirement is met (Figma 916:4407).
 */
export default function StructureValidationModal({ open, onClose, rows, percent }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay z-[100]" onClick={onClose}>
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#e9ecef] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-[560px] max-h-[90vh] overflow-y-auto relative px-8 sm:px-12 py-6"
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-[#1f254b] hover:text-primary"
          aria-label="إغلاق"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center gap-4">
          <span className="size-16 rounded-full bg-[rgba(255,193,7,0.18)] flex items-center justify-center">
            <TriangleAlert size={36} className="text-[#FFC107]" strokeWidth={2} />
          </span>

          <h3 className="text-[18px] font-semibold text-[#052c65] text-center">
            لم يتم استكمال بناء الهيكل
          </h3>
          <p className="text-[14px] text-[rgba(5,44,101,0.49)] text-center">
            لا يمكن المتابعة إلى الخطوة التالية قبل استكمال جميع متطلبات الهيكل.
          </p>

          <div className="w-full overflow-hidden rounded-[12px] border border-[rgba(18,36,67,0.1)]">
            <table className="w-full border-collapse text-right">
              <thead>
                <tr className="bg-[#f0f0f0] text-[#1f254b] text-[14px]">
                  <th className="py-2.5 px-3 font-semibold">العنصر</th>
                  <th className="py-2.5 px-3 font-semibold">المطلوب</th>
                  <th className="py-2.5 px-3 font-semibold">الحالى</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const met = r.current >= r.required;
                  return (
                    <tr key={r.label} className="border-t border-[rgba(18,36,67,0.1)] text-[14px]">
                      <td className="py-3 px-3 text-[#052c65]/60">{r.label}</td>
                      <td className="py-3 px-3 text-[#052c65]">{r.required}</td>
                      <td
                        className="py-3 px-3 font-semibold"
                        style={{ color: met ? "#16A34A" : "#DC2626" }}
                      >
                        {r.current}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="w-full">
            <div className="text-[14px] font-semibold text-[#1f254b] mb-2">نسبة اكتمال الهيكل</div>
            <div className="flex items-center gap-4">
              <span className="bg-[rgba(255,193,7,0.15)] rounded-[10px] h-7 px-3 flex items-center text-[14px] text-[#052c65] shrink-0">
                {percent} %
              </span>
              <span className="flex-1 h-[7px] bg-white rounded-[10px] overflow-hidden">
                <span
                  className="block h-full bg-[#ffc107] rounded-[10px] transition-[width]"
                  style={{ width: `${percent}%` }}
                />
              </span>
            </div>
          </div>

          <div className="w-full flex items-center justify-between pt-2 gap-3">
            <button
              onClick={onClose}
              className="bg-[#adb5bd] text-white text-[15px] font-semibold rounded-[8px] h-[41px] min-w-[89px] px-4 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={onClose}
              className="bg-[#0986ed] text-white text-[15px] font-semibold rounded-[8px] h-[41px] min-w-[160px] px-5 cursor-pointer"
            >
              إستكمال البناء
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
