import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import Layout from "../../components/es/EsLayout";
import StatusBadge from "../../components/es/StatusBadge";
import ItFilterModal from "../../components/it/ItFilterModal";
import { esRequiredRows } from "../../data/mockEs";
import { ddmmyyyyToIso } from "../it/listUtils";

/** البيانات المطلوبة — مشرف الجهة (Figma 1689:4626 / 1689:4871) */
export default function RequiredList() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState("");
  const [status, setStatus] = useState("");
  const [officer, setOfficer] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const rows = esRequiredRows;
  const adminOptions = useMemo(() => [...new Set(rows.map((r) => r.admin))], [rows]);
  const statusOptions = useMemo(() => [...new Set(rows.map((r) => r.status))], [rows]);
  const officerOptions = useMemo(() => [...new Set(rows.map((r) => r.officer))], [rows]);

  const filtered = rows.filter((r) => {
    if (search.trim() && !r.title.includes(search.trim())) return false;
    if (admin && r.admin !== admin) return false;
    if (status && r.status !== status) return false;
    if (officer && r.officer !== officer) return false;
    if (createdDate && ddmmyyyyToIso(r.created) !== createdDate) return false;
    return true;
  });

  const clearFilters = () => {
    setAdmin("");
    setStatus("");
    setOfficer("");
    setCreatedDate("");
    setFilterOpen(false);
  };

  return (
    <Layout title="البيانات المطلوبة">
      <div className="page-shell">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] shrink-0">قائمة البيانات المطلوبة</h2>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن نموذج بيان"
                className="border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-full sm:w-64 text-right placeholder:text-gray-400"
              />
            </div>
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

        <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-[#D8D8D8]">
          <table className="w-full min-w-[980px] text-center border-collapse">
            <thead>
              <tr className="bg-navy text-white text-[14px]">
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">عنوان نموذج بيان</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">الإدارة العامة</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">الموظف المختص</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">حالة الطلب</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">تاريخ الإنشاء</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">موعد الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/es/required/${r.id}`)}
                  className={`cursor-pointer hover:bg-page transition-colors text-[14px] text-[#404040] ${
                    i !== filtered.length - 1 ? "border-b border-[#E9ECEF]" : ""
                  }`}
                >
                  <td className="py-4 px-4 font-semibold text-[#1B75FF] whitespace-nowrap">{r.title}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.admin}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.officer}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{r.created}</td>
                  <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{r.due}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted text-[14px]">لا توجد نتائج مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ItFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={clearFilters}
        fields={[
          { label: "الإدارة العامة", value: admin, onChange: setAdmin, options: adminOptions },
          { label: "الحالة", value: status, onChange: setStatus, options: statusOptions },
          { label: "الموظف المختص", value: officer, onChange: setOfficer, options: officerOptions },
          { label: "تاريخ الإنشاء", type: "date", value: createdDate, onChange: setCreatedDate },
        ]}
      />
    </Layout>
  );
}
