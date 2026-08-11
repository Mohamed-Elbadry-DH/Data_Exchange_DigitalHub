import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LabelList,
} from "recharts";
import {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert,
  FileSearch, ChevronDown, Calendar, PieChart as PieIcon, LineChart as LineIcon,
  BarChart3, List,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  kpis, approvalStatusCards, exchangeStatusCards, approvalPie, monthlyApproved,
  statusDonut, statusDonutTotal, topOrgs,
} from "../data/mock";

const ICONS = { Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert, FileSearch };

function KpiCard({ k }) {
  const Icon = ICONS[k.icon];
  return (
    <div className="bg-white rounded-2xl p-4 w-[24%] max-w-[300px] min-w-0 flex flex-col shadow-sm">
      <div className="flex items-start justify-between gap-3 text-right">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: k.dark ? "#F8F9FA" : k.color }}
        >
          <Icon size={22} className={k.dark ? "text-[#c89637]" : "text-white"} />
        </div>
        <div className="text-3xl font-bold leading-none text-[rgba(0,0,0,0.9)] pt-2">{k.value}</div>
      </div>
      <div className="text-[15px] text-[#404040] mt-3 text-right">{k.label}</div>
      <div className={`text-[12px] mt-2 text-right ${k.up ? "text-success" : "text-danger"}`}>{k.delta} عن الربع السابق</div>
    </div>
  );
}

function StatusCard({ c }) {
  const Icon = ICONS[c.icon];
  return (
    <div className="bg-white rounded-2xl p-4 min-w-0 min-h-[158px] shadow-sm">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: `${c.color}1A` }}>
        <Icon size={20} style={{ color: c.color }} />
      </div>
      <div className="text-2xl font-bold text-[rgba(0,0,0,0.9)]">{c.value}</div>
      <div className="text-[14px] text-[#404040] mt-1">{c.label}</div>
      <div className={`text-[12px] mt-1 ${c.up ? "text-success" : "text-danger"}`}>{c.delta} عن الربع السابق</div>
    </div>
  );
}

function ChartCard({ title, icons, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 min-w-[420px] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[17px] font-bold text-[rgba(0,0,0,0.9)]">{title}</h3>
        <div className="flex gap-1 text-muted">
          {icons.map((I, i) => (
            <button key={i} className="w-7 h-7 rounded hover:bg-page flex items-center justify-center">
              <I size={15} />
            </button>
          ))}
        </div>
      </div>
      {children}
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

        <div className="flex gap-8 flex-wrap">
          <div className="flex-1 min-w-[420px]">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات تبادل نماذج البيان</h2>
            <div className="grid grid-cols-4 gap-4">
              {exchangeStatusCards.map((c, i) => <StatusCard key={i} c={c} />)}
            </div>
          </div>
          <div className="flex-1 min-w-[420px]">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات اعتماد البيانات</h2>
            <div className="grid grid-cols-4 gap-4">
              {approvalStatusCards.map((c, i) => <StatusCard key={i} c={c} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse gap-6 flex-wrap">
          <ChartCard title="توزيع نماذج البيان حسب حالة الاعتماد" icons={[PieIcon, LineIcon, BarChart3, List]}>
            <div className="flex items-center gap-4">
              <div style={{ width: 220, height: 220, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={approvalPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={0} outerRadius={100} paddingAngle={1} isAnimationActive={false}>
                      {approvalPie.map((e, i) => <Cell key={i} fill={e.color} stroke="#fff" strokeWidth={1} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2.5">
                {approvalPie.map((e) => (
                  <li key={e.name} className="flex items-center gap-2 text-[14px] text-[#404040]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                    {e.name}
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>

          <ChartCard title="الطلبات المعتمدة شهرياً" icons={[LineIcon, BarChart3, PieIcon, List]}>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyApproved} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7f8999" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#7f8999" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1B75FF" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#1B75FF", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="flex flex-row-reverse gap-6 flex-wrap">
          <ChartCard title="توزيع البيانات حسب الحالة" icons={[PieIcon, BarChart3, List]}>
            <div className="flex items-center gap-4">
              <div style={{ width: 220, height: 220, position: "relative", flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={1} isAnimationActive={false}>
                      {statusDonut.map((e, i) => <Cell key={i} fill={e.color} stroke="#fff" strokeWidth={1} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-[rgba(0,0,0,0.9)]">{statusDonutTotal}</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {statusDonut.map((e) => (
                  <li key={e.name} className="flex items-center gap-2 text-[14px] text-[#404040]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                    {e.name}
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>

          <ChartCard title="أعلى 5 جهات معتمد لها نماذج بيان" icons={[BarChart3, List]}>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart
                  data={topOrgs}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                  barCategoryGap={14}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={290}
                    tickLine={false}
                    axisLine={false}
                    orientation="right"
                    tick={({ x, y, payload }) => {
                      const o = topOrgs.find((t) => t.name === payload.value);
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={4} textAnchor="end" fontSize={13} fill="#404040">
                            {payload.value}
                          </text>
                          <circle cx={265} cy={0} r={9} fill="#1B75FF" />
                          <text x={265} y={4} textAnchor="middle" fontSize={10} fill="#fff" fontWeight="bold">
                            {o?.rank}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <Tooltip formatter={(v) => v.toLocaleString()} />
                  <Bar dataKey="value" fill="#1B75FF" radius={[6, 6, 6, 6]} barSize={7}>
                    <LabelList dataKey="value" position="left" formatter={(v) => v.toLocaleString()} fontSize={12} fill="#7f8999" />
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
