import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LabelList,
} from "recharts";
import {
  FileText, Users, Building2, Building, Calendar, ChevronDown, MoveLeft, Zap,
} from "lucide-react";
import Layout from "../../components/it/ItLayout";
import StatusBadge from "../../components/it/StatusBadge";
import {
  ChartPieIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon, LifeBuoyIcon,
} from "../../components/ChartTypeIcons";
import {
  itKpis, itAlerts, entityTypeDistribution, adminsBarSeries, pendingTasks,
} from "../../data/mockIt";

const ICONS = { FileText, Users, Building2, Building };

const CHART_TYPES = ["pie", "donut", "line", "bar", "hbar"];
const CHART_TYPE_ICONS = [ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon];
const CHART_TYPE_LABELS = ["دائري", "دونات", "خطي", "أعمدة", "أفقي"];

function shortAdminName(name) {
  return name.length > 22 ? `${name.slice(0, 20)}…` : name;
}

/** Admin names are long; wrap each tick onto up to two 13-char lines */
function WrappedTick({ x, y, payload }) {
  const words = String(payload.value).split(" ");
  const lines = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${w}`.length <= 13) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
  }
  const shown = lines.slice(0, 3);
  if (lines.length > 3) shown[2] = `${shown[2]}…`;
  return (
    <text x={x} y={y + 10} textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize={10}>
      {shown.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 11}>{l}</tspan>
      ))}
    </text>
  );
}

function KpiCard({ k }) {
  const Icon = ICONS[k.icon] || FileText;
  return (
    <div className="card-hover bg-white rounded-[20px] px-5 py-4 w-[272px] h-[113px] shrink-0 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-[rgba(9,134,237,0.08)] h-[45px] px-2 rounded-full flex items-center justify-center shrink-0">
          <Icon size={26} className="text-[#0986ED]" />
        </div>
        <div className="text-[18px] font-semibold text-[#052c65] text-right min-w-0 flex-1 truncate">
          {k.label}
        </div>
      </div>
      <div className="text-[25px] font-bold text-[#0986ed] text-right">{k.value}</div>
    </div>
  );
}

function ChartCard({ title, defaultType = "pie", width, children }) {
  const [activeChart, setActiveChart] = useState(Math.max(0, CHART_TYPES.indexOf(defaultType)));
  const type = CHART_TYPES[activeChart];

  return (
    <div
      className="bg-white shadow-sm overflow-hidden min-w-0 h-full"
      style={{ height: 345, borderRadius: 20, width }}
    >
      <div className="flex flex-col h-full min-h-0 p-5">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-[20px] font-bold text-[#052c65]">{title}</h3>
          <div
            dir="ltr"
            className="inline-flex h-[39px] items-center justify-center gap-2 rounded-lg"
            style={{ width: 217, background: "rgba(240, 240, 240, 0.53)", padding: "6px 15px" }}
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

function PieOrDonutChart({ data, donut = false, total = null, showLegend = true }) {
  return (
    <div
      className={`relative flex items-center h-full w-full min-h-0 min-w-0 ${showLegend ? "justify-between gap-4" : "justify-center"}`}
      dir="ltr"
    >
      <div className={`relative h-full min-h-0 min-w-0 ${showLegend ? "flex-1" : "w-full"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={donut ? "38%" : 0}
              outerRadius="72%"
              paddingAngle={2}
              isAnimationActive
              animationDuration={700}
              labelLine={false}
            >
              {data.map((e, i) => (
                <Cell key={i} fill={e.color || "#1B75FF"} stroke="#fff" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip formatter={(value, _n, item) => [`${value} %`, item?.payload?.name]} separator=" : " />
          </PieChart>
        </ResponsiveContainer>
        {donut && total != null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-[#052c65]">{total}</span>
          </div>
        )}
      </div>
      {showLegend && (
        <ul className="shrink-0 space-y-3 pe-1" dir="rtl">
          {data.map((e) => (
            <li key={e.name} className="flex items-center gap-2 text-[16px] text-[#052c65]">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
              <span>{e.name}</span>
              <span className="font-bold">{e.value}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VerticalBarChart({ data }) {
  return (
    <div className="w-full h-full min-h-0 min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 8 }} barCategoryGap="28%">
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="name" interval={0} height={56} tick={<WrappedTick />} />
          <YAxis width={40} tickMargin={8} domain={[0, 100]} tick={{ fontSize: 12, fill: "rgba(0,0,0,0.7)" }} />
          <Tooltip />
          <Bar dataKey="value" fill="rgba(9,134,237,0.82)" radius={[6, 6, 0, 0]} maxBarSize={46} isAnimationActive animationDuration={700} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HorizontalBarChart({ data, domainMax = 100 }) {
  return (
    <div className="w-full h-full min-h-0 min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, left: 0, bottom: 4 }} barCategoryGap="16%">
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, domainMax]} tick={{ fontSize: 12, fill: "#7f8999" }} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={200}
            tickLine={false}
            interval={0}
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dy={4} textAnchor="end" fill="#404040" fontSize={11}>
                {shortAdminName(payload.value)}
              </text>
            )}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#1B75FF" maxBarSize={18} radius={[0, 8, 8, 0]} background={{ fill: "#E8F1FF", radius: [0, 8, 8, 0] }} isAnimationActive animationDuration={700}>
            <LabelList dataKey="value" position="right" style={{ fill: "#7f8999", fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SingleLineChart({ data }) {
  return (
    <div className="w-full h-full min-h-0 min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis dataKey="name" interval={0} height={56} tick={<WrappedTick />} />
          <YAxis width={40} tickMargin={8} tick={{ fontSize: 11, fill: "#7f8999" }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#1B75FF" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#1B75FF", strokeWidth: 2 }} isAnimationActive animationDuration={700} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AlertsCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-sm p-5 flex flex-col" style={{ width: 588, height: 336 }}>
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-6">التنبيهات</h3>
      <div className="flex flex-col gap-6 flex-1">
        {itAlerts.map((a) => (
          <div key={a.text} className="bg-[rgba(52,152,219,0.13)] rounded-[10px] h-[66px] px-5 flex flex-col justify-center gap-2 text-right">
            <p className="text-[#052c65] text-[18px] font-semibold">
              <span className="text-[#3498db] text-[20px]">{a.count}</span> {a.text}
            </p>
            <p className="text-muted text-[14px]">{a.time}</p>
          </div>
        ))}
      </div>
      <button type="button" className="flex items-center gap-2 text-[#c89637] text-[14px] self-start cursor-pointer">
        <MoveLeft size={18} />
        عرض جميع التنبيهات
      </button>
    </div>
  );
}

function PendingTasksCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-sm p-5 overflow-hidden" style={{ width: 877, height: 336 }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[20px] font-bold text-[#052c65]">الطلبات و المهام المعلقة</h3>
        <button type="button" className="text-[#0986ed] text-[16px] font-bold cursor-pointer">عرض كل</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#f0f0f0] text-[#1f254b] text-[16px]">
              <th className="py-3 px-4 font-semibold rounded-tr-[17px] whitespace-nowrap">عنوان نموذج البيان</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">نوع الطلب</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
              <th className="py-3 px-4 font-semibold rounded-tl-[17px] whitespace-nowrap">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {pendingTasks.map((t) => (
              <tr key={t.id} className="border-b border-[rgba(18,36,67,0.1)] text-[17px] text-[#052c65]/60">
                <td className="py-4 px-4 whitespace-nowrap">{t.title}</td>
                <td className="py-4 px-4 whitespace-nowrap">{t.type}</td>
                <td className="py-4 px-4"><StatusBadge status={t.status} /></td>
                <td className="py-4 px-4 whitespace-nowrap font-semibold" dir="ltr">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <Layout title="لوحة التحكم">
      <div className="p-8 space-y-[50px]">
        <div className="flex items-center justify-between gap-3 max-w-[1535px]">
          <button
            type="button"
            onClick={() => navigate("/it/forms/new")}
            className="flex items-center gap-3 text-white text-[22px] font-semibold rounded-[12px] h-[56px] px-6 shadow-sm cursor-pointer"
            style={{ background: "linear-gradient(90deg, #003d96 0%, #052c65 100%)" }}
          >
            <Zap size={24} />
            إجراءات سريعة
          </button>
          <button
            type="button"
            className="flex items-center gap-4 bg-[#f9f9f9] rounded-[12px] h-[56px] px-6 text-[18px] text-muted shadow-sm cursor-pointer"
          >
            <Calendar size={24} className="text-[#0986ed]" />
            النصف الأول من عام 2026
            <span className="w-10 h-10 rounded-[12.5px] bg-[rgba(9,134,237,0.15)] flex items-center justify-center">
              <ChevronDown size={20} className="text-[#0986ed]" />
            </span>
          </button>
        </div>

        <div className="flex flex-row-reverse flex-wrap justify-center gap-[44px] max-w-[1535px]">
          {itKpis.map((k) => <KpiCard key={k.label} k={k} />)}
        </div>

        <div className="flex flex-row-reverse gap-[70px] max-w-[1535px]">
          <ChartCard title="توزيع الجهات حسب النوع" defaultType="pie" width={588}>
            {(type) => {
              if (type === "pie") return <PieOrDonutChart data={entityTypeDistribution} />;
              if (type === "donut") {
                return (
                  <PieOrDonutChart
                    data={entityTypeDistribution}
                    donut
                    total={entityTypeDistribution.reduce((s, d) => s + d.value, 0)}
                    showLegend={false}
                  />
                );
              }
              if (type === "line") return <SingleLineChart data={entityTypeDistribution} />;
              if (type === "bar") return <VerticalBarChart data={entityTypeDistribution} />;
              return <HorizontalBarChart data={entityTypeDistribution} domainMax={70} />;
            }}
          </ChartCard>

          <ChartCard title="الإدارات العامة الأعلى فى طلب نماذج البيان" defaultType="bar" width={877}>
            {(type) => {
              const pieData = adminsBarSeries.map((d, i) => ({
                ...d,
                color: ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF", "#C89637", "#052C65"][i % 7],
              }));
              if (type === "pie") return <PieOrDonutChart data={pieData} showLegend={false} />;
              if (type === "donut") {
                return (
                  <PieOrDonutChart
                    data={pieData}
                    donut
                    total={adminsBarSeries.reduce((s, d) => s + d.value, 0)}
                    showLegend={false}
                  />
                );
              }
              if (type === "line") return <SingleLineChart data={adminsBarSeries} />;
              if (type === "bar") return <VerticalBarChart data={adminsBarSeries} />;
              return <HorizontalBarChart data={adminsBarSeries} />;
            }}
          </ChartCard>
        </div>

        <div className="flex flex-row-reverse gap-[70px] max-w-[1535px]">
          <AlertsCard />
          <PendingTasksCard />
        </div>
      </div>
    </Layout>
  );
}
