export default function SuccessModal({ open, message, subtitle, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay z-50" onClick={onClose}>
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
        {subtitle && (
          <p className="text-[15px] text-muted text-center max-w-[360px] -mt-2 leading-7">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
