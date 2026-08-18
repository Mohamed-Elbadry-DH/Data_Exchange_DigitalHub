import { X } from "lucide-react";
import { FormActions } from "./ItForm";

/**
 * Modal shell for the IT module's create dialogs.
 * Figma node 1049:911: 760px wide, radius 26.667, bg #e9ecef, 69px header
 * with a bottom border and the close control on the left.
 */
export default function ItModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "إنشاء",
  width = 760,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose}>
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#e9ecef] rounded-[26.667px] shadow-[0px_5.333px_5.333px_0px_rgba(0,0,0,0.25)] w-full max-h-[90vh] flex flex-col overflow-hidden"
        style={{ maxWidth: width }}
      >
        <div className="h-[69px] shrink-0 border-b border-[rgba(5,44,101,0.16)] flex items-center justify-between px-10">
          <h3 className="text-[24px] font-bold text-[#1f254b]">{title}</h3>
          <button onClick={onClose} className="text-[#1f254b] hover:text-primary" aria-label="إغلاق">
            <X size={30} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col gap-9">{children}</div>

        <div className="shrink-0 px-10 py-6">
          <FormActions onCancel={onClose} onSubmit={onSubmit} submitLabel={submitLabel} />
        </div>
      </div>
    </div>
  );
}
