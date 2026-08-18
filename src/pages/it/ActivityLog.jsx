import { useMemo, useState } from "react";
import ItListPage from "../../components/it/ItListPage";
import { activityLog } from "../../data/mockIt";
import { ddmmyyyyToIso, SORT_OPTIONS } from "./listUtils";

const COLUMNS = [
  { key: "datetime", label: "التاريخ والوقت" },
  {
    key: "user",
    label: "المستخدم",
    render: (r) => (
      <div className="leading-tight">
        <div>{r.user}</div>
        <div className="text-[12px] text-muted" dir="ltr">{r.userSubRole}</div>
      </div>
    ),
  },
  { key: "actionType", label: "نوع الإجراء" },
  { key: "org", label: "الجهة / الإدارة المرتبطة" },
  { key: "details", label: "التفاصيل" },
];

export default function ActivityLog() {
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("");
  const [actionType, setActionType] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const orgOptions = useMemo(() => [...new Set(activityLog.map((r) => r.org))], []);
  const actionOptions = useMemo(() => [...new Set(activityLog.map((r) => r.actionType))], []);

  const filtered = activityLog.filter((r) => {
    if (search.trim() && !r.details.includes(search.trim()) && !r.user.includes(search.trim())) return false;
    if (org && r.org !== org) return false;
    if (actionType && r.actionType !== actionType) return false;
    if (date && ddmmyyyyToIso(r.datetime.split(" - ")[0]) !== date) return false;
    return true;
  });
  const rows = sort === "الأقدم" ? [...filtered].reverse() : filtered;

  return (
    <ItListPage
      title="سجل النشاط"
      listTitle="سجل النشاط"
      searchPlaceholder="بحث فى السجل"
      columns={COLUMNS}
      rows={rows}
      showActions={false}
      search={search}
      onSearchChange={setSearch}
      filterFields={[
        { label: "الإدارة / الجهة", value: org, onChange: setOrg, options: orgOptions },
        { label: "نوع الإجراء", value: actionType, onChange: setActionType, options: actionOptions },
        { label: "التاريخ والوقت", type: "date", value: date, onChange: setDate },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
      ]}
      onClearFilters={() => { setOrg(""); setActionType(""); setDate(""); setSort(SORT_OPTIONS[0]); }}
    />
  );
}
