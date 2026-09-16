import { createPortal } from "react-dom";
import { X, TriangleAlert } from "lucide-react";

/**
 * لم يتم استكمال البيانات — Figma 914:3960.
 * Blocks submission until every required cell is filled.
 */
export default function DataIncompleteModal({ open, onClose, onContinue, required = 0, current = 0 }) {
  if (!open) return null;
  const pct = required > 0 ? Math.round((current / required) * 100) : 0;

  return createPortal(
    <div className="modal-overlay z-[100]" onClick={onClose}>
      <div
        className="bg-page rounded-[20px] w-[560px] max-w-[92vw] px-10 pt-5 pb-8"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="text-[#1f254b] hover:text-primary cursor-pointer"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="w-[86px] h-[86px] rounded-full bg-[rgba(255,193,7,0.16)] flex items-center justify-center">
            <TriangleAlert size={44} className="text-[#FFC107]" strokeWidth={2} />
          </span>
          <h3 className="text-[22px] font-bold text-[#052c65]">لم يتم استكمال البيانات</h3>
          <p className="text-[15px] text-muted -mt-2">لا يمكن الإرسال دون استكمال البيانات</p>
        </div>

        <div className="mt-6 border border-[#d8d8d8] rounded-[14px] overflow-hidden bg-white">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="bg-[#f7f9fb] text-[#052c65]">
                <th className="py-3 px-5 text-right font-semibold">العنصر</th>
                <th className="py-3 px-5 text-center font-semibold">المطلوب</th>
                <th className="py-3 px-5 text-center font-semibold">الحالى</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#d8d8d8]">
                <td className="py-3 px-5 text-right text-[#052c65]/70">عدد البيانات</td>
                <td className="py-3 px-5 text-center text-[#052c65]">{required}</td>
                <td className="py-3 px-5 text-center text-danger font-semibold">{current}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="text-[15px] font-semibold text-[#052c65] text-right mb-2">نسبة الاكتمال</div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[#C89637] bg-[rgba(255,193,7,0.16)] rounded-[8px] px-3 py-1 shrink-0">
              {pct} %
            </span>
            <div className="flex-1 h-[10px] rounded-full bg-[#e9ecef] overflow-hidden">
              <div className="h-full rounded-full bg-[#FFC107]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={onContinue}
            className="bg-primary text-white rounded-[10px] h-[44px] w-[190px] text-[17px] font-semibold cursor-pointer"
          >
            استكمال
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#adb5bd] text-white rounded-[10px] h-[44px] w-[110px] text-[17px] font-semibold cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
