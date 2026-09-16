import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import StatusBadge from "../../components/ga/StatusBadge";
import ItFilterModal from "../../components/it/ItFilterModal";
import { stageById } from "../../domain/workflow";

function ddmmyyyyToIso(s) {
  const [d, m, y] = (s || "").split("/");
  return d && m && y ? `${y}-${m}-${d}` : "";
}

function stageLabelOf(row) {
  return row.stageLabel || stageById(row.stageId)?.label || "—";
}

/** قوائم نماذج البيان / البيانات المطلوبة — أعمدة وفلاتر Figma 1094:1007 */
export default function RequestList({ title, listTitle, rows, detailPath }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("");
  const [directedTo, setDirectedTo] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const navigate = useNavigate();

  const stageOptions = useMemo(
    () => [...new Set(rows.map((r) => stageLabelOf(r)).filter((l) => l && l !== "—"))],
    [rows],
  );
  const statusOptions = useMemo(() => [...new Set(rows.map((r) => r.status))], [rows]);
  const directedOptions = useMemo(
    () => [...new Set(rows.map((r) => r.currentEntity || r.org).filter(Boolean))],
    [rows],
  );

  const filteredRows = rows.filter((r) => {
    if (search.trim() && !r.title.includes(search.trim())) return false;
    if (stage && stageLabelOf(r) !== stage) return false;
    if (status && r.status !== status) return false;
    if (directedTo && (r.currentEntity || r.org) !== directedTo) return false;
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
    <Layout title={title}>
      <div className="page-shell">
        {/* Toolbar: title right + actions on visual left (dir=ltr justify-start) */}
        <div className="flex flex-wrap items-center mb-6 gap-4 justify-between">
          <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] shrink-0">{listTitle}</h2>
          <div
            className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-[15px]"
            dir="ltr"
          >
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              aria-label="تصفية"
              className="size-10 rounded-[13.333px] bg-[rgba(5,44,101,0.1)] flex items-center justify-center text-[#052c65] hover:opacity-80 shrink-0 cursor-pointer"
            >
              <SlidersHorizontal size={22} />
            </button>
            <div className="relative min-w-0 flex-1 basis-[220px] sm:flex-none sm:basis-auto">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن البيان"
                className="h-[46px] w-full sm:w-[315px] rounded-[10px] bg-[#f0f0f0] border border-[rgba(5,44,101,0.16)] pr-9 pl-4 text-[14px] text-right placeholder:text-black/30 outline-none focus:border-primary"
              />
            </div>
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
              {filteredRows.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`${detailPath}/${r.id}`)}
                  className={`cursor-pointer hover:bg-page transition-colors text-[14px] text-[#404040] ${
                    i !== filteredRows.length - 1 ? "border-b border-[#E9ECEF]" : ""
                  }`}
                >
                  <td className="py-4 px-4 font-semibold text-[#1B75FF] text-center whitespace-nowrap">
                    {r.title}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">{stageLabelOf(r)}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.currentEntity || r.org}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{r.officer}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{r.created}</td>
                  <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{r.due}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted text-[14px]">
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Figma 1094:1007 / 1094:669 — المرحلة ثم الحالة ثم موجه إلى ثم التاريخ */}
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
