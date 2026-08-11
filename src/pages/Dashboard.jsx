import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert,
  FileSearch, ChevronDown, Calendar,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  ChartPieIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon, LifeBuoyIcon,
} from "../components/ChartTypeIcons";
import {
  kpis, approvalStatusCards, exchangeStatusCards, approvalPie, monthlyApproved,
  statusDonut, statusDonutTotal, topOrgs,
} from "../data/mock";

const ICONS = { Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert, FileSearch };

const CHART_TYPES = ["pie", "radar", "line", "bar", "hbar"];
const CHART_TYPE_ICONS = [ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon];
const CHART_TYPE_LABELS = ["دائري", "رادار", "خطي", "أعمدة", "أفقي"];

const STATUS_COLORS = {
  "قيد الاعتماد": "#1B75FF",
  تعديل: "#FF8C08",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
};

/** Monthly status mix for line / multi-series views */
const approvalStatusMonthly = [
  { month: "يناير", "قيد الاعتماد": 28, تعديل: 18, المتأخرة: 12, معتمدة: 10 },
  { month: "فبراير", "قيد الاعتماد": 32, تعديل: 20, المتأخرة: 14, معتمدة: 18 },
  { month: "مارس", "قيد الاعتماد": 35, تعديل: 22, المتأخرة: 15, معتمدة: 22 },
  { month: "أبريل", "قيد الاعتماد": 30, تعديل: 24, المتأخرة: 18, معتمدة: 20 },
  { month: "مايو", "قيد الاعتماد": 38, تعديل: 26, المتأخرة: 16, معتمدة: 28 },
  { month: "يونيو", "قيد الاعتماد": 40, تعديل: 25, المتأخرة: 20, معتمدة: 35 },
  { month: "يوليو", "قيد الاعتماد": 36, تعديل: 21, المتأخرة: 17, معتمدة: 30 },
  { month: "أغسطس", "قيد الاعتماد": 34, تعديل: 23, المتأخرة: 15, معتمدة: 32 },
  { month: "سبتمبر", "قيد الاعتماد": 29, تعديل: 19, المتأخرة: 13, معتمدة: 24 },
  { month: "أكتوبر", "قيد الاعتماد": 31, تعديل: 22, المتأخرة: 14, معتمدة: 26 },
  { month: "نوفمبر", "قيد الاعتماد": 37, تعديل: 24, المتأخرة: 16, معتمدة: 33 },
  { month: "ديسمبر", "قيد الاعتماد": 33, تعديل: 20, المتأخرة: 12, معتمدة: 29 },
];

const exchangeStatusMonthly = [
  { month: "يناير", "قيد الاعتماد": 42, تعديل: 30, المتأخرة: 8, معتمدة: 12 },
  { month: "فبراير", "قيد الاعتماد": 44, تعديل: 31, المتأخرة: 9, معتمدة: 14 },
  { month: "مارس", "قيد الاعتماد": 45, تعديل: 32, المتأخرة: 7, معتمدة: 13 },
  { month: "أبريل", "قيد الاعتماد": 43, تعديل: 34, المتأخرة: 10, معتمدة: 11 },
  { month: "مايو", "قيد الاعتماد": 47, تعديل: 33, المتأخرة: 8, معتمدة: 15 },
  { month: "يونيو", "قيد الاعتماد": 46, تعديل: 34, المتأخرة: 8, معتمدة: 11 },
  { month: "يوليو", "قيد الاعتماد": 48, تعديل: 32, المتأخرة: 9, معتمدة: 12 },
  { month: "أغسطس", "قيد الاعتماد": 45, تعديل: 35, المتأخرة: 7, معتمدة: 14 },
  { month: "سبتمبر", "قيد الاعتماد": 44, تعديل: 33, المتأخرة: 8, معتمدة: 13 },
  { month: "أكتوبر", "قيد الاعتماد": 46, تعديل: 34, المتأخرة: 9, معتمدة: 12 },
  { month: "نوفمبر", "قيد الاعتماد": 49, تعديل: 31, المتأخرة: 8, معتمدة: 16 },
  { month: "ديسمبر", "قيد الاعتماد": 47, تعديل: 33, المتأخرة: 7, معتمدة: 15 },
];

const orgMonthly = [
  { month: "يناير", value: 42 },
  { month: "فبراير", value: 48 },
  { month: "مارس", value: 51 },
  { month: "أبريل", value: 47 },
  { month: "مايو", value: 55 },
  { month: "يونيو", value: 62 },
  { month: "يوليو", value: 58 },
  { month: "أغسطس", value: 60 },
  { month: "سبتمبر", value: 52 },
  { month: "أكتوبر", value: 49 },
  { month: "نوفمبر", value: 64 },
  { month: "ديسمبر", value: 66 },
];

const monthlyAsPie = [
  { name: "Q1", value: 78, color: "#1B75FF" },
  { name: "Q2", value: 167, color: "#0986ED" },
  { name: "Q3", value: 156, color: "#16A34A" },
  { name: "Q4", value: 135, color: "#FF8C08" },
];

const monthlyRadar = [
  { subject: "يناير", value: 13 },
  { subject: "مارس", value: 30 },
  { subject: "مايو", value: 60 },
  { subject: "يوليو", value: 58 },
  { subject: "سبتمبر", value: 28 },
  { subject: "نوفمبر", value: 65 },
];

function toRadarData(items) {
  return items.map((item) => ({
    subject: item.name.length > 14 ? `${item.name.slice(0, 12)}…` : item.name,
    value: item.value,
    fullMark: Math.max(...items.map((d) => d.value)) * 1.15,
  }));
}

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
    <div className="bg-white rounded-2xl p-4 w-[24%] max-w-[300px] min-w-0 shadow-sm">
      <div className="flex items-start justify-end gap-3 text-right">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: k.dark ? "#F8F9FA" : k.color }}
        >
          <Icon size={22} className={k.dark ? "text-[#c89637]" : "text-white"} />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-3xl font-bold leading-none text-[rgba(0,0,0,0.9)] text-right">{k.value}</div>
          <div className="text-[15px] text-[#404040] mt-3 text-right">{k.label}</div>
          <div className={`text-[12px] mt-2 text-right ${k.up ? "text-success" : "text-danger"}`}>{k.delta} عن الربع السابق</div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ c }) {
  const Icon = ICONS[c.icon];
  return (
    <div className="bg-white w-full h-[165px] rounded-[15.38px] p-4 shadow-sm flex flex-col min-w-0">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ background: c.color }}>
        <Icon size={20} style={{ color: "#FFFFFF" }} />
      </div>
      <div className="text-2xl font-bold text-[rgba(0,0,0,0.9)]">{c.value}</div>
      <div className="text-[14px] text-[#404040] mt-1 truncate">{c.label}</div>
      <div className={`text-[12px] mt-1 ${c.up ? "text-success" : "text-danger"}`}>{c.delta} عن الربع السابق</div>
    </div>
  );
}

const RADIAN = Math.PI / 180;

function DonutCalloutLabel({ cx, cy, midAngle, outerRadius, name, value, fill }) {
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const isRight = cos >= 0;
  // Pull callouts slightly inward/down so top labels stay inside the card
  const radial = outerRadius + 14;
  const sx = cx + (outerRadius + 2) * cos;
  const sy = cy + (outerRadius + 2) * sin;
  const mx = cx + radial * cos;
  const my = cy + radial * sin + 10;
  const ex = mx + (isRight ? 28 : -28);
  const ey = my + 6;
  const textAnchor = isRight ? "start" : "end";
  const textX = ex + (isRight ? 10 : -10);

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={2.5} fill={fill} />
      <text x={textX} y={ey - 4} textAnchor={textAnchor} fill="#404040" fontSize={13}>
        {name}
      </text>
      <text x={textX} y={ey + 14} textAnchor={textAnchor} fill={fill} fontSize={14} fontWeight={700}>
        {Number(value).toFixed(2)}
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
    <div className="bg-white shadow-sm overflow-hidden min-w-0 flex-1" style={{ height: 345, borderRadius: 20 }}>
      <div className="flex flex-col h-full p-5">
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
        <div className="flex-1 min-h-0 overflow-hidden">{children(type)}</div>
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
  return (
    <div className={`relative flex items-center ${showLegend ? "justify-between gap-6" : "justify-center"} h-full`} dir="ltr">
      <div className="shrink-0 relative" style={{ width: donut ? "100%" : 243, height: donut ? "100%" : 243, marginLeft: showLegend ? 48 : 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={donut ? { top: 18, right: 24, bottom: 18, left: 24 } : undefined}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="52%"
              innerRadius={donut ? 36 : 0}
              outerRadius={donut ? 92 : 118}
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
            <span className="text-3xl font-bold text-[rgba(0,0,0,0.9)]">{total}</span>
          </div>
        )}
      </div>
      {showLegend && !donut && <StatusLegend data={data} suffix={valueSuffix} />}
    </div>
  );
}

function StatusRadarChart({ data, maxValue }) {
  const radarData = toRadarData(data);
  const domainMax = maxValue || Math.ceil(Math.max(...data.map((d) => d.value)) * 1.2);
  return (
    <div className="w-full h-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#404040" }} />
          <PolarRadiusAxis angle={30} domain={[0, domainMax]} tick={{ fontSize: 10, fill: "#7f8999" }} />
          <Radar
            name="القيمة"
            dataKey="value"
            stroke="#1B75FF"
            fill="#1B75FF"
            fillOpacity={0.35}
            isAnimationActive
            animationDuration={700}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusLineChart({ data, seriesKeys }) {
  const keys = seriesKeys || Object.keys(data[0] || {}).filter((k) => k !== "month");
  return (
    <div className="w-full h-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7f8999" }} />
          <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }} />
          <Tooltip />
          {keys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={STATUS_COLORS[key] || "#1B75FF"}
              strokeWidth={2}
              dot={{ r: 3, fill: "#fff", stroke: STATUS_COLORS[key] || "#1B75FF", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={700}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SingleLineChart({ data, dataKey = "value", xKey = "month" }) {
  return (
    <div className="w-full h-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#7f8999" }} />
          <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }} />
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
    <div className="w-full h-full" dir="ltr">
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
            barSize={28}
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

function HorizontalBarChart({ data, nameKey = "name", valueKey = "value", domainMax = 100, showLabels = true }) {
  return (
    <div className="w-full h-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 36, left: 8, bottom: 8 }}
          barCategoryGap="22%"
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
            width={230}
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
            barSize={20}
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
                style={{ fill: "#7f8999", fontSize: 12, fontWeight: 500 }}
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
  pieVariant = "pie",
  pieTotal = null,
  pieSuffix = "%",
  hbarDomain = 100,
}) {
  if (type === "pie") {
    return (
      <PieOrDonutChart
        data={categorical}
        donut={pieVariant === "donut"}
        total={pieTotal}
        showLegend={pieVariant !== "donut"}
        valueSuffix={pieSuffix}
      />
    );
  }
  if (type === "radar") {
    return <StatusRadarChart data={categorical} />;
  }
  if (type === "line") {
    if (monthlySeries) return <StatusLineChart data={monthlySeries} />;
    return <SingleLineChart data={singleMonthly || categorical.map((d, i) => ({ month: d.name, value: d.value }))} />;
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
  const topOrgsPie = topOrgs.map((o, i) => ({
    name: shortOrgName(o.name),
    value: o.value,
    color: ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF"][i],
  }));

  return (
    <Layout title="لوحة التحكم">
      <div className="p-8 space-y-8">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 text-[14px] text-[#404040] shadow-sm ms-0">
            <Calendar size={16} className="text-primary" />
            النصف الأول من عام 2026
            <ChevronDown size={14} />
          </button>
        </div>

        <div>
          <h2 className="text-[20px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات عامة</h2>
          <div className="flex justify-center gap-5 flex-nowrap">
            {kpis.map((k) => <KpiCard key={k.label + k.value} k={k} />)}
          </div>
        </div>

        <div className="w-full max-w-[1535.5px] min-h-[285px] grid grid-cols-2 gap-10 overflow-hidden">
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات تبادل نماذج البيان</h2>
            <div className="grid grid-cols-4 gap-3 h-[165px]">
              {exchangeStatusCards.map((c, i) => <StatusCard key={i} c={c} />)}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات اعتماد البيانات</h2>
            <div className="grid grid-cols-4 gap-3 h-[165px]">
              {approvalStatusCards.map((c, i) => <StatusCard key={i} c={c} />)}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1535.5px] h-[345px] flex flex-row-reverse gap-[63px]">
          <ChartCard title="توزيع نماذج البيان حسب حالة الاعتماد" defaultType="pie">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={approvalPie}
                monthlySeries={approvalStatusMonthly}
                pieVariant="pie"
                pieSuffix="%"
                hbarDomain={50}
              />
            )}
          </ChartCard>

          <ChartCard title="الطلبات المعتمدة شهرياً" defaultType="line">
            {(type) => {
              if (type === "pie") {
                return <PieOrDonutChart data={monthlyAsPie} donut={false} valueSuffix="" />;
              }
              if (type === "radar") {
                return <StatusRadarChart data={monthlyRadar.map((d) => ({ name: d.subject, value: d.value }))} />;
              }
              if (type === "line") {
                return <SingleLineChart data={monthlyApproved} />;
              }
              if (type === "bar") {
                return <VerticalBarChart data={monthlyApproved.map((d) => ({ name: d.month, value: d.value }))} />;
              }
              return (
                <HorizontalBarChart
                  data={monthlyApproved.map((d) => ({ name: d.month, value: d.value }))}
                  domainMax={100}
                  showLabels
                />
              );
            }}
          </ChartCard>
        </div>

        <div className="w-full max-w-[1535.5px] h-[345px] flex flex-row-reverse gap-[63px]">
          <ChartCard title="توزيع البيانات حسب الحالة" defaultType="pie">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={statusDonut}
                monthlySeries={exchangeStatusMonthly}
                pieVariant="donut"
                pieTotal={statusDonutTotal}
                pieSuffix=""
                hbarDomain={50}
              />
            )}
          </ChartCard>

          <ChartCard title="أعلى 5 جهات معتمد لها نماذج بيان" defaultType="hbar">
            {(type) => {
              if (type === "pie") {
                return <PieOrDonutChart data={topOrgsPie} donut={false} valueSuffix="" />;
              }
              if (type === "radar") {
                return (
                  <StatusRadarChart
                    data={topOrgs.map((o) => ({ name: shortOrgName(o.name), value: o.value }))}
                  />
                );
              }
              if (type === "line") {
                return <SingleLineChart data={orgMonthly} />;
              }
              if (type === "bar") {
                return (
                  <VerticalBarChart
                    data={topOrgs.map((o) => ({ name: shortOrgName(o.name), value: o.value }))}
                  />
                );
              }
              return <HorizontalBarChart data={topOrgs} domainMax={120} showLabels />;
            }}
          </ChartCard>
        </div>
      </div>
    </Layout>
  );
}
