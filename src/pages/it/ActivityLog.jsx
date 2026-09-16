import { useMemo, useState } from "react";
import ItListPage from "../../components/it/ItListPage";
import { activityLog } from "../../data/mockIt";
import { downloadCsv } from "./exportDownload";

const ACTION_CHIP = {
  ربط: { bg: "rgba(52,152,219,0.1)", fg: "#0986ed" },
  اعتماد: { bg: "rgba(22,163,74,0.1)", fg: "#16a34a" },
  إنشاء: { bg: "rgba(1,71,178,0.1)", fg: "#0147b2" },
};

function ActionTypeChip({ type }) {
  const s = ACTION_CHIP[type] || { bg: "rgba(5,44,101,0.08)", fg: "#052c65" };
  return (
    <span
      className="inline-flex items-center justify-center h-8 min-w-[74px] px-3 rounded-[15px] text-[17px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {type}
    </span>
  );
}

const COLUMNS = [
  {
    key: "datetime",
    label: "التاريخ والوقت",
    className: "text-right",
    render: (r) => (
      <span className="text-[17px] font-semibold text-[#052c65] opacity-60">{r.datetime}</span>
    ),
  },
  {
    key: "user",
    label: "المستخدم",
    render: (r) => (
      <div className="leading-[20px]">
        <div className="text-[17px] font-semibold text-[#052c65]">{r.user}</div>
        <div className="text-[14px] font-normal text-[rgba(5,44,101,0.6)]" dir="ltr">{r.userSubRole}</div>
      </div>
    ),
  },
  {
    key: "actionType",
    label: "نوع الإجراء",
    render: (r) => <ActionTypeChip type={r.actionType} />,
  },
  {
    key: "org",
    label: "الجهة / الإدارة المرتبطة",
    className: "text-right",
    render: (r) => (
      <span className="text-[17px] font-semibold text-[#052c65]">{r.org}</span>
    ),
  },
  {
    key: "details",
    label: "التفاصيل",
    className: "text-right",
    render: (r) => (
      <span className="text-[17px] font-semibold text-[#052c65] opacity-60">{r.details}</span>
    ),
  },
];

function exportActivityCsv(rows) {
  downloadCsv(
    "سجل_النشاط.csv",
    ["التاريخ والوقت", "المستخدم", "الدور", "نوع الإجراء", "الجهة / الإدارة المرتبطة", "التفاصيل"],
    rows.map((r) => [r.datetime, r.user, r.userSubRole, r.actionType, r.org, r.details]),
  );
}

/** سجل النشاط — Figma 649:6968 + filter 1060:5077 */
export default function ActivityLog() {
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("");
  const [actionType, setActionType] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");

  const orgOptions = useMemo(() => [...new Set(activityLog.map((r) => r.org))], []);
  const actionOptions = useMemo(() => [...new Set(activityLog.map((r) => r.actionType))], []);
  const userOptions = useMemo(() => [...new Set(activityLog.map((r) => r.user))], []);

  const filtered = activityLog.filter((r) => {
    const q = search.trim();
    if (q && !`${r.details}${r.user}${r.org}${r.actionType}`.includes(q)) return false;
    if (org && r.org !== org) return false;
    if (actionType && r.actionType !== actionType) return false;
    if (user && r.user !== user) return false;
    if (date && r.dateIso !== date) return false;
    return true;
  });

  return (
    <ItListPage
      title="سجل النشاط"
      searchPlaceholder="بحث"
      searchBoxed
      columns={COLUMNS}
      rows={filtered}
      showActions={false}
      search={search}
      onSearchChange={setSearch}
      headerClassName="bg-[#052c65] text-white text-[16px]"
      actions={[{ label: "تصدير Excel", icon: "download", onClick: () => exportActivityCsv(filtered) }]}
      filterFields={[
        { label: "التاريخ والوقت", type: "date", value: date, onChange: setDate },
        { label: "المستخدم", value: user, onChange: setUser, options: userOptions, placeholder: "المستخدم" },
        { label: "الإدارة / الجهة", value: org, onChange: setOrg, options: orgOptions },
        { label: "نوع الإجراء", value: actionType, onChange: setActionType, options: actionOptions },
      ]}
      onClearFilters={() => { setOrg(""); setActionType(""); setUser(""); setDate(""); }}
    />
  );
}
