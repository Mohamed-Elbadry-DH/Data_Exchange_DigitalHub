import { Users, Building2, Building, FileText as LucideFileText } from "lucide-react";
import Layout from "../../components/dm/DmLayout";
import PeriodButton from "../../components/PeriodButton";
import { SHELL } from "../../constants/shell";
import StatusCard from "../../components/StatusCard";
import KpiCard from "../../components/KpiCard";
import AlertsCard from "../../components/AlertsCard";
import {
  ChartCard, SwitchableChart, PieOrDonutChart, StatusLineChart,
  VerticalBarChart, HorizontalBarChart,
} from "../../components/charts";
import {
  kpis, exchangeStatusCards, fulfillmentStatusCards, topOrgs, dmAdminsPie,
  dmFulfillmentDonut, dmFulfillmentDonutTotal, dmMonthlyTrend, dmAlerts,
  DM_TREND_KEYS, DM_TREND_COLORS, dmStatusColors,
} from "../../data/mockDm";

/**
 * The status-card icons on this dashboard come from Figma as flat white PNGs,
 * not an outline set — `lucide-react` has no matching glyphs, so each is its
 * own exported asset (`public/dm/status-*.svg`). Wrapped to accept the same
 * `{ size, style }` props `StatusCard` passes to a lucide icon.
 */
function statusIcon(src, alt) {
  return function StatusIcon({ size = 20, style }) {
    return <img src={src} alt={alt} width={size} height={size} style={style} />;
  };
}

const FileTextIcon = statusIcon("/dm/status-not-started.svg", "لم تبدأ بعد");
const RefreshCwIcon = statusIcon("/dm/status-in-progress.svg", "قيد التنفيذ");
const FilePenLineIcon = statusIcon("/dm/status-edit.svg", "تعديل");
const FileSearchIcon = statusIcon("/dm/status-review.svg", "قيد المراجعة");
const TriangleAlertIcon = statusIcon("/dm/status-late.svg", "المتأخرة");
const CircleCheckBigIcon = statusIcon("/dm/status-approved.svg", "معتمدة");

/** مؤشرات عامة — lucide, unchanged */
const ICONS = { Users, Building2, Building, FileText: LucideFileText };

/** مؤشرات تبادل نماذج البيان / استيفاء البيانات — the exported Figma assets above */
const STATUS_ICONS = {
  FileText: FileTextIcon,
  CircleCheckBig: CircleCheckBigIcon,
  FilePenLine: FilePenLineIcon,
  TriangleAlert: TriangleAlertIcon,
  FileSearch: FileSearchIcon,
  RefreshCw: RefreshCwIcon,
};

/**
 * Figma `649:10179` spacing: every section is 1535.5 wide, separated by a
 * uniform 50px (`space-y-[50px]` on the page), and both chart rows are 412 tall.
 * Cards are given the same height so no row carries dead space.
 */
const CHART_H = 412;

/** Widest «أعلى 5 جهات» label needs room to render in full on the y axis */
const ORG_AXIS_W = 250;

/**
 * The vertical-bar view gives each org only a slice of the width, so its x
 * ticks wrap onto up to three short lines instead of overlapping.
 */
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

/** اتجاه نماذج البيان — pie/donut fallbacks aggregate the two series */
const trendAsCategorical = DM_TREND_KEYS.map((k) => ({
  name: k,
  value: dmMonthlyTrend.reduce((s, d) => s + d[k], 0),
  color: DM_TREND_COLORS[k],
}));

/** لوحة تحكم صانع القرار — Figma 649:10179 */
export default function Dashboard() {
  const topOrgsColored = topOrgs.map((o, i) => ({
    name: o.name,
    value: o.value,
    color: ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF"][i],
  }));

  return (
    <Layout title="لوحة التحكم">
      <div className="p-4 sm:p-6 xl:p-8 space-y-[50px]">
        {/*
          Not `PageToolbar` — that caps at SHELL.contentMax, and this dashboard
          spans the full content area. `justify-end` puts the lone control on
          the left in RTL, aligned with the sections below.
        */}
        <div className="flex w-full items-center justify-end" style={{ minHeight: SHELL.navItemH }}>
          <PeriodButton />
        </div>

        <div className="w-full">
          <h2 className="text-[20px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات عامة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpis.map((k) => <KpiCard key={k.label} k={k} icons={ICONS} fluid />)}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-[50px]">
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات تبادل نماذج البيان</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {exchangeStatusCards.map((c) => <StatusCard key={c.label} c={c} icons={STATUS_ICONS} />)}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] mb-4 text-right">مؤشرات استيفاء البيانات</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {fulfillmentStatusCards.map((c) => <StatusCard key={c.label} c={c} icons={STATUS_ICONS} />)}
            </div>
          </div>
        </div>

        {/* 665fr / 840fr keeps the Figma ratio while both cards stay fluid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[665fr_840fr] gap-[30px]">
          <div className="min-w-0 flex">
            <ChartCard title="أعلى 5 جهات من حيث نسبة الألتزام" defaultType="hbar" height={CHART_H}>
              {(type) => (
                <SwitchableChart
                  type={type}
                  categorical={topOrgsColored}
                  pieSuffix=""
                  donutSuffix=""
                  hbarDomain={100}
                  hbarYAxisWidth={ORG_AXIS_W}
                  xTick={WrappedTick}
                />
              )}
            </ChartCard>
          </div>

          <div className="min-w-0 flex">
            <ChartCard title="اتجاه نماذج البيان خلال الأشهر" defaultType="line" height={CHART_H}>
              {(type) => {
                if (type === "pie" || type === "donut") {
                  return (
                    <PieOrDonutChart
                      data={trendAsCategorical}
                      donut={type === "donut"}
                      showLegend={type === "pie"}
                      total={trendAsCategorical.reduce((s, d) => s + d.value, 0)}
                      valueSuffix=""
                    />
                  );
                }
                if (type === "line") {
                  return (
                    <StatusLineChart
                      data={dmMonthlyTrend}
                      seriesKeys={DM_TREND_KEYS}
                      colors={DM_TREND_COLORS}
                      showLegend
                    />
                  );
                }
                if (type === "bar") {
                  return <VerticalBarChart data={trendAsCategorical} colored />;
                }
                return <HorizontalBarChart data={trendAsCategorical} domainMax={800} showLabels yAxisWidth={120} />;
              }}
            </ChartCard>
          </div>
        </div>

        {/* 612fr / 458fr / 425fr keeps the Figma ratio; stacks below xl */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[612fr_458fr_425fr] gap-[20px]">
          <div className="min-w-0 flex">
            <ChartCard title="توزيع نماذج البيان حسب الإدارات" defaultType="pie" height={CHART_H}>
              {(type) => (
                <SwitchableChart
                  type={type}
                  categorical={dmAdminsPie}
                  pieSuffix="%"
                  donutSuffix="%"
                  hbarDomain={70}
                />
              )}
            </ChartCard>
          </div>

          <div className="min-w-0 flex">
            <ChartCard title="حالات استيفاء البيانات" defaultType="donut" height={CHART_H}>
              {(type) => (
                <SwitchableChart
                  type={type}
                  categorical={dmFulfillmentDonut}
                  monthlySeries={dmMonthlyTrend}
                  lineColors={dmStatusColors}
                  pieSuffix=""
                  donutTotal={dmFulfillmentDonutTotal}
                  donutSuffix=""
                  hbarDomain={100}
                />
              )}
            </ChartCard>
          </div>

          <div className="flex-1 min-w-0 flex">
            <AlertsCard alerts={dmAlerts} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
