import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItListPage from "../../components/it/ItListPage";
import StatusBadge from "../../components/it/StatusBadge";
import EntityCreateModal from "../../components/it/EntityCreateModal";
import { externalEntities } from "../../data/mockIt";
import { SORT_OPTIONS } from "./listUtils";

const COLUMNS = [
  { key: "name", label: "اسم الجهة" },
  { key: "type", label: "النوع" },
  { key: "admin", label: "الإدارة المرتبطة" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
  { key: "formsCount", label: "عدد نماذج البيان" },
];

export default function EntitiesList() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const typeOptions = useMemo(() => [...new Set(externalEntities.map((r) => r.type))], []);
  const statusOptions = useMemo(() => [...new Set(externalEntities.map((r) => r.status))], []);

  const filtered = externalEntities.filter((r) => {
    if (search.trim() && !r.name.includes(search.trim())) return false;
    if (type && r.type !== type) return false;
    if (status && r.status !== status) return false;
    return true;
  });
  const rows = sort === "الأقدم" ? [...filtered].reverse() : filtered;

  return (
    <>
    <ItListPage
      title="الجهات الخارجية"
      listTitle="قائمة الجهات الخارجية"
      searchPlaceholder="بحث عن جهة"
      columns={COLUMNS}
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      onRowClick={(r) => navigate(`/it/entities/${r.id}`)}
      actions={[{ label: "إنشاء جهة خارجية", primary: true, onClick: () => setCreateOpen(true) }]}
      filterFields={[
        { label: "نوع الجهة", value: type, onChange: setType, options: typeOptions },
        { label: "الحالة", value: status, onChange: setStatus, options: statusOptions },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
      ]}
      onClearFilters={() => { setType(""); setStatus(""); setSort(SORT_OPTIONS[0]); }}
    />
    <EntityCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
