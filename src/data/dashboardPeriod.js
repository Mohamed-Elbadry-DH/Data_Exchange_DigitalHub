/**
 * Shared mock period scaling for every role dashboard's PeriodButton.
 * Labels must match `PERIOD_OPTIONS` in PeriodButton.jsx.
 */

/** Dramatic enough that switching periods is obvious in the UI */
export const PERIOD_FACTOR = {
  "النصف الأول من عام 2026": 1,
  "النصف الثاني من عام 2025": 0.62,
  "الربع الأول من عام 2026": 0.32,
  "الربع الثاني من عام 2026": 0.48,
  "عام 2025": 1.35,
};

export function periodFactor(period) {
  return PERIOD_FACTOR[period] ?? 1;
}

export function scaleInt(n, factor) {
  return Math.max(0, Math.round(Number(n) * factor));
}

export function scaleDecimal(n, factor, digits = 1) {
  const m = 10 ** digits;
  return Math.round(Number(n) * factor * m) / m;
}

export function scaleKpis(list, factor) {
  return list.map((k) => ({
    ...k,
    value: scaleInt(k.value, factor),
    delta: factor >= 1 ? `+${Math.max(1, Math.round(3 * factor))}%` : `-${Math.max(1, Math.round(3 / Math.max(factor, 0.2)))}%`,
    up: factor >= 0.95,
  }));
}

export function scaleCards(list, factor) {
  return list.map((c) => ({
    ...c,
    value: scaleInt(c.value, factor),
    delta: factor >= 1 ? "+3%" : "-3%",
    up: factor >= 1,
  }));
}

/** Keep pie percentages summing ~100 after scale */
export function scalePiePercents(list, factor) {
  const scaled = list.map((d) => ({ ...d, value: Math.max(1, Math.round(d.value * factor)) }));
  const sum = scaled.reduce((s, d) => s + d.value, 0) || 1;
  return scaled.map((d) => ({ ...d, value: Math.round((d.value / sum) * 100) }));
}

export function scaleValueList(list, factor) {
  return list.map((d) => ({
    ...d,
    value: typeof d.value === "number" && !Number.isInteger(d.value)
      ? scaleDecimal(d.value, factor)
      : scaleInt(d.value, factor),
  }));
}

/** Scale every numeric field except month / labels / colors */
export function scaleMonthlyRows(list, factor) {
  return list.map((row) => {
    const next = { ...row };
    for (const key of Object.keys(row)) {
      if (key === "month" || key === "name" || key === "label") continue;
      if (typeof row[key] === "number") {
        next[key] = Number.isInteger(row[key])
          ? scaleInt(row[key], factor)
          : scaleDecimal(row[key], factor);
      }
    }
    return next;
  });
}
