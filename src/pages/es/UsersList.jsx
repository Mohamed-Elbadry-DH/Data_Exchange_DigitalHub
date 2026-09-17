import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Layout from "../../components/es/EsLayout";
import FilterModal from "../../components/FilterModal";
import UserFormModal from "../../components/UserFormModal";
import ConfirmModal from "../../components/ConfirmModal";
import { esUsersRows } from "../../data/mockEs";

const STORAGE_KEY = "mped-es-users-v1";
const ES_ROLE_OPTIONS = ["موظف جهة", "مشرف جهة"];

function loadEsUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return esUsersRows.map((u) => ({ ...u }));
}

function saveEsUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch { /* ignore */ }
  return users;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** حالة المستخدم — Figma 1689:5074 / 1689:5120 */
function StatusPill({ status }) {
  const active = status === "نشط";
  return (
    <span
      className="inline-flex min-w-[81px] h-8 items-center justify-center rounded-[15px] px-3 text-[17px] font-semibold tracking-[0.17px] whitespace-nowrap"
      style={
        active
          ? { background: "rgba(22,163,74,0.1)", color: "#16A34A" }
          : { background: "rgba(200,150,55,0.1)", color: "#C89637" }
      }
    >
      {status}
    </span>
  );
}

function ActionIcon({ src, alt, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative size-5 shrink-0 overflow-hidden cursor-pointer hover:opacity-80"
    >
      <img src={src} alt={alt} className="absolute inset-0 size-full max-w-none object-contain" />
    </button>
  );
}

/** المستخدمين — مشرف الجهة (Figma 1689:4908 / 1689:5074) */
export default function UsersList() {
  const [users, setUsers] = useState(() => loadEsUsers());
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const statusOptions = useMemo(() => [...new Set(users.map((u) => u.status))], [users]);
  const roleOptions = useMemo(() => [...new Set(users.map((u) => u.role))], [users]);

  const filteredUsers = users.filter((u) => {
    const q = search.trim();
    if (q && !u.name.includes(q) && !u.email.includes(q)) return false;
    if (status && u.status !== status) return false;
    if (role && u.role !== role) return false;
    if (joinedDate && u.joined !== joinedDate) return false;
    return true;
  });

  const persist = (next) => setUsers(saveEsUsers(next));

  const clearFilters = () => {
    setStatus("");
    setRole("");
    setJoinedDate("");
    setFilterOpen(false);
  };

  const toggleActive = (id) => {
    persist(users.map((u) => {
      if (u.id !== id) return u;
      if (u.status === "نشط") return { ...u, status: "غير نشط", stopped: todayIso() };
      return { ...u, status: "نشط", stopped: "-" };
    }));
  };

  const confirmDelete = () => {
    persist(users.filter((u) => u.id !== deletingId));
    setDeletingId(null);
  };

  const submitForm = (form) => {
    if (editingUser) {
      persist(users.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)));
    } else {
      const id = Math.max(0, ...users.map((u) => Number(u.id) || 0)) + 1;
      persist([{ id, ...form, joined: todayIso(), stopped: "-", status: "نشط" }, ...users]);
    }
    setFormOpen(false);
  };

  const cell = "py-4 px-6 text-[17px] font-semibold tracking-[0.17px] text-[#052c65]/60 whitespace-nowrap";

  return (
    <Layout title="المستخدمين">
      <div className="page-shell">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] shrink-0">
            المستخدمين ({filteredUsers.length})
          </h2>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن مستخدم"
                className="border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-full sm:w-64 text-right placeholder:text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => { setEditingUser(null); setFormOpen(true); }}
              className="bg-navy text-white rounded-lg px-4 py-2.5 text-[14px] flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus size={16} /> إضافة مستخدم
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              aria-label="تصفية"
              className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary shrink-0 cursor-pointer"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-[rgba(18,36,67,0.1)]">
          <table className="w-full min-w-[980px] text-right border-collapse" dir="rtl">
            <thead>
              <tr className="bg-[#052c65] text-white text-[16px]">
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">المستخدم</th>
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">رقم الهاتف</th>
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">الدور الوظيفي</th>
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">تاريخ الانضمام</th>
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">تاريخ الإيقاف</th>
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">الحالة</th>
                <th className="py-3.5 px-6 font-semibold whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-[rgba(18,36,67,0.1)] ${
                    i !== filteredUsers.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="py-4 px-6 text-right">
                    <div className="text-[17px] font-medium text-[#052c65] tracking-[0.17px] leading-5">{u.name}</div>
                    <div className="text-[17px] font-medium text-[rgba(5,44,101,0.3)] tracking-[0.17px] leading-5">{u.email}</div>
                  </td>
                  <td className={cell} dir="ltr">{u.phone}</td>
                  <td className={cell}>{u.role}</td>
                  <td className={cell} dir="ltr">{u.joined}</td>
                  <td className={cell} dir="ltr">{u.stopped}</td>
                  <td className="py-4 px-6">
                    <StatusPill status={u.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center gap-4" dir="ltr">
                      <ActionIcon
                        src="/es/action-trash.svg"
                        alt=""
                        label="حذف المستخدم"
                        onClick={() => setDeletingId(u.id)}
                      />
                      <ActionIcon
                        src="/es/action-edit.svg"
                        alt=""
                        label="تعديل المستخدم"
                        onClick={() => { setEditingUser(u); setFormOpen(true); }}
                      />
                      <ActionIcon
                        src={u.status === "نشط" ? "/es/action-pause.svg" : "/es/action-play.svg"}
                        alt=""
                        label={u.status === "نشط" ? "إيقاف المستخدم" : "تفعيل المستخدم"}
                        onClick={() => toggleActive(u.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted text-[14px]">لا توجد نتائج مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={clearFilters}
        statusOptions={statusOptions}
        statusValue={status}
        onStatusChange={setStatus}
        secondField={{ label: "الدور الوظيفي", value: role, onChange: setRole, options: roleOptions }}
        dateLabel="تاريخ الانضمام"
        dateValue={joinedDate}
        onDateChange={setJoinedDate}
      />

      <UserFormModal
        open={formOpen}
        initial={editingUser}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
        roleOptions={ES_ROLE_OPTIONS}
      />

      <ConfirmModal
        open={deletingId !== null}
        message="هل أنت متأكد من حذف هذا المستخدم؟"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </Layout>
  );
}
