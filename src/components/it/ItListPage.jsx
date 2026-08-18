import { useState } from "react";
import { SlidersHorizontal, Search, Plus, SquarePen, Trash2 } from "lucide-react";
import Layout from "./ItLayout";
import ItFilterModal from "./ItFilterModal";
import ConfirmModal from "../ConfirmModal";

/**
 * Shared shell for the six IT-specialist list screens: title + search +
 * optional actions + «تصفية» + table + empty state. Each page supplies its own
 * columns, rows and filter fields.
 *
 * `columns`: [{ key, label, render?, dir? }]
 *
 * Every table ends with an «إجراءات» column (تعديل / حذف) per Figma `645:3671`.
 * It renders last so RTL places it leftmost. Pass `showActions={false}` for
 * read-only tables such as سجل النشاط.
 */
export default function ItListPage({
  title,
  listTitle,
  searchPlaceholder = "بحث",
  columns,
  rows,
  filterFields = [],
  onClearFilters,
  actions = [],
  search,
  onSearchChange,
  onRowClick,
  onEdit,
  showActions = true,
  emptyText = "لا توجد نتائج مطابقة",
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  const clearAll = () => {
    onClearFilters?.();
    setFilterOpen(false);
  };

  const edit = onEdit || onRowClick;

  /** Row-level «إجراءات»: تعديل on the right, حذف on the left (Figma 1057:2171). */
  const actionsColumn = {
    key: "__actions",
    label: "إجراءات",
    render: (r) => (
      <div className="flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="تعديل"
          onClick={() => edit?.(r)}
          className="text-primary hover:opacity-70 cursor-pointer"
        >
          <SquarePen size={20} />
        </button>
        <button
          type="button"
          aria-label="حذف"
          onClick={() => setPendingDelete(r)}
          className="text-danger hover:opacity-70 cursor-pointer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    ),
  };

  const allColumns = showActions ? [...columns, actionsColumn] : columns;
  const visibleRows = rows.filter((r) => !removedIds.includes(r.id));

  return (
    <Layout title={title}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-[18px] font-bold text-[#052c65] shrink-0">{listTitle}</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-64 text-right placeholder:text-gray-400"
              />
            </div>
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className={
                  a.primary
                    ? "flex items-center gap-2 bg-[#052C65] text-white text-[14px] font-bold rounded-[12px] py-2.5 px-4 shadow-sm cursor-pointer whitespace-nowrap"
                    : "flex items-center gap-2 bg-white border border-gray-200 text-[#052C65] text-[14px] font-semibold rounded-[12px] py-2.5 px-4 shadow-sm cursor-pointer whitespace-nowrap"
                }
              >
                {a.primary && <Plus size={16} strokeWidth={2.5} />}
                {a.label}
              </button>
            ))}
            <button
              onClick={() => setFilterOpen(true)}
              aria-label="تصفية"
              className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary shrink-0"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-[#D8D8D8]">
          <table className="w-full min-w-[980px] text-center border-collapse">
            <thead>
              <tr className="bg-navy text-white text-[14px]">
                {allColumns.map((c) => (
                  <th key={c.key} className="py-3.5 px-4 font-semibold whitespace-nowrap">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={onRowClick ? () => onRowClick(r) : undefined}
                  className={`text-[14px] text-[#404040] ${
                    onRowClick ? "cursor-pointer hover:bg-page transition-colors" : ""
                  } ${i !== visibleRows.length - 1 ? "border-b border-[#E9ECEF]" : ""}`}
                >
                  {allColumns.map((c) => (
                    <td key={c.key} className="py-4 px-4 whitespace-nowrap" dir={c.dir}>
                      {c.render ? c.render(r) : r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={allColumns.length} className="py-8 text-center text-muted text-[14px]">
                    {emptyText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ItFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={clearAll}
        fields={filterFields}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        message="هل أنت متأكد من حذف هذا العنصر؟"
        onConfirm={() => {
          setRemovedIds((ids) => [...ids, pendingDelete.id]);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </Layout>
  );
}
