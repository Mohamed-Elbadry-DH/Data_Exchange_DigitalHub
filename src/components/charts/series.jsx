import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell, LabelList, ResponsiveContainer,
} from "recharts";
import { DEFAULT_STATUS_COLORS } from "./constants";

export function StatusLineChart({ data, seriesKeys, colors = DEFAULT_STATUS_COLORS, showLegend = false }) {
  const rows = Array.isArray(data) ? data : [];
  const keys = seriesKeys || Object.keys(rows[0] || {}).filter((k) => k !== "month");

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col" dir="ltr">
      {showLegend && (
        <ul className="mb-1 flex shrink-0 flex-wrap justify-end gap-x-3 gap-y-1 px-1" dir="rtl">
          {keys.map((key) => (
            <li key={key} className="flex items-center gap-1.5 text-[11px] text-[#404040]">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colors[key] || "#1B75FF" }} />
              <span>{key}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="min-h-0 min-w-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7f8999" }} />
            <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }} />
            <Tooltip formatter={(value, name) => [Number(value).toFixed(2), name]} separator=" : " />
            {keys.map((key) => {
              const stroke = colors[key] || "#1B75FF";
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={stroke}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#fff", stroke, strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={700}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SingleLineChart({ data, dataKey = "value", xKey = "month" }) {
  const rows = Array.isArray(data) ? data : [];
  return (
    <div className="h-full min-h-0 min-w-0 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#7f8999" }} />
          <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -10 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#1B75FF"
            strokeWidth={2}
            dot={{ r: 3, fill: "#fff", stroke: "#1B75FF", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VerticalBarChart({
  data,
  nameKey = "name",
  valueKey = "value",
  colored = false,
  xTick,
}) {
  const rows = Array.isArray(data) ? data : [];
  return (
    <div className="h-full min-h-0 min-w-0 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 8 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis
            dataKey={nameKey}
            tick={xTick || { fontSize: 11, fill: "#7f8999" }}
            interval={0}
            height={xTick ? 56 : undefined}
            tickFormatter={xTick ? undefined : (v) => (String(v).length > 10 ? `${String(v).slice(0, 8)}…` : v)}
          />
          <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }} />
          <Tooltip />
          <Bar dataKey={valueKey} fill="#1B75FF" radius={[6, 6, 0, 0]} maxBarSize={36} isAnimationActive animationDuration={700}>
            {colored && rows.map((entry, i) => <Cell key={i} fill={entry.color || "#1B75FF"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HorizontalBarChart({
  data,
  nameKey = "name",
  valueKey = "value",
  domainMax = 100,
  showLabels = true,
  yAxisWidth,
  formatName,
  labelFormatter,
}) {
  const rows = Array.isArray(data) ? data : [];
  const longest = rows.reduce((max, row) => {
    const label = formatName ? formatName(row[nameKey]) : String(row[nameKey] ?? "");
    return Math.max(max, label.length);
  }, 0);
  const axisWidth = yAxisWidth ?? Math.min(210, Math.max(52, Math.round(longest * 8.5)));
  const categoryGap = rows.length >= 10 ? "10%" : rows.length >= 6 ? "16%" : "22%";

  return (
    <div className="h-full min-h-0 min-w-0 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 44, left: 0, bottom: 4 }} barCategoryGap={categoryGap}>
          <CartesianGrid horizontal vertical stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, domainMax]} tick={{ fontSize: 12, fill: "#7f8999" }} axisLine={{ stroke: "#CBD5E1" }} tickLine={false} />
          <YAxis
            type="category"
            dataKey={nameKey}
            width={axisWidth}
            tickLine={false}
            axisLine={{ stroke: "#CBD5E1" }}
            interval={0}
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dy={4} textAnchor="end" fill="#404040" fontSize={11}>
                {formatName ? formatName(payload.value) : payload.value}
              </text>
            )}
          />
          <Tooltip formatter={(v) => [Number(v).toFixed(2), ""]} />
          <Bar
            dataKey={valueKey}
            fill="#1B75FF"
            maxBarSize={rows.length >= 10 ? 14 : 22}
            radius={[0, 8, 8, 0]}
            background={{ fill: "#E8F1FF", radius: [0, 8, 8, 0] }}
            isAnimationActive
            animationDuration={700}
          >
            {showLabels && (
              <LabelList
                dataKey={valueKey}
                position="right"
                formatter={labelFormatter || ((v) => (Number.isInteger(Number(v)) ? v : Number(v).toFixed(2)))}
                style={{ fill: "#7f8999", fontSize: 11, fontWeight: 500 }}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
