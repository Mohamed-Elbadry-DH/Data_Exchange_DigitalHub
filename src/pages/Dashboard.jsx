import { useState } from "react";
import {
  Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert,
  FileSearch,
} from "lucide-react";
import Layout from "../components/Layout";
import PageToolbar from "../components/PageToolbar";
import PeriodButton from "../components/PeriodButton";
import StatusCard from "../components/StatusCard";
import {
  ChartCard, SwitchableChart, PieOrDonutChart, StatusLineChart,
  SingleLineChart, VerticalBarChart, HorizontalBarChart,
} from "../components/charts";
import {
  kpis, approvalStatusCards, exchangeStatusCards, approvalPie, monthlyApproved,
  statusDonut, statusDonutTotal, topOrgs,
} from "../data/mock";

const ICONS = { Users, Building2, FileText, CircleCheckBig, FilePenLine, TriangleAlert, FileSearch };

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
    <div className="card-hover bg-white rounded-2xl p-4 w-[24%] max-w-[300px] min-w-0 shadow-sm">
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


export default function Dashboard() {
  const topOrgsPie = topOrgs.map((o, i) => ({
    name: shortOrgName(o.name),
    value: o.value,
    color: ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF"][i],
  }));

  return (
    <Layout title="لوحة التحكم">
      <div className="page-shell space-y-8 xl:space-y-[50px]">
        <PageToolbar>
          <span />
          <PeriodButton />
        </PageToolbar>

        <div>
          <h2 className="text-[20px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات عامة</h2>
          <div className="flex flex-wrap justify-center gap-5">
            {kpis.map((k) => <KpiCard key={k.label + k.value} k={k} />)}
          </div>
        </div>

        <div className=" w-full grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-[50px]">
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات تبادل نماذج البيان</h2>
            <div className="grid grid-cols-4 gap-3">
              {exchangeStatusCards.map((c, i) => <StatusCard key={i} c={c} icons={ICONS} />)}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات اعتماد البيانات</h2>
            <div className="grid grid-cols-4 gap-3">
              {approvalStatusCards.map((c, i) => <StatusCard key={i} c={c} icons={ICONS} />)}
            </div>
          </div>
        </div>

        <div className=" w-full flex flex-row-reverse flex-wrap gap-8 xl:gap-[50px]">
          <ChartCard title="توزيع نماذج البيان حسب حالة الاعتماد" defaultType="pie">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={approvalPie}
                monthlySeries={approvalStatusMonthly}
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
                  yAxisWidth={58}
                />
              );
            }}
          </ChartCard>
        </div>

        <div className=" w-full flex flex-row-reverse flex-wrap gap-8 xl:gap-[50px]">
          <ChartCard title="توزيع البيانات حسب الحالة" defaultType="donut">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={statusDonut}
                monthlySeries={exchangeStatusMonthly}
                pieSuffix=""
                donutTotal={statusDonutTotal}
                donutSuffix=""
                hbarDomain={50}
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
    </Layout>
  );
}
