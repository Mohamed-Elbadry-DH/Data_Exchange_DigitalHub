import { MoveLeft } from "lucide-react";

/**
 * التنبيهات card. `onViewAll` is optional — without it the footer link still
 * renders (per Figma) but does not navigate.
 */
export default function AlertsCard({ alerts = [], onViewAll }) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm p-5 flex flex-col flex-1 min-w-0 min-h-[336px]">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-6">التنبيهات</h3>
      <div className="flex flex-col gap-6 flex-1">
        {alerts.map((a) => (
          <div
            key={a.text}
            className="bg-[rgba(52,152,219,0.13)] rounded-[10px] min-h-[66px] px-4 sm:px-5 py-3 flex flex-col justify-center gap-2 text-right"
          >
            <p className="text-[#052c65] text-[16px] sm:text-[18px] font-semibold">
              <span className="text-[#3498db] text-[20px]">{a.count}</span> {a.text}
            </p>
            <p className="text-muted text-[14px]">{a.time}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="flex items-center gap-2 text-[#c89637] text-[14px] self-start cursor-pointer"
      >
        <MoveLeft size={18} />
        عرض جميع التنبيهات
      </button>
    </div>
  );
}
