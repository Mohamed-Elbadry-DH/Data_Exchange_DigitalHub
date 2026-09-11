import PieOrDonutChart from "./PieOrDonutChart";
import { StatusLineChart, SingleLineChart, VerticalBarChart, HorizontalBarChart } from "./series";

export default function SwitchableChart({
  type,
  categorical,
  monthlySeries,
  singleMonthly,
  pieTotal = null,
  pieSuffix = "%",
  donutTotal = null,
  donutSuffix = "",
  hbarDomain = 100,
  lineColors,
  lineKeys,
  showLineLegend = false,
  xTick,
  formatYName,
  hbarYAxisWidth,
}) {
  const rows = Array.isArray(categorical) ? categorical : [];

  if (type === "pie") {
    return <PieOrDonutChart data={rows} donut={false} showLegend valueSuffix={pieSuffix} />;
  }
  if (type === "donut") {
    // rounded: decimal series (e.g. نسب الألتزام) otherwise surface float error
    const sum = Math.round(rows.reduce((s, d) => s + Number(d.value || 0), 0));
    return (
      <PieOrDonutChart
        data={rows}
        donut
        total={donutTotal ?? pieTotal ?? sum}
        showLegend={false}
        valueSuffix={donutSuffix || pieSuffix}
      />
    );
  }
  if (type === "line") {
    if (monthlySeries) {
      return (
        <StatusLineChart
          data={monthlySeries}
          seriesKeys={lineKeys}
          colors={lineColors}
          showLegend={showLineLegend}
        />
      );
    }
    const lineRows = singleMonthly || rows.map((d) => ({ month: d.name, value: d.value }));
    return <SingleLineChart data={lineRows} />;
  }
  if (type === "bar") {
    return <VerticalBarChart data={rows} colored={Boolean(rows[0]?.color)} xTick={xTick} />;
  }
  return (
    <HorizontalBarChart
      data={rows}
      domainMax={hbarDomain}
      showLabels
      formatName={formatYName}
      yAxisWidth={hbarYAxisWidth}
    />
  );
}
