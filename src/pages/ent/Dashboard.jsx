import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText, Building, FileSearch, FilePenLine, TriangleAlert, CircleCheckBig,
} from "lucide-react";
import Layout from "../../components/ent/EntLayout";
import PeriodButton, { PERIOD_OPTIONS } from "../../components/PeriodButton";
import StatusCard from "../../components/StatusCard";
import { SHELL } from "../../constants/shell";
import {
  ChartCard, SwitchableChart, PieOrDonutChart, StatusLineChart,
  VerticalBarChart, HorizontalBarChart,
} from "../../components/charts";
import {
  entStatusCards as baseStatusCards,
  entStatusDonut as baseStatusDonut,
  entTopAdmins as baseTopAdmins,
  entMonthlyTrend as baseMonthlyTrend,
  entUrgentAlerts, ENT_TREND_KEYS, ENT_TREND_COLORS,
} from "../../data/mockEnt";
import {
  periodFactor, scaleCards, scaleValueList, scaleMonthlyRows, scalePiePercents,
} from "../../data/dashboardPeriod";

const ICONS = { FileText, Building, FileSearch, FilePenLine, TriangleAlert, CircleCheckBig };

const CHART_H = 345;

/** أسماء الإدارات أطول من أن تُعرض كاملة على محور الرسم */
function shortAdmin(name) {
  return name.replace("الادارة العامة لاحصاءات ", "");
}


/** تنبيهات عاجلة — Figma 1702:7888 */
function UrgentAlertsCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-sm overflow-hidden flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
        <h3 className="text-[20px] font-bold text-[#052c65]">تنبيهات عاجلة</h3>
        <Link to="/ent/required" className="text-[#0986ed] text-[16px] font-bold hover:underline">
          عرض كل
        </Link>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <ul className="flex flex-col">
          {entUrgentAlerts.map((a) => (
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

/** لوحة تحكم موظف الجهة الخارجية — Figma 1702:7443 */
export default function Dashboard() {
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0]);
  const dash = useMemo(() => {
    const factor = periodFactor(period);
    const entStatusDonut = scalePiePercents(baseStatusDonut, factor);
    const entTopAdmins = scaleValueList(baseTopAdmins, factor);
    return {
      entStatusCards: scaleCards(baseStatusCards, factor),
      entStatusDonut,
      entStatusDonutTotal: entStatusDonut.reduce((s, d) => s + d.value, 0),
      entTopAdmins,
      entMonthlyTrend: scaleMonthlyRows(baseMonthlyTrend, factor),
    };
  }, [period]);

  const { entStatusCards, entStatusDonut, entStatusDonutTotal, entTopAdmins, entMonthlyTrend } = dash;
  const topAdminsShort = entTopAdmins.map((a, i) => ({
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
          {entStatusCards.map((c) => <StatusCard key={c.label} c={c} icons={ICONS} />)}
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[30px]">
          <div className="min-w-0 flex" style={{ height: CHART_H }}>
            <ChartCard title="نسبة الإنجاز لأعلى 5 إدارات" defaultType="bar" height={CHART_H}>
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
                  categorical={entStatusDonut}
                  pieSuffix="%"
                  donutTotal={entStatusDonutTotal}
                  donutSuffix=""
                  hbarDomain={70}
                />
              )}
            </ChartCard>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[30px]">
          <div className="min-w-0 flex" style={{ height: CHART_H }}>
            <ChartCard title="البيانات المطلوبة شهرياً" defaultType="line" height={CHART_H}>
              {(type) => {
                const asCategorical = ENT_TREND_KEYS.map((k) => ({
                  name: k,
                  value: entMonthlyTrend.reduce((s, d) => s + d[k], 0),
                  color: ENT_TREND_COLORS[k],
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
                      data={entMonthlyTrend}
                      seriesKeys={ENT_TREND_KEYS}
                      colors={ENT_TREND_COLORS}
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
