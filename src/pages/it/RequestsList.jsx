import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItListPage from "../../components/it/ItListPage";
import StatusBadge from "../../components/it/StatusBadge";
import { itRequests } from "../../data/mockIt";
import { ddmmyyyyToIso, sortRows, SORT_OPTIONS } from "./listUtils";

const COLUMNS = [
  { key: "id", label: "رقم الطلب", dir: "ltr" },
  { key: "title", label: "عنوان نموذج البيان" },
  { key: "admin", label: "الإدارة" },
  { key: "type", label: "نوع الطلب" },
  { key: "submitted", label: "تاريخ تقديم الطلب", dir: "ltr" },
  { key: "due", label: "الموعد النهائي", dir: "ltr" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

export default function RequestsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState("");
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const adminOptions = useMemo(() => [...new Set(itRequests.map((r) => r.admin))], []);
  const statusOptions = useMemo(() => [...new Set(itRequests.map((r) => r.status))], []);

  const rows = sortRows(
    itRequests.filter((r) => {
      if (search.trim() && !r.title.includes(search.trim())) return false;
      if (admin && r.admin !== admin) return false;
      if (status && r.status !== status) return false;
      if (submitted && ddmmyyyyToIso(r.submitted) !== submitted) return false;
      return true;
    }),
    sort,
    "submitted",
  );

  return (
    <ItListPage
      title="الطلبات"
      listTitle="قائمة الطلبات"
      searchPlaceholder="بحث عن طلب"
      columns={COLUMNS}
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      onRowClick={(r) => navigate(`/it/requests/${r.id}`)}
      actions={[{ label: "إنشاء البيان جديد", primary: true, onClick: () => navigate("/it/forms/new") }]}
      filterFields={[
        { label: "الإدارة / الجهة", value: admin, onChange: setAdmin, options: adminOptions },
        { label: "الحالة", value: status, onChange: setStatus, options: statusOptions },
        { label: "تاريخ تقديم الطلب", type: "date", value: submitted, onChange: setSubmitted },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
      ]}
      onClearFilters={() => { setAdmin(""); setStatus(""); setSubmitted(""); setSort(SORT_OPTIONS[0]); }}
    />
  );
}
