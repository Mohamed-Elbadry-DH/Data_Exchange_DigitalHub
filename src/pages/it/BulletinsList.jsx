import { useMemo, useState } from "react";
import ItListPage from "../../components/it/ItListPage";
import BulletinCreateModal from "../../components/it/BulletinCreateModal";
import { bulletins } from "../../data/mockIt";
import { ddmmyyyyToIso, sortRows, SORT_OPTIONS } from "./listUtils";

const COLUMNS = [
  { key: "name", label: "اسم نشرة" },
  { key: "admin", label: "الإدارة التابعة" },
  { key: "periodicity", label: "الدورية" },
  { key: "entitiesCount", label: "عدد الجهات المرتبطة" },
  { key: "formsCount", label: "عدد نماذج البيان" },
  { key: "created", label: "تاريخ الإنشاء", dir: "ltr" },
];

export default function BulletinsList() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState("");
  const [periodicity, setPeriodicity] = useState("");
  const [created, setCreated] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const adminOptions = useMemo(() => [...new Set(bulletins.map((r) => r.admin))], []);
  const periodicityOptions = useMemo(() => [...new Set(bulletins.map((r) => r.periodicity))], []);

  const rows = sortRows(
    bulletins.filter((r) => {
      if (search.trim() && !r.name.includes(search.trim())) return false;
      if (admin && r.admin !== admin) return false;
      if (periodicity && r.periodicity !== periodicity) return false;
      if (created && ddmmyyyyToIso(r.created) !== created) return false;
      return true;
    }),
    sort,
    "created",
  );

  return (
    <>
    <ItListPage
      title="النشرات"
      listTitle="قائمة النشرات"
      searchPlaceholder="بحث عن نشرة"
      columns={COLUMNS}
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      actions={[
        { label: "إنشاء نشرة", primary: true, onClick: () => setCreateOpen(true) },
        { label: "تصدير Excel" },
      ]}
      filterFields={[
        { label: "الإدارة", value: admin, onChange: setAdmin, options: adminOptions },
        { label: "الدورية", value: periodicity, onChange: setPeriodicity, options: periodicityOptions },
        { label: "تاريخ الإنشاء", type: "date", value: created, onChange: setCreated },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
      ]}
      onClearFilters={() => { setAdmin(""); setPeriodicity(""); setCreated(""); setSort(SORT_OPTIONS[0]); }}
    />
    <BulletinCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
