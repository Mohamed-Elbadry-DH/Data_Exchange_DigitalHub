import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LabelList,
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
  const sx = cx + (outerRadius + 2) * cos;
  const sy = cy + (outerRadius + 2) * sin;
  const mx = cx + (outerRadius + 22) * cos;
  const my = cy + (outerRadius + 22) * sin;
  const isRight = cos >= 0;
  const ex = mx + (isRight ? 18 : -18);
  const ey = my;
  const textAnchor = isRight ? "start" : "end";
  const textX = ex + (isRight ? 8 : -8);

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={2.5} fill={fill} />
      <text x={textX} y={ey - 6} textAnchor={textAnchor} fill="#404040" fontSize={13}>
        {name}
      </text>
      <text x={textX} y={ey + 12} textAnchor={textAnchor} fill={fill} fontSize={14} fontWeight={700}>
        {Number(value).toFixed(2)}
      </text>
    </g>
  );
}

function ChartCard({ title, icons, children }) {
  const [activeChart, setActiveChart] = useState(0);
  const frameWidth = icons.length >= 5 ? 217 : icons.length >= 4 ? 180 : undefined;

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
          {icons.map((I, i) => {
            const isActive = activeChart === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveChart(i)}
                aria-label={`نوع الرسم ${i + 1}`}
                aria-pressed={isActive}
                className="w-[26px] h-[26px] rounded flex items-center justify-center transition-colors"
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
      <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
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
          <ChartCard title="توزيع نماذج البيان حسب حالة الاعتماد" icons={[ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon]}>
            <div className="flex items-center justify-between gap-6" dir="ltr">
              <div className="shrink-0" style={{ width: 243, height: 243, marginLeft: 48 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={approvalPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={118}
                      paddingAngle={2}
                      isAnimationActive
                      animationBegin={0}
                      animationDuration={900}
                      animationEasing="ease-out"
                    >
                      {approvalPie.map((e, i) => (
                        <Cell key={i} fill={e.color} stroke="#fff" strokeWidth={1} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-3 me-4" dir="rtl">
                {approvalPie.map((e) => (
                  <li key={e.name} className="flex items-center gap-2 text-[14px] text-[#404040]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                    <span className="flex items-center gap-2">
                      <span>{e.name}</span>
                      <span>{e.value}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>

          <ChartCard title="الطلبات المعتمدة شهرياً" icons={[ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon]}>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyApproved} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7f8999" }} />
                  <YAxis
                    width={40}
                    tickMargin={8}
                    tick={{ fontSize: 11, fill: "#7f8999", dx: -14 }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1B75FF" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#1B75FF", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="w-full max-w-[1535.5px] h-[345px] flex flex-row-reverse gap-[63px]">
          <ChartCard title="توزيع البيانات حسب الحالة" icons={[ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon]}>
            <div className="relative w-full h-full mx-auto" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDonut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={120}
                    paddingAngle={2}
                    isAnimationActive
                    animationBegin={0}
                    animationDuration={900}
                    animationEasing="ease-out"
                    labelLine={false}
                    label={(props) => (
                      <DonutCalloutLabel
                        {...props}
                        name={props.name}
                        value={props.value}
                        fill={props.fill || statusDonut[props.index]?.color}
                      />
                    )}
                  >
                    {statusDonut.map((e, i) => (
                      <Cell key={i} fill={e.color} stroke="#fff" strokeWidth={1} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-[rgba(0,0,0,0.9)]">{statusDonutTotal}</span>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="أعلى 5 جهات معتمد لها نماذج بيان" icons={[ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon]}>
            <div className="w-full h-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topOrgs}
                  layout="vertical"
                  margin={{ top: 8, right: 40, left: 4, bottom: 8 }}
                  barCategoryGap="22%"
                >
                  <CartesianGrid
                    horizontal={true}
                    vertical={true}
                    stroke="#E5E7EB"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tick={{ fontSize: 12, fill: "#7f8999" }}
                    axisLine={{ stroke: "#CBD5E1" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={200}
                    tickLine={false}
                    axisLine={{ stroke: "#CBD5E1" }}
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fill: "#404040",
                      width: 190,
                    }}
                  />
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(2)}`, ""]} />
                  <Bar
                    dataKey="value"
                    fill="#1B75FF"
                    barSize={22}
                    radius={[0, 8, 8, 0]}
                    background={{ fill: "#E8F1FF", radius: [0, 8, 8, 0] }}
                    isAnimationActive
                    animationBegin={0}
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v) => Number(v).toFixed(2)}
                      style={{ fill: "#7f8999", fontSize: 12, fontWeight: 500 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </Layout>
  );
}
