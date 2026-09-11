import { TriangleAlert } from "lucide-react";

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay z-50" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-[380px] flex flex-col items-center gap-5"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <TriangleAlert size={48} className="text-danger" strokeWidth={1.5} />
        <div className="text-[15px] font-semibold text-[rgba(0,0,0,0.9)] text-center">{message}</div>
        <div className="flex gap-3 w-full">
          <button onClick={onConfirm} className="flex-1 bg-danger text-white rounded-lg py-2.5 text-[14px] font-medium">
            تأكيد
          </button>
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-[#404040] rounded-lg py-2.5 text-[14px] font-medium">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
