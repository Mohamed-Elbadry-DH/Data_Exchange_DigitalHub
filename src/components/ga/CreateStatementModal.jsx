import { useEffect, useState } from "react";
import { X } from "lucide-react";
import CreateStatementForm, {
  DiscardWarning,
  emptyCreateForm,
} from "./CreateStatementForm";

const GAP = 5;

/**
 * Legacy sheet overlay — kept for reuse; Dashboard CTA now uses `/ga/forms/new`.
 */
export default function CreateStatementModal({ open, onClose, onSubmit, anchorRef, containerRef }) {
  const [form, setForm] = useState(emptyCreateForm);
  const [confirmClose, setConfirmClose] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [box, setBox] = useState({ left: GAP, right: GAP, top: GAP, bottom: GAP });

  useEffect(() => {
    if (open) {
      setForm(emptyCreateForm);
      setConfirmClose(false);
      setUploadName("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const measure = () => {
      const container = containerRef?.current;
      const anchor = anchorRef?.current;
      if (!container) return;
      const c = container.getBoundingClientRect();
      const a = anchor?.getBoundingClientRect();
      const right = a
        ? Math.max(GAP, Math.round(c.right - a.left + GAP))
        : GAP;
      const leftEdge = GAP;
      const available = Math.max(0, c.width - leftEdge - right);
      const width = Math.round(available * 0.8);
      const left = leftEdge + Math.max(0, available - width);
      if (c.width - left - right < 480) {
        setBox({ left: GAP, right: GAP, top: GAP, bottom: GAP });
        return;
      }
      setBox({ left, right, top: GAP, bottom: GAP });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, anchorRef, containerRef]);

  if (!open) return null;

  const requestClose = () => setConfirmClose(true);
  const confirmDiscard = () => {
    setConfirmClose(false);
    onClose?.();
  };

  return (
    <>
      <div className="absolute inset-0 z-50 bg-black/40" onClick={requestClose}>
        <div
          className="absolute overflow-auto"
          style={{
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
            background: "#E9ECEF",
            borderRadius: "26.67px",
            boxShadow: "0px 5.33px 5.33px 0px #00000040",
          }}
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[22px] font-bold text-[#052C65]">طلب إنشاء نموذج البيان</h3>
              <button
                type="button"
                onClick={requestClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#404040] hover:bg-black/5 cursor-pointer"
                aria-label="إغلاق"
              >
                <X size={22} />
              </button>
            </div>

            <CreateStatementForm
              form={form}
              onChange={setForm}
              uploadName={uploadName}
              onUpload={() =>
                setUploadName(`مرفق_${form.title || "طلب"}_${Date.now().toString().slice(-4)}.xlsx`)
              }
              onSubmit={() => onSubmit?.({ ...form, uploadName })}
              onCancel={requestClose}
            />
          </div>
        </div>
      </div>

      <DiscardWarning
        open={confirmClose}
        onConfirm={confirmDiscard}
        onCancel={() => setConfirmClose(false)}
      />
    </>
  );
}
