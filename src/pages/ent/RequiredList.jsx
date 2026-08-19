import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import Layout from "../../components/ent/EntLayout";
import StatusBadge from "../../components/ent/StatusBadge";
import ItFilterModal from "../../components/it/ItFilterModal";
import { entRequiredRows } from "../../data/mockEnt";
import { ddmmyyyyToIso } from "../it/listUtils";

/** البيانات المطلوبة — Figma 1705:8613، ومودال التصفية 1707:12667 */
export default function RequiredList() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("");
  const [directedTo, setDirectedTo] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const rows = entRequiredRows;
  const stageOptions = useMemo(() => [...new Set(rows.map((r) => r.stageLabel))], [rows]);
  const statusOptions = useMemo(() => [...new Set(rows.map((r) => r.status))], [rows]);
  const directedOptions = useMemo(() => [...new Set(rows.map((r) => r.currentEntity))], [rows]);

  const filtered = rows.filter((r) => {
    if (search.trim() && !r.title.includes(search.trim())) return false;
    if (stage && r.stageLabel !== stage) return false;
    if (status && r.status !== status) return false;
    if (directedTo && r.currentEntity !== directedTo) return false;
    if (createdDate && ddmmyyyyToIso(r.created) !== createdDate) return false;
    return true;
  });

  const clearFilters = () => {
    setStage("");
    setStatus("");
    setDirectedTo("");
    setCreatedDate("");
    setFilterOpen(false);
  };

  return (
    <Layout title="البيانات المطلوبة">
      <div className="p-4 sm:p-6 xl:p-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] shrink-0">قائمة البيانات المطلوبة</h2>
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
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">المرحلة</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">موجه إلى</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">المسؤول</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">حالة الطلب</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">تاريخ الإنشاء</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">موعد الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/ent/required/${r.id}`)}
                  className={`cursor-pointer hover:bg-page transition-colors text-[14px] text-[#404040] ${
                    i !== filtered.length - 1 ? "border-b border-[#E9ECEF]" : ""
                  }`}
                >
                  <td className="py-4 px-4 font-semibold text-[#1B75FF] whitespace-nowrap">{r.title}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.stageLabel}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.currentEntity}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.officer}</td>
                  <td className="py-4 px-4"><StatusBadge status={r.status} /></td>
                  <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{r.created}</td>
                  <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{r.due}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted text-[14px]">لا توجد نتائج مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* الحقول الأربعة بترتيب Figma 1707:12667 */}
      <ItFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={clearFilters}
        fields={[
          { label: "المرحلة", value: stage, onChange: setStage, options: stageOptions },
          { label: "الحالة", value: status, onChange: setStatus, options: statusOptions },
          { label: "موجه إلى", value: directedTo, onChange: setDirectedTo, options: directedOptions },
          { label: "تاريخ الإنشاء", type: "date", value: createdDate, onChange: setCreatedDate },
        ]}
      />
    </Layout>
  );
}
