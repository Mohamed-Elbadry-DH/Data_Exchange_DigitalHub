import { FORM_WIZARD_STEPS } from "../../domain/workflow";

/**
 * Three-step wizard header (Figma 282:185), scaled to IT peer chrome
 * (sidebar ~15px / list actions ~16px) so it doesn’t dwarf list pages.
 */
export default function BuilderStepper({ current }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap" dir="rtl">
      {FORM_WIZARD_STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="h-[64px] sm:h-[72px] rounded-[12px] flex items-center gap-3 px-3 sm:px-4 min-w-0 sm:min-w-[220px] max-w-[280px]"
              style={{ background: active ? "rgba(52,152,219,0.22)" : "transparent" }}
            >
              {done ? (
                <img src="/it/stepper-done.svg" alt="" className="size-10 shrink-0 object-contain" />
              ) : (
                <span
                  className="size-10 rounded-full flex items-center justify-center shrink-0 text-[18px] font-bold text-white"
                  style={{
                    background: active ? "#0986ED" : "#ADB5BD",
                    boxShadow: active ? "0 0 0 4px rgba(9,134,237,0.18)" : "none",
                  }}
                >
                  {i + 1}
                </span>
              )}
              <span className="text-right min-w-0">
                <span
                  className="block text-[13px] sm:text-[14px] font-semibold leading-snug"
                  style={{ color: active ? "#0986ED" : "#1f254b" }}
                >
                  {s.title}
                </span>
                <span className="block text-[12px] text-[#adb5bd] mt-0.5 leading-snug">{s.subtitle}</span>
              </span>
            </div>
            {i !== FORM_WIZARD_STEPS.length - 1 && (
              <span
                className="h-0.5 w-8 sm:w-12 xl:w-16 shrink-0 rounded"
                style={{ background: done ? "#16A34A" : "#DEE2E6" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
