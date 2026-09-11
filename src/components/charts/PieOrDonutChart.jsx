import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StatusLegend, DonutCalloutLabel, buildDonutLabelLayout } from "./legend";

export default function PieOrDonutChart({
  data,
  donut = false,
  total = null,
  showLegend = true,
  valueSuffix = "%",
}) {
  const rows = Array.isArray(data) ? data : [];
  const beside = showLegend && !donut;
  const calloutLayout = donut ? buildDonutLabelLayout(rows) : null;

  return (
    <div
      className={`relative flex h-full min-h-0 w-full min-w-0 items-center ${
        beside ? "justify-between gap-4" : "justify-center"
      }`}
      dir="ltr"
    >
      <div className={`relative h-full min-h-0 min-w-0 ${beside ? "flex-1" : "w-full"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            margin={
              donut
                ? { top: 18, right: 88, bottom: 18, left: 88 }
                : { top: 4, right: 4, bottom: 4, left: 4 }
            }
          >
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={donut ? "24%" : 0}
              outerRadius={donut ? "48%" : "72%"}
              paddingAngle={2}
              isAnimationActive
              animationBegin={0}
              animationDuration={700}
              animationEasing="ease-out"
              labelLine={false}
              label={
                donut
                  ? (props) => (
                      <DonutCalloutLabel
                        {...props}
                        name={props.name}
                        value={props.value}
                        fill={props.fill || rows[props.index]?.color}
                        index={props.index}
                        layout={calloutLayout}
                      />
                    )
                  : false
              }
            >
              {rows.map((entry, i) => (
                <Cell key={`${entry.name}-${i}`} fill={entry.color || "#1B75FF"} stroke="#fff" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => {
                const label = item?.payload?.name || _name;
                const suffix = valueSuffix === "%" ? " %" : valueSuffix ? ` ${valueSuffix}` : "";
                return [`${value}${suffix}`, label];
              }}
              separator=" : "
            />
          </PieChart>
        </ResponsiveContainer>
        {donut && total != null && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[28px] font-bold leading-none text-[rgba(0,0,0,0.9)]">{total}</span>
          </div>
        )}
      </div>
      {beside && (
        <div className="flex h-full max-w-[42%] shrink-0 items-center pe-1">
          <StatusLegend data={rows} suffix={valueSuffix} />
        </div>
      )}
    </div>
  );
}
