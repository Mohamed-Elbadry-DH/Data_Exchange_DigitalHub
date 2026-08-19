import { useState } from "react";
import { CHART_TYPES, CHART_TYPE_ICONS, CHART_TYPE_LABELS } from "./constants";

export default function ChartCard({ title, defaultType = "pie", height = 345, children }) {
  const defaultIndex = Math.max(0, CHART_TYPES.indexOf(defaultType));
  const [activeChart, setActiveChart] = useState(defaultIndex);
  const type = CHART_TYPES[activeChart] || CHART_TYPES[0];

  return (
    <div className="bg-white shadow-sm overflow-hidden min-w-0 flex-1 h-full min-h-0" style={{ height, borderRadius: 20 }}>
      <div className="flex h-full min-h-0 flex-col p-5">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h3 className="text-[17px] font-bold text-[rgba(0,0,0,0.9)]">{title}</h3>
          <div
            dir="ltr"
            className="inline-flex h-[39px] items-center justify-center gap-2 rounded-lg"
            style={{ width: 217, background: "rgba(240, 240, 240, 0.53)", padding: "6px 15px" }}
          >
            {CHART_TYPE_ICONS.map((Icon, i) => {
              const isActive = activeChart === i;
              return (
                <button
                  key={CHART_TYPES[i]}
                  type="button"
                  onClick={() => setActiveChart(i)}
                  aria-label={CHART_TYPE_LABELS[i]}
                  aria-pressed={isActive}
                  title={CHART_TYPE_LABELS[i]}
                  className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded transition-colors"
                  style={
                    isActive
                      ? { background: "rgba(9, 134, 237, 0.09)", color: "#0986ED" }
                      : { background: "transparent", color: "#052C65" }
                  }
                >
                  <Icon size={19} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden">
          {typeof children === "function" ? children(type) : children}
        </div>
      </div>
    </div>
  );
}
