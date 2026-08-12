import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import StatusBadge from "../../components/ga/StatusBadge";
import FilterModal from "../../components/FilterModal";
import { stageById } from "../../domain/workflow";

function ddmmyyyyToIso(s) {
  const [d, m, y] = (s || "").split("/");
  return d && m && y ? `${y}-${m}-${d}` : "";
}

function stageLabelOf(row) {
  return row.stageLabel || stageById(row.stageId)?.label || "—";
}

export default function RequestList({ title, listTitle, rows, detailPath }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [directedTo, setDirectedTo] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const navigate = useNavigate();

  const statusOptions = useMemo(() => [...new Set(rows.map((r) => r.status))], [rows]);
  const directedOptions = useMemo(
    () => [...new Set(rows.map((r) => r.currentEntity || r.org).filter(Boolean))],
    [rows],
  );

  const filteredRows = rows.filter((r) => {
    if (search.trim() && !r.title.includes(search.trim())) return false;
    if (status && r.status !== status) return false;
    if (directedTo && (r.currentEntity || r.org) !== directedTo) return false;
    if (createdDate && ddmmyyyyToIso(r.created) !== createdDate) return false;
    return true;
  });

  const clearFilters = () => {
    setStatus("");
    setDirectedTo("");
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
                placeholder="بحث عن البيان"
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

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={clearFilters}
        statusOptions={statusOptions}
        statusValue={status}
        onStatusChange={setStatus}
        secondField={{
          label: "موجه إلى",
          value: directedTo,
          onChange: setDirectedTo,
          options: directedOptions,
        }}
        dateLabel="تاريخ الإنشاء"
        dateValue={createdDate}
        onDateChange={setCreatedDate}
      />
    </Layout>
  );
}
