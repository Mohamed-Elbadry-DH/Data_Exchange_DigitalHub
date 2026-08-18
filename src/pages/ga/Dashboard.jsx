import { useRef, useState } from "react";
import {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert,
  FileSearch, RefreshCw, Plus,
} from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import CreateStatementModal from "../../components/ga/CreateStatementModal";
import PageToolbar from "../../components/PageToolbar";
import PeriodButton from "../../components/PeriodButton";
import StatusCard from "../../components/StatusCard";
import { SHELL } from "../../constants/shell";
import {
  ChartCard, SwitchableChart, PieOrDonutChart, StatusLineChart,
  SingleLineChart, VerticalBarChart, HorizontalBarChart,
} from "../../components/charts";
import {
  kpis, exchangeStatusCards, fulfillmentStatusCards, gaStatusPie,
  gaStatusDonut, gaStatusDonutTotal, gaMonthlyCompleted, gaStatusMonthly, topOrgs,
} from "../../data/mockGa";

const ICONS = {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert, FileSearch, RefreshCw,
};

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
        className={`relative ${createOpen ? "overflow-hidden" : "min-h-full"}`}
        style={createOpen ? { height: `calc(100dvh - ${SHELL.headerHeight}px)` } : undefined}
      >
        <div className="p-8 space-y-[50px]">
        <PageToolbar>
          <button
            ref={createBtnRef}
            type="button"
            onClick={() => setCreateOpen(true)}
            style={{ height: SHELL.navItemH }}
            className="flex items-center gap-2 bg-[#052C65] text-white text-[16px] font-bold rounded-[12px] px-[20px] shadow-sm cursor-pointer"
            aria-label="إنشاء طلب نموذج بيان"
          >
            <Plus size={16} strokeWidth={2.5} />
            إنشاء طلب نموذج بيان
          </button>
          <PeriodButton />
        </PageToolbar>

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
              {exchangeStatusCards.map((c, i) => <StatusCard key={i} c={c} icons={ICONS} />)}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات اعتماد البيانات</h2>
            <div className="grid grid-cols-3 gap-5">
              {fulfillmentStatusCards.map((c, i) => <StatusCard key={i} c={c} icons={ICONS} />)}
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
                lineColors={STATUS_COLORS}
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
                lineColors={STATUS_COLORS}
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
