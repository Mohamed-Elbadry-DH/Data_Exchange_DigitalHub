import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItListPage from "../../components/it/ItListPage";
import StatusBadge from "../../components/it/StatusBadge";
import { generalAdmins } from "../../data/mockIt";
import { ddmmyyyyToIso, sortRows, SORT_OPTIONS } from "./listUtils";

const COLUMNS = [
  { key: "name", label: "اسم الإدارة" },
  { key: "created", label: "تاريخ الإنشاء", dir: "ltr" },
  { key: "usersCount", label: "عدد المستخدمين" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
  { key: "bulletinsCount", label: "عدد النشرات" },
  { key: "entitiesCount", label: "عدد الجهات المرتبطة" },
  { key: "formsCount", label: "عدد نماذج البيان" },
];

export default function AdminsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [created, setCreated] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const nameOptions = useMemo(() => [...new Set(generalAdmins.map((r) => r.name))], []);

  const rows = sortRows(
    generalAdmins.filter((r) => {
      if (search.trim() && !r.name.includes(search.trim())) return false;
      if (name && r.name !== name) return false;
      if (created && ddmmyyyyToIso(r.created) !== created) return false;
      return true;
    }),
    sort,
    "created",
  );

  return (
    <ItListPage
      title="الإدارات العامة"
      listTitle="قائمة الإدارات العامة"
      searchPlaceholder="بحث عن إدارة"
      columns={COLUMNS}
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      onRowClick={(r) => navigate(`/it/admins/${r.id}`)}
      actions={[{ label: "إنشاء إدارة", primary: true, onClick: () => navigate("/it/admins/new") }]}
      filterFields={[
        { label: "اسم الإدارة", value: name, onChange: setName, options: nameOptions },
        { label: "تاريخ الإنشاء", type: "date", value: created, onChange: setCreated },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
      ]}
      onClearFilters={() => { setName(""); setCreated(""); setSort(SORT_OPTIONS[0]); }}
    />
  );
}
