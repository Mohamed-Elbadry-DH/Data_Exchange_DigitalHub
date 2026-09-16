export default function StatusCard({ c, icons }) {
  if (!c) return null;
  const Icon = icons?.[c.icon];
  return (
    <div className="card-hover flex w-full min-w-0 flex-col rounded-[15.38px] bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: c.color }}>
        {Icon ? <Icon size={20} style={{ color: "#FFFFFF" }} /> : null}
      </div>
      <div className="text-2xl font-bold leading-none text-[rgba(0,0,0,0.9)]">{c.value}</div>
      <div className="mt-1.5 truncate text-[14px] text-[#404040]">{c.label}</div>
      <div className={`mt-1 text-[12px] ${c.up ? "text-success" : "text-danger"}`}>{c.delta} عن الربع السابق</div>
    </div>
  );
}
