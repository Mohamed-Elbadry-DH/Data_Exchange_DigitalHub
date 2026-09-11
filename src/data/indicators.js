/**
 * The six-state indicator card sets, shared by every module whose dashboard
 * shows «مؤشرات تبادل نماذج البيان» / «مؤشرات استيفاء البيانات»
 * (general admin `895:2509`, decision maker `649:10179`).
 *
 * The supervisor module keeps its own shorter four-card `exchangeStatusCards`
 * in `./mock`, so these must not move there.
 */

/** مؤشرات تبادل نماذج البيان */
export const exchangeStatusCards = [
  { label: "لم تبدأ بعد", value: 91, delta: "+3%", up: true, icon: "FileText", color: "#0147B2" },
  { label: "قيد التنفيذ", value: 139, delta: "+3%", up: true, icon: "RefreshCw", color: "#FFC107" },
  { label: "تعديل", value: 74, delta: "+3%", up: true, icon: "FilePenLine", color: "#FF8C08" },
  { label: "قيد المراجعة", value: 61, delta: "+3%", up: true, icon: "FileSearch", color: "#9747FF" },
  { label: "المتأخرة", value: 37, delta: "-3%", up: false, icon: "TriangleAlert", color: "#DC2626" },
  { label: "معتمدة", value: 102, delta: "+3%", up: true, icon: "CircleCheckBig", color: "#16A34A" },
];

/** مؤشرات استيفاء البيانات */
export const fulfillmentStatusCards = [
  { label: "لم تبدأ بعد", value: 84, delta: "+3%", up: true, icon: "FileText", color: "#0147B2" },
  { label: "قيد التنفيذ", value: 112, delta: "+3%", up: true, icon: "RefreshCw", color: "#FFC107" },
  { label: "تعديل", value: 68, delta: "+3%", up: true, icon: "FilePenLine", color: "#FF8C08" },
  { label: "قيد المراجعة", value: 53, delta: "+3%", up: true, icon: "FileSearch", color: "#9747FF" },
  { label: "المتأخرة", value: 29, delta: "-3%", up: false, icon: "TriangleAlert", color: "#DC2626" },
  { label: "معتمدة", value: 76, delta: "+3%", up: true, icon: "CircleCheckBig", color: "#16A34A" },
];
