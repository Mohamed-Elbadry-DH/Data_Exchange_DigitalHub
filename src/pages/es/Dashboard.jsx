import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/es/EsLayout";
import PeriodButton, { PERIOD_OPTIONS } from "../../components/PeriodButton";
import StatusCard from "../../components/StatusCard";
import { SHELL } from "../../constants/shell";
import {
  ChartCard, SwitchableChart, PieOrDonutChart, StatusLineChart,
  VerticalBarChart, HorizontalBarChart,
} from "../../components/charts";
import {
  esStatusCards as baseStatusCards,
  esStatusDonut as baseStatusDonut,
  esTopAdmins as baseTopAdmins,
  esMonthlyTrend as baseMonthlyTrend,
  esUrgentAlerts, ES_TREND_KEYS, ES_TREND_COLORS,
} from "../../data/mockEs";
import {
  periodFactor, scaleCards, scaleValueList, scaleMonthlyRows,
} from "../../data/dashboardPeriod";

/**
 * KPI icons from Figma 1689:1984 — white glyphs on colored tile
 * (same StatusCard contract as lucide: `{ size, style }`).
 */
function kpiIcon(src, alt) {
  return function KpiIcon({ size = 22 }) {
    return (
      <span className="relative shrink-0 overflow-hidden" style={{ width: size, height: size }} aria-hidden>
        <img src={src} alt={alt} className="absolute inset-0 size-full max-w-none object-contain" />
      </span>
    );
  };
}

const ICONS = {
  FileText: kpiIcon("/es/kpi-required.svg", "البيانات المطلوبة"),
  Building: kpiIcon("/es/kpi-admins.svg", "الإدارات العامة"),
  Users: kpiIcon("/es/kpi-users.svg", "المستخدمين"),
  FileSearch: kpiIcon("/es/kpi-approval.svg", "قيد الاعتماد"),
  CircleCheckBig: kpiIcon("/es/kpi-approved.svg", "معتمدة"),
  FilePenLine: kpiIcon("/es/kpi-edit.svg", "مطلوب تعديل"),
  TriangleAlert: kpiIcon("/es/kpi-late.svg", "متأخرة"),
};

const CHART_H = 345;

function shortAdmin(name) {
  return name.replace("الادارة العامة لاحصاءات ", "");
}

/** بيانات تحتاج مراجعة عاجلة — Figma 1689:1984 */
function UrgentAlertsCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-sm overflow-hidden flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
        <h3 className="text-[20px] font-bold text-[#052c65]">بيانات تحتاج مراجعة عاجلة</h3>
        <Link to="/es/required" className="text-[#0986ed] text-[16px] font-bold hover:underline">
          عرض كل
        </Link>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <ul className="flex flex-col">
          {esUrgentAlerts.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-5 border border-[rgba(18,36,67,0.1)] px-4 py-3 first:rounded-t-[17px] last:rounded-b-[17px] -mt-px first:mt-0"
              dir="rtl"
            >
              <div className="min-w-0 flex-1 text-right">
                <div className="text-[15px] font-semibold text-[#052c65] truncate">{a.title}</div>
                <div className="text-[13px] text-muted truncate">{a.org}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[12px] text-muted">تاريخ الاستحقاق</div>
                <div className="text-[13px] text-[#052c65]" dir="ltr">{a.due}</div>
              </div>
              <span
                className="text-[13px] font-semibold whitespace-nowrap shrink-0 rounded-[8px] px-3 py-1.5"
                style={
                  a.late
                    ? { color: "#DC2626", background: "rgba(220,38,38,0.10)" }
                    : { color: "#C89637", background: "rgba(255,193,7,0.16)" }
                }
              >
                {a.note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** لوحة تحكم مشرف الجهة الخارجية — Figma 1689:1984 */
export default function Dashboard() {
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0]);
  const dash = useMemo(() => {
    const factor = periodFactor(period);
    const esStatusDonut = scaleValueList(baseStatusDonut, factor);
    const esTopAdmins = scaleValueList(baseTopAdmins, factor);
    return {
      esStatusCards: scaleCards(baseStatusCards, factor),
      esStatusDonut,
      esStatusDonutTotal: esStatusDonut.reduce((s, d) => s + d.value, 0),
      esTopAdmins,
      esMonthlyTrend: scaleMonthlyRows(baseMonthlyTrend, factor),
    };
  }, [period]);

  const { esStatusCards, esStatusDonut, esStatusDonutTotal, esTopAdmins, esMonthlyTrend } = dash;
  const topAdminsShort = esTopAdmins.map((a, i) => ({
    name: shortAdmin(a.name),
    value: a.value,
    color: ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF"][i],
  }));

  return (
    <Layout title="لوحة التحكم">
      <div className="page-shell space-y-8 xl:space-y-[40px]">
        <div className="flex w-full items-center justify-end" style={{ minHeight: SHELL.navItemH }}>
          <PeriodButton label={period} onChange={setPeriod} />
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5">
          {esStatusCards.map((c) => <StatusCard key={c.label} c={c} icons={ICONS} />)}
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[30px]">
          <div className="min-w-0 flex" style={{ height: CHART_H }}>
            <ChartCard title="نسبة الإنجاز لأعلى 5 إدارات" defaultType="hbar" height={CHART_H}>
              {(type) => (
                <SwitchableChart
                  type={type}
                  categorical={topAdminsShort}
                  pieSuffix="%"
                  donutSuffix="%"
                  hbarDomain={100}
                  hbarYAxisWidth={150}
                />
              )}
            </ChartCard>
          </div>

          <div className="min-w-0 flex" style={{ height: CHART_H }}>
            <ChartCard title="توزيع البيانات حسب الحالة" defaultType="donut" height={CHART_H}>
              {(type) => (
                <SwitchableChart
                  type={type}
                  categorical={esStatusDonut}
                  pieSuffix=""
                  donutTotal={esStatusDonutTotal}
                  donutSuffix=""
                  hbarDomain={100}
                />
              )}
            </ChartCard>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[30px]">
          <div className="min-w-0 flex" style={{ height: CHART_H }}>
            <ChartCard title="البيانات المطلوبة شهرياً" defaultType="line" height={CHART_H}>
              {(type) => {
                const asCategorical = ES_TREND_KEYS.map((k) => ({
                  name: k,
                  value: esMonthlyTrend.reduce((s, d) => s + d[k], 0),
                  color: ES_TREND_COLORS[k],
                }));
                if (type === "pie" || type === "donut") {
                  return (
                    <PieOrDonutChart
                      data={asCategorical}
                      donut={type === "donut"}
                      showLegend={type === "pie"}
                      total={asCategorical.reduce((s, d) => s + d.value, 0)}
                      valueSuffix=""
                    />
                  );
                }
                if (type === "line") {
                  return (
                    <StatusLineChart
                      data={esMonthlyTrend}
                      seriesKeys={ES_TREND_KEYS}
                      colors={ES_TREND_COLORS}
                      showLegend
                    />
                  );
                }
                if (type === "bar") return <VerticalBarChart data={asCategorical} colored />;
                return <HorizontalBarChart data={asCategorical} domainMax={1000} showLabels yAxisWidth={90} />;
              }}
            </ChartCard>
          </div>

          <div className="min-w-0" style={{ height: CHART_H }}>
            <UrgentAlertsCard />
          </div>
        </div>
      </div>
    </Layout>
  );
}
