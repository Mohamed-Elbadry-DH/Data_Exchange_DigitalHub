const RADIAN = Math.PI / 180;

function buildDonutLabelLayout(data) {
  const total = data.reduce((sum, d) => sum + Number(d.value), 0) || 1;
  const pad = 2;
  const usable = Math.max(1, 360 - pad * data.length);
  let cursor = 0;

  const meta = data.map((d, index) => {
    const sweep = (Number(d.value) / total) * usable;
    const midAngle = cursor + pad / 2 + sweep / 2;
    cursor += sweep + pad;
    const cos = Math.cos(-midAngle * RADIAN);
    const sin = Math.sin(-midAngle * RADIAN);
    return { index, midAngle, isRight: cos >= 0, sin };
  });

  const layout = {};
  for (const isRight of [true, false]) {
    const group = meta.filter((m) => m.isRight === isRight).sort((a, b) => a.sin - b.sin);
    if (!group.length) continue;
    const positions = group.map((m) => ({ ...m, yNorm: m.sin }));
    const minNorm = 0.44;
    for (let iter = 0; iter < 10; iter += 1) {
      for (let i = 1; i < positions.length; i += 1) {
        const gap = positions[i].yNorm - positions[i - 1].yNorm;
        if (gap < minNorm) {
          const push = (minNorm - gap) / 2;
          positions[i - 1].yNorm -= push;
          positions[i].yNorm += push;
        }
      }
      const lo = positions[0].yNorm;
      const hi = positions[positions.length - 1].yNorm;
      if (lo < -1.15) {
        const shift = -1.15 - lo;
        positions.forEach((p) => { p.yNorm += shift; });
      }
      if (hi > 1.15) {
        const shift = hi - 1.15;
        positions.forEach((p) => { p.yNorm -= shift; });
      }
    }
    positions.forEach((p) => {
      layout[p.index] = { yNorm: p.yNorm, isRight: p.isRight };
    });
  }
  return layout;
}

export function DonutCalloutLabel({
  cx, cy, midAngle, outerRadius, name, value, fill, index, layout,
}) {
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const planned = layout?.[index];
  const isRight = cos >= 0;
  const sx = cx + (outerRadius + 2) * cos;
  const sy = cy + (outerRadius + 2) * sin;
  const reach = outerRadius + 22;
  const ey = planned ? cy + planned.yNorm * reach : cy + reach * sin;
  const mx = sx + (isRight ? 14 : -14);
  const my = ey;
  const ex = cx + (isRight ? 1 : -1) * (outerRadius + 44);
  const textAnchor = isRight ? "start" : "end";
  const textX = ex + (isRight ? 8 : -8);
  const displayValue = Number.isInteger(Number(value)) ? value : Number(value).toFixed(2);

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={2.5} fill={fill} />
      <text x={textX} y={ey + 4} textAnchor={textAnchor} fontSize={12}>
        <tspan fill="#404040">{name}</tspan>
        <tspan fill={fill} fontWeight={700}>{` ${displayValue}`}</tspan>
      </text>
    </g>
  );
}

export function StatusLegend({ data, suffix = "%" }) {
  return (
    <ul className="flex flex-col justify-center gap-3" dir="rtl">
      {(data || []).map((entry, i) => (
        <li key={`${entry.name}-${i}`} className="flex items-center gap-2 text-[14px] text-[#404040]">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.color || "#1B75FF" }} />
          <span>{entry.name}</span>
          <span>
            {entry.value}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}

export { buildDonutLabelLayout };
