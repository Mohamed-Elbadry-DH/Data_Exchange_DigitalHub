import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItListPage from "../../components/it/ItListPage";
import StatusBadge from "../../components/it/StatusBadge";
import { itRequests, requestListChips } from "../../data/mockIt";
import { ddmmyyyyToIso, sortRows, SORT_OPTIONS } from "./listUtils";
import { downloadCsv } from "./exportDownload";

const COLUMNS = [
  { key: "id", label: "رقم الطلب", dir: "ltr" },
  { key: "title", label: "عنوان نموذج البيان" },
  { key: "admin", label: "الإدارة" },
  { key: "type", label: "نوع الطلب" },
  { key: "submitted", label: "تاريخ تقديم الطلب", dir: "ltr" },
  { key: "due", label: "الموعد النهائي", dir: "ltr" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

function exportRequestsCsv(rows) {
  downloadCsv(
    "الطلبات.csv",
    [
      "رقم الطلب", "عنوان نموذج البيان", "الإدارة", "نوع الطلب",
      "تاريخ تقديم الطلب", "الموعد النهائي", "الحالة",
    ],
    rows.map((r) => [r.id, r.title, r.admin, r.type, r.submitted, r.due, r.status]),
  );
}

/** قائمة الطلبات — Figma 649:7406 */
export default function RequestsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState("");
  const [type, setType] = useState("");
  const [sentBy, setSentBy] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const adminOptions = useMemo(() => [...new Set(itRequests.map((r) => r.admin))], []);
  const typeOptions = useMemo(() => [...new Set(itRequests.map((r) => r.type))], []);
  const userOptions = useMemo(() => [...new Set(itRequests.map((r) => r.sentBy))], []);

  const rows = sortRows(
    itRequests.filter((r) => {
      if (search.trim() && !`${r.title}${r.id}`.includes(search.trim())) return false;
      if (admin && r.admin !== admin) return false;
      if (type && r.type !== type) return false;
      if (sentBy && r.sentBy !== sentBy) return false;
      if (submitted && ddmmyyyyToIso(r.submitted) !== submitted) return false;
      return true;
    }),
    sort,
    "submitted",
  );

  return (
    <ItListPage
      title="الطلبات"
      searchPlaceholder="بحث"
      searchBoxed
      chips={requestListChips}
      showDelete={false}
      viewWhenStatus={(r) => r.status === "معتمد" || r.status === "معتمدة"}
      columns={COLUMNS}
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      onRowClick={(r) => navigate(`/it/requests/${r.id}`)}
      actions={[
        /* LTR toolbar (searchBoxed): filter → تصدير → إنشاء → بحث — matches Figma 649:7406 */
        { label: "تصدير Excel", icon: "download", onClick: () => exportRequestsCsv(rows) },
        { label: "إنشاء البيان جديد", primary: true, boxed: true, onClick: () => navigate("/it/forms/new") },
      ]}
      filterFields={[
        { label: "التاريخ والوقت", type: "date", value: submitted, onChange: setSubmitted },
        { label: "المستخدم", value: sentBy, onChange: setSentBy, options: userOptions },
        { label: "الإدارة / الجهة", value: admin, onChange: setAdmin, options: adminOptions },
        { label: "نوع الإجراء", value: type, onChange: setType, options: typeOptions },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
      ]}
      onClearFilters={() => { setAdmin(""); setType(""); setSentBy(""); setSubmitted(""); setSort(SORT_OPTIONS[0]); }}
    />
  );
}
