export default function SuccessModal({ open, message, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-page rounded-2xl px-16 py-12 flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
        <img
          src="/success-check.png"
          alt=""
          width={100}
          height={86}
          className="w-[100px] h-auto select-none"
          draggable={false}
        />
        <div className="text-navy-deep font-bold text-[20px] text-center">{message}</div>
      </div>
    </div>
  );
}
