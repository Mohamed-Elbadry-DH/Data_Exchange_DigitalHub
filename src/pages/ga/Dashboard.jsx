import { useRef, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LabelList,
} from "recharts";
import {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert,
  FileSearch, RefreshCw, ChevronDown, Calendar, Plus,
} from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import CreateStatementModal from "../../components/ga/CreateStatementModal";
import {
  ChartPieIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon, LifeBuoyIcon,
} from "../../components/ChartTypeIcons";
import {
  kpis, exchangeStatusCards, fulfillmentStatusCards, gaStatusPie,
  gaStatusDonut, gaStatusDonutTotal, gaMonthlyCompleted, gaStatusMonthly, topOrgs,
} from "../../data/mockGa";

const ICONS = {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert, FileSearch, RefreshCw,
};

/** Selector order: pie · donut · line · column · horizontal bar */
const CHART_TYPES = ["pie", "donut", "line", "bar", "hbar"];
const CHART_TYPE_ICONS = [ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon];
const CHART_TYPE_LABELS = ["دائري", "دونات", "خطي", "أعمدة", "أفقي"];

const STATUS_COLORS = {
  "لم تبدأ بعد": "#1B75FF",
  "قيد التنفيذ": "#FFC107",
  تعديل: "#FF8C08",
  "قيد المراجعة": "#9747FF",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
  "قيد الاعتماد": "#1B75FF",
};

/** Monthly values — rankings cross so different orgs lead in different months */
const ORG_LINE_KEYS = [
  "الجهاز المركزي…",
  "وزارة التربية…",
  "وزارة الصحة",
  "وزارة المالية",
  "وزارة الداخلية",
];
const ORG_LINE_COLORS = {
  "الجهاز المركزي…": "#1B75FF",
  "وزارة التربية…": "#0986ED",
  "وزارة الصحة": "#16A34A",
  "وزارة المالية": "#FF8C08",
  "وزارة الداخلية": "#9747FF",
};
const topOrgsMonthly = [
  // التربية تتقدم أولاً
  { month: "يناير", "الجهاز المركزي…": 38.2, "وزارة التربية…": 52.4, "وزارة الصحة": 41.0, "وزارة المالية": 28.5, "وزارة الداخلية": 33.1 },
  { month: "فبراير", "الجهاز المركزي…": 42.6, "وزارة التربية…": 49.8, "وزارة الصحة": 44.5, "وزارة المالية": 31.2, "وزارة الداخلية": 36.4 },
  // الصحة تتصدر
  { month: "مارس", "الجهاز المركزي…": 45.0, "وزارة التربية…": 40.2, "وزارة الصحة": 55.8, "وزارة المالية": 34.6, "وزارة الداخلية": 30.0 },
  { month: "أبريل", "الجهاز المركزي…": 48.3, "وزارة التربية…": 36.5, "وزارة الصحة": 51.2, "وزارة المالية": 39.1, "وزارة الداخلية": 42.7 },
  // المالية تقفز للمقدمة
  { month: "مايو", "الجهاز المركزي…": 44.8, "وزارة التربية…": 33.2, "وزارة الصحة": 38.6, "وزارة المالية": 58.9, "وزارة الداخلية": 46.5 },
  { month: "يونيو", "الجهاز المركزي…": 50.4, "وزارة التربية…": 37.0, "وزارة الصحة": 35.2, "وزارة المالية": 54.5, "وزارة الداخلية": 49.1 },
  // الداخلية ثم الجهاز يعودان
  { month: "يوليو", "الجهاز المركزي…": 47.1, "وزارة التربية…": 41.6, "وزارة الصحة": 39.9, "وزارة المالية": 42.2, "وزارة الداخلية": 56.8 },
  { month: "أغسطس", "الجهاز المركزي…": 55.5, "وزارة التربية…": 39.8, "وزارة الصحة": 43.5, "وزارة المالية": 40.8, "وزارة الداخلية": 48.2 },
  { month: "سبتمبر", "الجهاز المركزي…": 58.0, "وزارة التربية…": 45.1, "وزارة الصحة": 32.0, "وزارة المالية": 36.0, "وزارة الداخلية": 41.6 },
  { month: "أكتوبر", "الجهاز المركزي…": 51.2, "وزارة التربية…": 48.9, "وزارة الصحة": 40.4, "وزارة المالية": 44.3, "وزارة الداخلية": 37.0 },
  { month: "نوفمبر", "الجهاز المركزي…": 60.8, "وزارة التربية…": 42.2, "وزارة الصحة": 46.8, "وزارة المالية": 39.5, "وزارة الداخلية": 43.4 },
  // الترتيب الحالي (ديسمبر) يطابق كارت الـ hbar
  { month: "ديسمبر", "الجهاز المركزي…": 66.27, "وزارة التربية…": 35.63, "وزارة الصحة": 27.04, "وزارة المالية": 26.86, "وزارة الداخلية": 26.86 },
];

const monthlyAsPie = [
  { name: "Q1", value: 78, color: "#1B75FF" },
  { name: "Q2", value: 167, color: "#0986ED" },
  { name: "Q3", value: 156, color: "#16A34A" },
  { name: "Q4", value: 135, color: "#FF8C08" },
];

function shortOrgName(name) {
  if (name.includes("التعبئة")) return "الجهاز المركزي…";
  if (name.includes("التربية")) return "وزارة التربية…";
  if (name.includes("الصحة")) return "وزارة الصحة";
  if (name.includes("المالية")) return "وزارة المالية";
  if (name.includes("الداخلية")) return "وزارة الداخلية";
  return name.length > 18 ? `${name.slice(0, 16)}…` : name;
}

function KpiCard({ k }) {
  const Icon = ICONS[k.icon];
  return (
    <div className="card-hover bg-white rounded-2xl p-4 w-[335px] shrink-0 min-w-0 shadow-sm">
      <div className="flex items-start justify-end gap-3 text-right">
        <div
          className="w-[60px] h-[60px] rounded-[15px] flex items-center justify-center shrink-0"
          style={{ background: k.dark ? "#F8F9FA" : k.color }}
        >
          <Icon size={26} className={k.dark ? "text-[#c89637]" : "text-white"} />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-[32px] font-bold leading-none text-[rgba(0,0,0,0.9)] text-right">{k.value}</div>
          <div className="text-[18px] text-[#404040] mt-3 text-right">{k.label}</div>
          <div className={`text-[14px] mt-2 text-right ${k.up ? "text-success" : "text-danger"}`}>{k.delta} عن الربع السابق</div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ c }) {
  const Icon = ICONS[c.icon];
  return (
    <div className="card-hover bg-white w-full rounded-[15.38px] p-4 shadow-sm flex flex-col min-w-0">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ background: c.color }}>
        <Icon size={20} style={{ color: "#FFFFFF" }} />
      </div>
      <div className="text-2xl font-bold leading-none text-[rgba(0,0,0,0.9)]">{c.value}</div>
      <div className="text-[14px] text-[#404040] mt-1.5 truncate">{c.label}</div>
      <div className={`text-[12px] mt-1 ${c.up ? "text-success" : "text-danger"}`}>{c.delta} عن الربع السابق</div>
    </div>
  );
}

const RADIAN = Math.PI / 180;

/** Precompute non-overlapping callout Y targets for each slice (left/right sides). */
function buildDonutLabelLayout(data) {
  const total = data.reduce((s, d) => s + Number(d.value), 0) || 1;
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

    // Ideal Y in normalized units (−1…1), then push apart
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
      // Keep band inside the card
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

function DonutCalloutLabel({
  cx, cy, midAngle, outerRadius, name, value, fill, index, layout,
}) {
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const planned = layout?.[index];
  const isRight = cos >= 0;

  const sx = cx + (outerRadius + 2) * cos;
  const sy = cy + (outerRadius + 2) * sin;

  const reach = outerRadius + 22;
  const ey = planned
    ? cy + planned.yNorm * reach
    : cy + reach * sin;
  // Horizontal elbow keeps leader lines from crossing when Y is fanned out
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

function ChartCard({ title, defaultType = "pie", children }) {
  const defaultIndex = Math.max(0, CHART_TYPES.indexOf(defaultType));
  const [activeChart, setActiveChart] = useState(defaultIndex);
  const frameWidth = 217;
  const type = CHART_TYPES[activeChart];

  return (
    <div className="bg-white shadow-sm overflow-hidden min-w-0 flex-1 h-full min-h-0" style={{ height: 345, borderRadius: 20 }}>
      <div className="flex flex-col h-full min-h-0 p-5">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-[17px] font-bold text-[rgba(0,0,0,0.9)]">{title}</h3>
          <div
            dir="ltr"
            className="inline-flex h-[39px] items-center justify-center gap-2 rounded-lg"
            style={{
              width: frameWidth,
              background: "rgba(240, 240, 240, 0.53)",
              padding: "6px 15px",
            }}
          >
            {CHART_TYPE_ICONS.map((I, i) => {
              const isActive = activeChart === i;
              return (
                <button
                  key={CHART_TYPES[i]}
                  type="button"
                  onClick={() => setActiveChart(i)}
                  aria-label={CHART_TYPE_LABELS[i]}
                  aria-pressed={isActive}
                  title={CHART_TYPE_LABELS[i]}
                  className="w-[26px] h-[26px] rounded flex items-center justify-center transition-colors cursor-pointer"
                  style={
                    isActive
                      ? { background: "rgba(9, 134, 237, 0.09)", color: "#0986ED" }
                      : { background: "transparent", color: "#052C65" }
                  }
                >
                  <I size={19} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 min-h-0 min-w-0 w-full overflow-hidden">{children(type)}</div>
      </div>
    </div>
  );
}

function StatusLegend({ data, suffix = "%" }) {
  return (
    <ul className="space-y-3 me-4" dir="rtl">
      {data.map((e) => (
        <li key={e.name} className="flex items-center gap-2 text-[14px] text-[#404040]">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
          <span className="flex items-center gap-2">
            <span>{e.name}</span>
            <span>{e.value}{suffix}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function PieOrDonutChart({ data, donut = false, total = null, showLegend = true, valueSuffix = "%" }) {
  const calloutLayout = donut ? buildDonutLabelLayout(data) : null;

  return (
    <div
      className={`relative flex items-center h-full w-full min-h-0 min-w-0 ${showLegend && !donut ? "justify-between gap-4" : "justify-center"}`}
      dir="ltr"
    >
      <div className={`relative h-full min-h-0 min-w-0 ${showLegend && !donut ? "flex-1" : "w-full"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={donut ? { top: 18, right: 88, bottom: 18, left: 88 } : { top: 4, right: 4, bottom: 4, left: 4 }}>
            <Pie
              data={data}
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
                        fill={props.fill || data[props.index]?.color}
                        index={props.index}
                        layout={calloutLayout}
                      />
                    )
                  : false
              }
            >
              {data.map((e, i) => (
                <Cell key={i} fill={e.color || "#1B75FF"} stroke="#fff" strokeWidth={1} />
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-bold text-[rgba(0,0,0,0.9)]">{total}</span>
          </div>
        )}
      </div>
      {showLegend && !donut && (
        <div className="shrink-0 max-w-[42%] pe-1">
          <StatusLegend data={data} suffix={valueSuffix} />
        </div>
      )}
    </div>
  );
}

function StatusLineChart({ data, seriesKeys, colors = STATUS_COLORS, showLegend = false }) {
  const keys = seriesKeys || Object.keys(data[0] || {}).filter((k) => k !== "month");
  return (
    <div className="w-full h-full min-h-0 min-w-0 flex flex-col" dir="ltr">
      {showLegend && (
        <ul className="flex flex-wrap justify-end gap-x-3 gap-y-1 mb-1 shrink-0 px-1" dir="rtl">
          {keys.map((key) => (
            <li key={key} className="flex items-center gap-1.5 text-[11px] text-[#404040]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[key] || "#1B75FF" }} />
              <span>{key}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex-1 min-h-0 min-w-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7f8999" }} />
            <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }} />
            <Tooltip
              formatter={(value, name) => [Number(value).toFixed(2), name]}
              separator=" : "
            />
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

function SingleLineChart({ data, dataKey = "value", xKey = "month" }) {
  return (
    <div className="w-full h-full min-h-0 min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 4 }}>
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

function VerticalBarChart({ data, nameKey = "name", valueKey = "value", colored = false }) {
  return (
    <div className="w-full h-full min-h-0 min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 8 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "#7f8999" }}
            interval={0}
            tickFormatter={(v) => (String(v).length > 10 ? `${String(v).slice(0, 8)}…` : v)}
          />
          <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }} />
          <Tooltip />
          <Bar
            dataKey={valueKey}
            fill="#1B75FF"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
            isAnimationActive
            animationDuration={700}
          >
            {colored &&
              data.map((e, i) => (
                <Cell key={i} fill={e.color || "#1B75FF"} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HorizontalBarChart({
  data,
  nameKey = "name",
  valueKey = "value",
  domainMax = 100,
  showLabels = true,
  yAxisWidth,
}) {
  const longest = data.reduce((max, row) => Math.max(max, String(row[nameKey] ?? "").length), 0);
  const axisWidth = yAxisWidth ?? Math.min(210, Math.max(52, Math.round(longest * 8.5)));
  const categoryGap = data.length >= 10 ? "10%" : data.length >= 6 ? "16%" : "22%";

  return (
    <div className="w-full h-full min-h-0 min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 44, left: 0, bottom: 4 }}
          barCategoryGap={categoryGap}
        >
          <CartesianGrid horizontal vertical stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, domainMax]}
            tick={{ fontSize: 12, fill: "#7f8999" }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey={nameKey}
            width={axisWidth}
            tickLine={false}
            axisLine={{ stroke: "#CBD5E1" }}
            interval={0}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fill="#404040"
                  fontSize={11}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <Tooltip formatter={(v) => [Number(v).toFixed(2), ""]} />
          <Bar
            dataKey={valueKey}
            fill="#1B75FF"
            maxBarSize={data.length >= 10 ? 14 : 22}
            radius={[0, 8, 8, 0]}
            background={{ fill: "#E8F1FF", radius: [0, 8, 8, 0] }}
            isAnimationActive
            animationDuration={700}
          >
            {showLabels && (
              <LabelList
                dataKey={valueKey}
                position="right"
                formatter={(v) => Number(v).toFixed(2)}
                style={{ fill: "#7f8999", fontSize: 11, fontWeight: 500 }}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SwitchableChart({
  type,
  categorical,
  monthlySeries,
  singleMonthly,
  pieTotal = null,
  pieSuffix = "%",
  donutTotal = null,
  donutSuffix = "",
  hbarDomain = 100,
}) {
  if (type === "pie") {
    return (
      <PieOrDonutChart
        data={categorical}
        donut={false}
        showLegend
        valueSuffix={pieSuffix}
      />
    );
  }
  if (type === "donut") {
    return (
      <PieOrDonutChart
        data={categorical}
        donut
        total={donutTotal ?? pieTotal}
        showLegend={false}
        valueSuffix={donutSuffix || pieSuffix}
      />
    );
  }
  if (type === "line") {
    if (monthlySeries) return <StatusLineChart data={monthlySeries} />;
    return <SingleLineChart data={singleMonthly || categorical.map((d) => ({ month: d.name, value: d.value }))} />;
  }
  if (type === "bar") {
    return <VerticalBarChart data={categorical} colored={Boolean(categorical[0]?.color)} />;
  }
  return (
    <HorizontalBarChart
      data={categorical}
      domainMax={hbarDomain}
      showLabels
    />
  );
}

export default function Dashboard() {
  const [createOpen, setCreateOpen] = useState(false);
  const containerRef = useRef(null);
  const createBtnRef = useRef(null);
  const topOrgsPie = topOrgs.map((o, i) => ({
    name: shortOrgName(o.name),
    value: o.value,
    color: ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF"][i],
  }));

  return (
    <Layout title="لوحة التحكم">
      <div
        ref={containerRef}
        className={`relative ${createOpen ? "h-[calc(100dvh-74px)] overflow-hidden" : "min-h-full"}`}
      >
        <div className="p-8 space-y-[50px]">
        <div className="flex items-center gap-3" dir="ltr">
          <button
            ref={createBtnRef}
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-[#052C65] text-white text-[16px] font-bold rounded-[12px] py-[13px] px-[20px] shadow-sm cursor-pointer"
            aria-label="إنشاء طلب نموذج بيان"
          >
            <Plus size={16} strokeWidth={2.5} />
            إنشاء طلب نموذج بيان
          </button>
          <button type="button" className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 text-[14px] text-[#404040] shadow-sm" dir="rtl">
            <Calendar size={16} className="text-primary" />
            النصف الأول من عام 2026
            <ChevronDown size={14} />
          </button>
        </div>

        <div>
          <h2 className="text-[20px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات عامة</h2>
          <div className="flex flex-row-reverse justify-center gap-[65px] flex-nowrap">
            {kpis.map((k) => <KpiCard key={k.label + k.value} k={k} />)}
          </div>
        </div>

        <div className="w-full max-w-[1535.5px] grid grid-cols-2 gap-[50px] overflow-hidden">
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات تبادل نماذج البيان</h2>
            <div className="grid grid-cols-3 gap-5">
              {exchangeStatusCards.map((c, i) => <StatusCard key={i} c={c} />)}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات اعتماد البيانات</h2>
            <div className="grid grid-cols-3 gap-5">
              {fulfillmentStatusCards.map((c, i) => <StatusCard key={i} c={c} />)}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1535.5px] h-[345px] flex flex-row-reverse gap-[50px]">
          <ChartCard title="توزيع نماذج البيان حسب حالة الاعتماد" defaultType="pie">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={gaStatusPie}
                monthlySeries={gaStatusMonthly}
                pieSuffix="%"
                donutSuffix="%"
                hbarDomain={50}
              />
            )}
          </ChartCard>

          <ChartCard title="الطلبات المعتمدة شهرياً" defaultType="line">
            {(type) => {
              if (type === "pie") {
                return <PieOrDonutChart data={monthlyAsPie} donut={false} valueSuffix="" />;
              }
              if (type === "donut") {
                return (
                  <PieOrDonutChart
                    data={monthlyAsPie}
                    donut
                    total={monthlyAsPie.reduce((s, d) => s + d.value, 0)}
                    showLegend={false}
                    valueSuffix=""
                  />
                );
              }
              if (type === "line") {
                return <SingleLineChart data={gaMonthlyCompleted} />;
              }
              if (type === "bar") {
                return <VerticalBarChart data={gaMonthlyCompleted.map((d) => ({ name: d.month, value: d.value }))} />;
              }
              return (
                <HorizontalBarChart
                  data={gaMonthlyCompleted.map((d) => ({ name: d.month, value: d.value }))}
                  domainMax={140}
                  showLabels
                  yAxisWidth={58}
                />
              );
            }}
          </ChartCard>
        </div>

        <div className="w-full max-w-[1535.5px] h-[345px] flex flex-row-reverse gap-[50px]">
          <ChartCard title="توزيع البيانات حسب الحالة" defaultType="donut">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={gaStatusDonut}
                monthlySeries={gaStatusMonthly}
                pieSuffix=""
                donutTotal={gaStatusDonutTotal}
                donutSuffix=""
                hbarDomain={100}
              />
            )}
          </ChartCard>

          <ChartCard title="أعلى 5 جهات معتمد لها نماذج بيان" defaultType="hbar">
            {(type) => {
              if (type === "pie") {
                return <PieOrDonutChart data={topOrgsPie} donut={false} valueSuffix="" />;
              }
              if (type === "donut") {
                return (
                  <PieOrDonutChart
                    data={topOrgsPie}
                    donut
                    total={Math.round(topOrgs.reduce((s, o) => s + o.value, 0))}
                    showLegend={false}
                    valueSuffix=""
                  />
                );
              }
              if (type === "line") {
                return (
                  <StatusLineChart
                    data={topOrgsMonthly}
                    seriesKeys={ORG_LINE_KEYS}
                    colors={ORG_LINE_COLORS}
                    showLegend
                  />
                );
              }
              if (type === "bar") {
                return (
                  <VerticalBarChart
                    data={topOrgs.map((o) => ({ name: shortOrgName(o.name), value: o.value }))}
                  />
                );
              }
              return <HorizontalBarChart data={topOrgs} domainMax={120} showLabels yAxisWidth={210} />;
            }}
          </ChartCard>
        </div>
        </div>

      <CreateStatementModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={() => setCreateOpen(false)}
        anchorRef={createBtnRef}
        containerRef={containerRef}
      />
      </div>
    </Layout>
  );
}
