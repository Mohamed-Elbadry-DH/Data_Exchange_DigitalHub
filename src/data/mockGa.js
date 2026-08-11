/**
 * Data source for the general admin module (`/ga`).
 *
 * Starts as a mirror of the supervisor mock. To diverge, declare the export
 * locally in this file — an explicit export takes precedence over `export *`,
 * so only the general admin pages see the new value.
 *
 * Only override presentation data here (KPI labels, chart series, column sets).
 * Business data both modules act on — requests, notes, users, workflow stages —
 * stays single-sourced (`./mock` and `src/domain/*`), otherwise the two modules
 * end up disagreeing about the same request.
 */
export * from "./mock";
