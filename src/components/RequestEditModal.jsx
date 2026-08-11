import { useState } from "react";
import { X } from "lucide-react";

export default function RequestEditModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-[440px]"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-[#404040] hover:text-primary"><X size={20} /></button>
          <h3 className="text-primary font-bold text-[18px]">طلب تعديل</h3>
        </div>

        <div className="mb-6">
          <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">سبب طلب التعديل</div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="اكتب سبب طلب التعديل ..."
            className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right placeholder:text-gray-400 resize-none"
          />
        </div>

        <button
          onClick={() => { onSubmit?.(reason); setReason(""); }}
          disabled={!reason.trim()}
          className="bg-primary text-white rounded-lg px-6 py-2.5 text-[14px] font-medium disabled:opacity-40"
        >
          إرسال الطلب
        </button>
      </div>
    </div>
  );
}
