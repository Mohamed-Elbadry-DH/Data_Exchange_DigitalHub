import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import StatusBadge from "../../components/StatusBadge";
import FilterModal from "../../components/FilterModal";

function ddmmyyyyToIso(s) {
  const [d, m, y] = (s || "").split("/");
  return d && m && y ? `${y}-${m}-${d}` : "";
}

export default function RequestList({ title, listTitle, rows, detailPath }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [org, setOrg] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const navigate = useNavigate();

  const statusOptions = useMemo(() => [...new Set(rows.map((r) => r.status))], [rows]);
  const orgOptions = useMemo(() => [...new Set(rows.map((r) => r.org))], [rows]);

  const filteredRows = rows.filter((r) => {
    if (search.trim() && !r.title.includes(search.trim())) return false;
    if (status && r.status !== status) return false;
    if (org && r.org !== org) return false;
    if (createdDate && ddmmyyyyToIso(r.created) !== createdDate) return false;
    return true;
  });

  const clearFilters = () => {
    setStatus("");
    setOrg("");
    setCreatedDate("");
    setFilterOpen(false);
  };

  return (
    <Layout title={title}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)]">{listTitle}</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن نموذج بيان"
                className="border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-64 text-right placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[860px] text-right">
            <thead>
              <tr className="bg-navy text-white text-[14px]">
                <th className="py-3.5 px-6 font-semibold">عنوان نموذج بيان</th>
                <th className="py-3.5 px-6 font-semibold">الجهة الخارجية</th>
                <th className="py-3.5 px-6 font-semibold">الموظف المختص</th>
                <th className="py-3.5 px-6 font-semibold">حالة الطلب</th>
                <th className="py-3.5 px-6 font-semibold">تاريخ الإنشاء</th>
                <th className="py-3.5 px-6 font-semibold">موعد الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`${detailPath}/${r.id}`)}
                  className={`cursor-pointer hover:bg-page transition-colors text-[14px] text-[#404040] ${i !== filteredRows.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <td className="py-4 px-6 font-medium">{r.title}</td>
                  <td className="py-4 px-6">{r.org}</td>
                  <td className="py-4 px-6">{r.officer}</td>
                  <td className="py-4 px-6"><StatusBadge status={r.status} /></td>
                  <td className="py-4 px-6">{r.created}</td>
                  <td className="py-4 px-6">{r.due}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted text-[14px]">لا توجد نتائج مطابقة</td>
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
        secondField={{ label: "الجهة الخارجية", value: org, onChange: setOrg, options: orgOptions }}
        dateLabel="تاريخ الإنشاء"
        dateValue={createdDate}
        onDateChange={setCreatedDate}
      />
    </Layout>
  );
}
