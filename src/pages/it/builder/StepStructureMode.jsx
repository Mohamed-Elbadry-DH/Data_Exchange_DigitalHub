/**
 * Step 2 entry — choose Excel upload vs manual table (Figma 2244:1579).
 * Type/icon sizes aligned to IT list/detail chrome (not raw 1920 Figma px).
 */
export default function StepStructureMode({ onChooseManual, onChooseExcel, excelFileName }) {
  return (
    <div className="flex flex-col items-center gap-8 py-4" dir="rtl">
      <h2 className="text-[18px] font-bold text-[#052c65] text-center w-full">
        اختر الطريقة المناسبة
      </h2>

      <div className="flex flex-col lg:flex-row-reverse items-stretch justify-center gap-6 xl:gap-12 w-full max-w-[1100px]">
        <ModeCard
          tone="excel"
          iconSrc="/it/icon-mode-xls.svg"
          iconBg="/it/icon-mode-xls-bg.svg"
          leafW={32}
          leafH={44}
          title="رفع الملف"
          description="قم برفع ملف Excel يحتوي على البيانات"
          actionLabel="رفع الملف"
          onAction={onChooseExcel}
          footnote={excelFileName ? `تم اختيار: ${excelFileName}` : null}
        />
        <ModeCard
          tone="manual"
          iconSrc="/it/icon-mode-table.svg"
          leafW={72}
          leafH={72}
          title="إدخال البيانات يدويًا"
          description="قم بإنشاء الجدول وإدخال البيانات مباشرة"
          actionLabel="إنشاء جدول"
          onAction={onChooseManual}
        />
      </div>
    </div>
  );
}

function ModeCard({
  tone,
  iconSrc,
  iconBg,
  leafW,
  leafH,
  title,
  description,
  actionLabel,
  onAction,
  footnote,
}) {
  const shell =
    tone === "excel"
      ? "bg-[#f1f7f4] border-[#c7e3d3]"
      : "bg-[#f1f6fc] border-[#c3d9ef]";

  return (
    <div
      className={`w-full max-w-[420px] min-h-[260px] rounded-[16px] border border-solid ${shell} flex flex-col items-center px-5 pt-7 pb-6`}
    >
      <div className="relative size-[72px] shrink-0 flex items-center justify-center">
        {iconBg && (
          <img
            src={iconBg}
            alt=""
            className="absolute inset-0 size-[72px] object-contain"
            width={72}
            height={72}
          />
        )}
        <img
          src={iconSrc}
          alt=""
          className="relative object-contain"
          width={leafW}
          height={leafH}
          style={{ width: leafW, height: leafH }}
        />
      </div>

      <div className="mt-5 flex flex-col items-center gap-3 text-center max-w-[280px] shrink-0">
        <h3 className="text-[18px] font-bold text-[#052c65] leading-tight">{title}</h3>
        <p className="text-[14px] font-medium text-[#adb5bd] leading-snug">{description}</p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="mt-auto w-full max-w-[320px] h-[46px] shrink-0 flex items-center justify-center bg-[#052c65] text-white text-[16px] font-semibold rounded-[10px] cursor-pointer"
      >
        {actionLabel}
      </button>

      {footnote && (
        <p className="mt-2 text-[13px] font-medium text-[#16a34a] text-center truncate max-w-full shrink-0">
          {footnote}
        </p>
      )}
    </div>
  );
}
