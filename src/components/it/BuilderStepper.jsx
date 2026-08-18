import { Check } from "lucide-react";
import { FORM_WIZARD_STEPS } from "../../domain/workflow";

/**
 * Three-step wizard header (Figma 282:185). Rendered RTL so step 1 sits on the
 * right; the active card gets the rgba(52,152,219,0.22) wash from the design.
 */
export default function BuilderStepper({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap" dir="rtl">
      {FORM_WIZARD_STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className="h-[92px] rounded-[17.61px] flex items-center gap-4 px-5 min-w-[280px]"
              style={{ background: active ? "rgba(52,152,219,0.22)" : "transparent" }}
            >
              <span
                className="w-[66px] h-[66px] rounded-full flex items-center justify-center shrink-0 text-[32px] font-bold text-white"
                style={{
                  background: done ? "#16A34A" : active ? "#0986ED" : "#ADB5BD",
                  boxShadow: active ? "0 0 0 6px rgba(9,134,237,0.18)" : "none",
                }}
              >
                {done ? <Check size={30} strokeWidth={3} /> : i + 1}
              </span>
              <span className="text-right min-w-0">
                <span
                  className="block text-[17.6px] font-semibold leading-tight"
                  style={{ color: active ? "#0986ED" : "#1f254b" }}
                >
                  {s.title}
                </span>
                <span className="block text-[16px] text-[#adb5bd] mt-0.5">{s.subtitle}</span>
              </span>
            </div>
            {i !== FORM_WIZARD_STEPS.length - 1 && (
              <span
                className="h-0.5 w-[80px] xl:w-[150px] shrink-0 rounded"
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
