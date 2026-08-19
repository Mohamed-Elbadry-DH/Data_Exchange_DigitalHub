import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FormActions } from "./ItForm";

/**
 * Modal shell for the IT module's create dialogs.
 * Figma node 1049:911: 760px wide, radius 26.667, bg #e9ecef, 69px header
 * with a bottom border and the close control on the left.
 *
 * Portaled to document.body so AppShell / #root overflow cannot clip it.
 * Body must NOT use flex-1: overflow-y-auto on a flex-1 child collapses to 0
 * height when the card only has max-height (not a definite height).
 *
 * Pass `subtitle` for builder popups (Figma 645:842) — 588px, 111px header,
 * إلغاء left / إضافة right. `splitFooter` uses the same footer without a subtitle.
 */
export default function ItModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = "إنشاء",
  width = 760,
  splitFooter = false,
}) {
  if (!open) return null;
  const split = Boolean(subtitle) || splitFooter;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6" onClick={onClose}>
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#e9ecef] rounded-[26.667px] shadow-[0px_5.333px_5.333px_0px_rgba(0,0,0,0.25)] w-full max-h-[90vh] flex flex-col overflow-hidden"
        style={{ maxWidth: width }}
      >
        <div
          className={`shrink-0 border-b border-[rgba(5,44,101,0.16)] flex justify-between ${
            subtitle ? "min-h-[111px] items-start px-8 pt-5 pb-4" : "h-[69px] items-center px-10"
          }`}
        >
          <div className="text-right">
            <h3 className={`${subtitle ? "font-semibold" : "font-bold"} text-[24px] text-[#1f254b]`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-[20px] font-medium text-[#adb5bd] mt-2">{subtitle}</p>
            )}
          </div>
          <button onClick={onClose} className="text-[#1f254b] hover:text-primary shrink-0" aria-label="إغلاق">
            <X size={30} />
          </button>
        </div>

        <div className={`min-h-0 overflow-y-auto flex flex-col ${split ? "px-9 py-6 gap-[29px]" : "px-10 py-8 gap-9"}`}>
          {children}
        </div>

        <div className={`shrink-0 ${split ? "px-11 pb-8 pt-2" : "px-10 py-6"}`}>
          {split ? (
            <div className="flex items-center justify-between" dir="ltr">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#adb5bd] text-white text-[18px] font-medium rounded-[8px] h-[41px] w-[89px] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="bg-[#0986ed] text-white text-[18px] font-medium rounded-[8px] h-[41px] min-w-[175px] px-4 cursor-pointer"
              >
                {submitLabel}
              </button>
            </div>
          ) : (
            <FormActions onCancel={onClose} onSubmit={onSubmit} submitLabel={submitLabel} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
