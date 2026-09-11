import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, Trash2, SquarePen, Pause, Play, Plus } from "lucide-react";
import Layout from "../components/Layout";
import FilterModal from "../components/FilterModal";
import UserFormModal from "../components/UserFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { usersRows as initialUsersRows } from "../data/mock";

function StatusPill({ status }) {
  const active = status === "نشط";
  return (
    <span
      className="inline-block rounded-lg px-4 py-1.5 text-[13px] font-medium"
      style={{ background: active ? "#DDF2E5" : "#FFF1DE", color: active ? "#16A34A" : "#FF8C08" }}
    >
      {status}
    </span>
  );
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function UsersList() {
  const [users, setUsers] = useState(initialUsersRows);
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

  const clearFilters = () => {
    setStatus("");
    setRole("");
    setJoinedDate("");
    setFilterOpen(false);
  };

  const toggleActive = (id) => {
    setUsers((list) =>
      list.map((u) =>
        u.id === id
          ? u.status === "نشط"
            ? { ...u, status: "غير نشط", stopped: todayIso() }
            : { ...u, status: "نشط", stopped: "-" }
          : u
      )
    );
  };

  const confirmDelete = () => {
    setUsers((list) => list.filter((u) => u.id !== deletingId));
    setDeletingId(null);
  };

  const openAdd = () => { setEditingUser(null); setFormOpen(true); };
  const openEdit = (u) => { setEditingUser(u); setFormOpen(true); };

  const submitForm = (form) => {
    if (editingUser) {
      setUsers((list) => list.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)));
    } else {
      setUsers((list) => [
        ...list,
        { id: Math.max(0, ...list.map((u) => u.id)) + 1, ...form, joined: todayIso(), stopped: "-", status: "نشط" },
      ]);
    }
    setFormOpen(false);
  };

  return (
    <Layout title="المستخدمين">
      <div className="page-shell">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)]">المستخدمين ({filteredUsers.length})</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن مستخدم"
                className="border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-64 text-right placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={openAdd}
              className="bg-navy text-white rounded-lg px-4 py-2.5 text-[14px] flex items-center gap-2"
            >
              <Plus size={16} /> إضافة مستخدم
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[900px] text-right">
            <thead>
              <tr className="bg-navy text-white text-[14px]">
                <th className="py-3.5 px-6 font-semibold">المستخدم</th>
                <th className="py-3.5 px-6 font-semibold">رقم الهاتف</th>
                <th className="py-3.5 px-6 font-semibold">الدور الوظيفي</th>
                <th className="py-3.5 px-6 font-semibold">تاريخ الانضمام</th>
                <th className="py-3.5 px-6 font-semibold">تاريخ الإيقاف</th>
                <th className="py-3.5 px-6 font-semibold">الحالة</th>
                <th className="py-3.5 px-6 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={u.id} className={`text-[14px] text-[#404040] ${i !== filteredUsers.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <td className="py-4 px-6">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-muted text-[12px]">{u.email}</div>
                  </td>
                  <td className="py-4 px-6">{u.phone}</td>
                  <td className="py-4 px-6">{u.role}</td>
                  <td className="py-4 px-6">{u.joined}</td>
                  <td className="py-4 px-6">{u.stopped}</td>
                  <td className="py-4 px-6"><StatusPill status={u.status} /></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-muted">
                      <button onClick={() => setDeletingId(u.id)} className="hover:text-danger"><Trash2 size={16} /></button>
                      <button onClick={() => openEdit(u)} className="hover:text-primary"><SquarePen size={16} /></button>
                      <button onClick={() => toggleActive(u.id)} className="hover:text-warning">
                        {u.status === "نشط" ? <Pause size={16} /> : <Play size={16} />}
                      </button>
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
