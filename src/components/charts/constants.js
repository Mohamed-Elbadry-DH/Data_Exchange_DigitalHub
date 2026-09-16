import {
  ChartPieIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon, LifeBuoyIcon,
} from "../ChartTypeIcons";

export const CHART_TYPES = ["pie", "donut", "line", "bar", "hbar"];
export const CHART_TYPE_ICONS = [ChartPieIcon, LifeBuoyIcon, ChartLineIcon, ChartColumnIcon, ChartBarIcon];
export const CHART_TYPE_LABELS = ["دائري", "دونات", "خطي", "أعمدة", "أفقي"];

export const DEFAULT_STATUS_COLORS = {
  "قيد الاعتماد": "#1B75FF",
  "لم تبدأ بعد": "#1B75FF",
  "قيد التنفيذ": "#FFC107",
  "قيد المراجعة": "#9747FF",
  تعديل: "#FF8C08",
  المتأخرة: "#DC2626",
  معتمدة: "#16A34A",
};

export const CHART_SLICE_COLORS = ["#1B75FF", "#0986ED", "#16A34A", "#FF8C08", "#9747FF", "#C89637", "#052C65"];

export function withSliceColors(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row, i) => ({
    ...row,
    color: row.color || CHART_SLICE_COLORS[i % CHART_SLICE_COLORS.length],
  }));
}
