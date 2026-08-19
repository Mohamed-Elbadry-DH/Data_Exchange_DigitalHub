import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItListPage from "../../components/it/ItListPage";
import AdminCreateModal from "../../components/it/AdminCreateModal";
import { generalAdmins } from "../../data/mockIt";
import { ddmmyyyyToIso, sortRows, SORT_OPTIONS, useCreateModal } from "./listUtils";

const COLUMNS = [
  { key: "name", label: "اسم الإدارة", className: "text-right" },
  { key: "created", label: "تاريخ الإنشاء", dir: "ltr" },
  { key: "usersCount", label: "عدد المستخدمين" },
  { key: "bulletinsCount", label: "عدد النشرات" },
  { key: "entitiesCount", label: "عدد الجهات المرتبطة" },
  { key: "formsCount", label: "عدد نماذج البيان" },
];

/** قائمة الإدارات العامة — Figma 645:3671 + filter 1057:2271 */
export default function AdminsList() {
  const navigate = useNavigate();
  const [createOpen, openCreate, closeCreate] = useCreateModal();
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
    <>
      <ItListPage
        title="الإدارات العامة"
        listTitle={`إجمالي الإدارات (${rows.length})`}
        searchPlaceholder="بحث بأسم الإدارة"
        searchBoxed
        columns={COLUMNS}
        rows={rows}
        search={search}
        onSearchChange={setSearch}
        headerClassName="bg-[#052c65] text-white text-[16px]"
        onRowClick={(r) => navigate(`/it/admins/${r.id}`)}
        onEdit={(r) => navigate(`/it/admins/${r.id}`)}
        actions={[{ label: "إنشاء إدارة", primary: true, boxed: true, onClick: openCreate }]}
        filterFields={[
          { label: "اسم الإدارة", type: "searchable", value: name, onChange: setName, options: nameOptions },
          { label: "تاريخ الإنشاء", type: "date", value: created, onChange: setCreated },
          { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS, placeholder: "الأحدث" },
        ]}
        onClearFilters={() => { setName(""); setCreated(""); setSort(SORT_OPTIONS[0]); }}
      />
      <AdminCreateModal open={createOpen} onClose={closeCreate} />
    </>
  );
}
