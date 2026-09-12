import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItListPage from "../../components/it/ItListPage";
import StatusBadge from "../../components/it/StatusBadge";
import {
  loadItUsers,
  removeItUser,
  toggleItUserActive,
} from "../../domain/itUsersStore";
import { ddmmyyyyToIso, sortRows, SORT_OPTIONS } from "./listUtils";

const COLUMNS = [
  { key: "name", label: "المستخدم" },
  { key: "phone", label: "رقم الهاتف", dir: "ltr" },
  { key: "affiliation", label: "تبعية المستخدم" },
  { key: "jobRole", label: "الدور الوظيفي" },
  { key: "org", label: "الإدارة / الجهة" },
  { key: "joined", label: "تاريخ الانضمام", dir: "ltr" },
  { key: "stopped", label: "تاريخ الإيقاف", dir: "ltr" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

/** قائمة المستخدمين — Figma 649:6456 + filter 1060:4573 */
export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => loadItUsers());
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [status, setStatus] = useState("");
  const [joined, setJoined] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const orgOptions = useMemo(() => [...new Set(users.map((r) => r.org))], [users]);
  const roleOptions = useMemo(() => [...new Set(users.map((r) => r.jobRole))], [users]);
  const statusOptions = useMemo(() => [...new Set(users.map((r) => r.status))], [users]);

  const rows = sortRows(
    users.filter((r) => {
      if (search.trim() && !r.name.includes(search.trim())) return false;
      if (org && r.org !== org) return false;
      if (jobRole && r.jobRole !== jobRole) return false;
      if (status && r.status !== status) return false;
      if (joined && ddmmyyyyToIso(r.joined) !== joined) return false;
      return true;
    }),
    sort,
    "joined",
  );

  const refresh = (next) => setUsers(next);

  return (
    <ItListPage
      title="المستخدمين"
      listTitle="قائمة المستخدمين"
      searchPlaceholder="بحث عن مستخدم"
      columns={COLUMNS}
      rows={rows}
      search={search}
      onSearchChange={setSearch}
      actions={[{ label: "إنشاء مستخدم جديد", primary: true, onClick: () => navigate("/it/users/new") }]}
      onEdit={(r) => navigate(`/it/users/${r.id}/edit`)}
      onDelete={(r) => refresh(removeItUser(r.id))}
      leadingAction={(r) =>
        r.status === "نشط"
          ? {
              src: "/it/icon-circle-pause.svg",
              label: "إيقاف المستخدم",
              onClick: () => refresh(toggleItUserActive(r.id)),
            }
          : {
              src: "/it/icon-circle-play.svg",
              label: "تفعيل المستخدم",
              onClick: () => refresh(toggleItUserActive(r.id)),
            }
      }
      filterFields={[
        /* Order matches Figma 1060:4573; الحالة added for list column filterability */
        { label: "تاريخ الانضمام", type: "date", value: joined, onChange: setJoined },
        { label: "ترتيب حسب", value: sort, onChange: setSort, options: SORT_OPTIONS },
        { label: "الإدارة / الجهة", value: org, onChange: setOrg, options: orgOptions },
        { label: "الدور الوظيفي", value: jobRole, onChange: setJobRole, options: roleOptions },
        { label: "الحالة", value: status, onChange: setStatus, options: statusOptions },
      ]}
      onClearFilters={() => {
        setOrg("");
        setJobRole("");
        setStatus("");
        setJoined("");
        setSort(SORT_OPTIONS[0]);
      }}
    />
  );
}
