/**
 * مؤشرات عامة card — 335×161 per Figma (GA `895:2509`, DM `649:10179`).
 * Sibling of `StatusCard`; same `{ item, icons }` shape.
 */
export default function KpiCard({ k, icons, fluid = false }) {
  if (!k) return null;
  const Icon = icons?.[k.icon];
  return (
    <div
      className={`card-hover bg-white rounded-2xl p-4 min-w-0 shadow-sm ${
        fluid ? "w-full" : "w-[335px] shrink-0"
      }`}
    >
      <div className="flex items-start justify-end gap-3 text-right">
        <div
          className="w-[60px] h-[60px] rounded-[15px] flex items-center justify-center shrink-0"
          style={{ background: k.dark ? "#F8F9FA" : k.color }}
        >
          {Icon ? <Icon size={26} className={k.dark ? "text-[#c89637]" : "text-white"} /> : null}
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-[32px] font-bold leading-none text-[rgba(0,0,0,0.9)] text-right">{k.value}</div>
          <div className="text-[18px] text-[#404040] mt-3 text-right">{k.label}</div>
          <div className={`text-[14px] mt-2 text-right ${k.up ? "text-success" : "text-danger"}`}>
            {k.delta} عن الربع السابق
          </div>
        </div>
      </div>
    </div>
  );
}
