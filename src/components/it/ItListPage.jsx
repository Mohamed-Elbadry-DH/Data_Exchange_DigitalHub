import { useState } from "react";
import { SlidersHorizontal, Search, Plus, SquarePen, Trash2, Eye } from "lucide-react";
import Layout from "./ItLayout";
import ItFilterModal from "./ItFilterModal";
import ConfirmModal from "./ConfirmModal";

function ActionIcon({ src, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="size-5 shrink-0 overflow-clip hover:opacity-70 cursor-pointer"
    >
      <img src={src} alt="" className="size-full" />
    </button>
  );
}

export function ToolbarAction({ action }) {
  const isDownload = action.icon === "download";
  const isLink = action.icon === "link";
  const boxed = isDownload || isLink || action.boxed;
  return (
    <button
      type="button"
      onClick={action.onClick}
      className={
        boxed
          ? `flex items-center justify-center gap-2 bg-[#052c65] h-[46px] rounded-[10px] text-white text-[16px] font-semibold shrink-0 cursor-pointer whitespace-nowrap px-4 ${isLink ? "min-w-[175px]" : "min-w-[160px]"}`
          : action.primary
            ? "flex items-center gap-2 bg-[#052C65] text-white text-[14px] font-bold rounded-[12px] py-2.5 px-4 shadow-sm cursor-pointer whitespace-nowrap"
            : "flex items-center gap-2 bg-white border border-gray-200 text-[#052C65] text-[14px] font-semibold rounded-[12px] py-2.5 px-4 shadow-sm cursor-pointer whitespace-nowrap"
      }
    >
      {isDownload ? (
        <>
          <span>{action.label}</span>
          <span className="size-6 shrink-0 overflow-clip">
            <img src="/it/icon-download.svg" alt="" className="size-full" />
          </span>
        </>
      ) : isLink ? (
        <>
          <span>{action.label}</span>
          <span className="size-6 shrink-0 overflow-clip">
            <img src="/it/icon-link.svg" alt="" className="size-full" />
          </span>
        </>
      ) : boxed ? (
        <>
          <span>{action.label}</span>
          <Plus size={24} strokeWidth={2} />
        </>
      ) : (
        <>
          {action.primary && <Plus size={16} strokeWidth={2.5} />}
          {action.label}
        </>
      )}
    </button>
  );
}

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
  onDelete,
  /** Optional per-row leading icon (إيقاف / تفعيل) — Figma 649:6456 */
  leadingAction,
  showActions = true,
  showDelete = true,
  viewWhenStatus,
  chips,
  searchBoxed = false,
  headerClassName = "bg-navy text-white text-[14px]",
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

  /** Row-level «إجراءات»: إيقاف · تعديل · حذف (Figma 649:6456 / 1057:2171). */
  const actionsColumn = {
    key: "__actions",
    label: "إجراءات",
    render: (r) => {
      const view = viewWhenStatus?.(r);
      const Icon = view ? Eye : SquarePen;
      const lead = leadingAction?.(r);
      return (
        <div className="flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
          {lead && (
            lead.src ? (
              <ActionIcon src={lead.src} label={lead.label} onClick={lead.onClick} />
            ) : (
              <button
                type="button"
                aria-label={lead.label}
                onClick={lead.onClick}
                className="text-primary hover:opacity-70 cursor-pointer"
              >
                {lead.node}
              </button>
            )
          )}
          <button
            type="button"
            aria-label={view ? "عرض" : "تعديل"}
            onClick={() => edit?.(r)}
            className="text-primary hover:opacity-70 cursor-pointer"
          >
            <Icon size={20} />
          </button>
          {showDelete && (
            <button
              type="button"
              aria-label="حذف"
              onClick={() => setPendingDelete(r)}
              className="text-danger hover:opacity-70 cursor-pointer"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      );
    },
  };

  const allColumns = showActions ? [...columns, actionsColumn] : columns;
  const visibleRows = rows.filter((r) => !removedIds.includes(r.id));

  return (
    <Layout title={title}>
      <div className="page-shell">
        <div className={`flex flex-wrap items-center mb-6 gap-4 ${listTitle ? "justify-between" : "justify-end"}`}>
          {listTitle && <h2 className="text-[18px] font-bold text-[#052c65] shrink-0">{listTitle}</h2>}
          {/* searchBoxed: dir=ltr + justify-start → filter/actions/search sit on the visual left (Figma) */}
          <div
            className={`flex min-w-0 flex-1 flex-wrap items-center gap-[15px] ${
              searchBoxed ? "justify-start" : "justify-end"
            }`}
            dir={searchBoxed ? "ltr" : undefined}
          >
            {searchBoxed && (
              <button
                onClick={() => setFilterOpen(true)}
                aria-label="تصفية"
                className="size-10 rounded-[13.333px] bg-[rgba(5,44,101,0.1)] flex items-center justify-center text-[#052c65] hover:opacity-80 shrink-0 cursor-pointer"
              >
                <SlidersHorizontal size={22} />
              </button>
            )}
            {searchBoxed && actions.map((a) => <ToolbarAction key={a.label} action={a} />)}
            <div className="relative min-w-0 flex-1 basis-[220px] sm:flex-none sm:basis-auto">
              <Search size={searchBoxed ? 16 : 15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className={
                  searchBoxed
                    ? "h-[46px] w-full sm:w-[315px] rounded-[10px] bg-[#f0f0f0] border border-[rgba(5,44,101,0.16)] pr-9 pl-4 text-[14px] text-right placeholder:text-black/30 outline-none focus:border-primary"
                    : "border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-full sm:w-64 text-right placeholder:text-gray-400"
                }
              />
            </div>
            {!searchBoxed && actions.map((a) => <ToolbarAction key={a.label} action={a} />)}
            {!searchBoxed && (
              <button
                onClick={() => setFilterOpen(true)}
                aria-label="تصفية"
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary shrink-0"
              >
                <SlidersHorizontal size={18} />
              </button>
            )}
          </div>
        </div>

        {chips && (
          <div className="flex flex-wrap items-center gap-3 mb-8 w-full" dir="rtl">
            {chips.map((c) => (
              <div
                key={c.label}
                className="flex-1 min-w-0 h-[73px] flex items-center justify-between px-3"
                dir="rtl"
                style={{
                  borderRadius: 12,
                  background: "#F7F9FB",
                  boxShadow: "1px 1px 1px 0 rgba(16, 25, 52, 0.40)",
                }}
              >
                <span className="text-[16px] font-bold text-[#1f254b] whitespace-nowrap text-right">
                  {c.label}
                </span>
                <span
                  className="text-[23px] font-bold shrink-0"
                  style={{ color: c.color }}
                >
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-[#D8D8D8]">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className={headerClassName}>
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
                    <td key={c.key} className={`py-4 px-4 whitespace-nowrap ${c.className || "text-center"}`} dir={c.dir}>
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
          const row = pendingDelete;
          setRemovedIds((ids) => [...ids, row.id]);
          onDelete?.(row);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </Layout>
  );
}
