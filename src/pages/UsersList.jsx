import { useState } from "react";
import { SlidersHorizontal, Search, Trash2, SquarePen, Pause, Play } from "lucide-react";
import Layout from "../components/Layout";
import FilterModal from "../components/FilterModal";
import { usersRows } from "../data/mock";

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

export default function UsersList() {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <Layout title="المستخدمين">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setFilterOpen(true)}
            className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary"
          >
            <SlidersHorizontal size={18} />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)]">المستخدمين ({usersRows.length})</h2>
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input placeholder="بحث عن مستخدم" className="border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-64 text-right placeholder:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-navy text-white text-[14px]">
                <th className="py-3.5 px-6 font-semibold">إجراءات</th>
                <th className="py-3.5 px-6 font-semibold">الحالة</th>
                <th className="py-3.5 px-6 font-semibold">تاريخ الإيقاف</th>
                <th className="py-3.5 px-6 font-semibold">تاريخ الانضمام</th>
                <th className="py-3.5 px-6 font-semibold">الدور الوظيفي</th>
                <th className="py-3.5 px-6 font-semibold">رقم الهاتف</th>
                <th className="py-3.5 px-6 font-semibold">المستخدم</th>
              </tr>
            </thead>
            <tbody>
              {usersRows.map((u, i) => (
                <tr key={u.id} className={`text-[14px] text-[#404040] ${i !== usersRows.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-muted">
                      <button className="hover:text-danger"><Trash2 size={16} /></button>
                      <button className="hover:text-primary"><SquarePen size={16} /></button>
                      <button className="hover:text-warning">{u.status === "نشط" ? <Pause size={16} /> : <Play size={16} />}</button>
                    </div>
                  </td>
                  <td className="py-4 px-6"><StatusPill status={u.status} /></td>
                  <td className="py-4 px-6">{u.stopped}</td>
                  <td className="py-4 px-6">{u.joined}</td>
                  <td className="py-4 px-6">{u.role}</td>
                  <td className="py-4 px-6">{u.phone}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-muted text-[12px]">{u.email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={() => setFilterOpen(false)}
        extraField={{ label: "تاريخ الانضمام" }}
      />
    </Layout>
  );
}
