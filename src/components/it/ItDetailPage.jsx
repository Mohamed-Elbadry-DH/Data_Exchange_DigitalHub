import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Search, SquarePen, Trash2, Eye, SlidersHorizontal } from "lucide-react";
import Layout from "./ItLayout";
import ConfirmModal from "./ConfirmModal";
import ItFilterModal from "./ItFilterModal";
import { ToolbarAction } from "./ItListPage";

export function StatusChips({ chips }) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full" dir="rtl">
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
          <span className="text-[23px] font-bold shrink-0" style={{ color: c.color }}>
            {c.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InfoTile({ label, value }) {
  return (
    <div className="bg-white rounded-[15px] shadow-sm px-5 py-4 min-w-[190px] flex-1 text-right">
      <div className="text-[14px] text-muted">{label}</div>
      <div className="text-[20px] font-bold text-[#052c65] mt-1">{value}</div>
    </div>
  );
}

function ActionIcon({ src, label, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`size-5 shrink-0 overflow-clip hover:opacity-70 cursor-pointer ${className}`}
    >
      <img src={src} alt="" className="size-full" />
    </button>
  );
}

/**
 * `showActions` appends a shared إجراءات column. Optional `leadingAction`
 * renders an extra icon to the right of edit (git-compare / pause / play).
 */
export function DetailTable({
  title,
  columns,
  rows,
  onRowClick,
  onEdit,
  onDelete,
  showActions = false,
  showDelete = true,
  viewWhenStatus,
  leadingAction,
  searchable = false,
  searchBoxed = false,
  searchKeys = [],
  searchPlaceholder = "بحث",
  emptyText = "لا توجد بيانات للعرض",
  chips,
  actions = [],
  filterFields = [],
  onClearFilters,
  headerClassName = "bg-[#052c65] text-white text-[16px]",
}) {
  const [search, setSearch] = useState("");
  const [removedIds, setRemovedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const edit = onEdit || onRowClick;

  const actionsColumn = {
    key: "__actions",
    label: "إجراءات",
    render: (r) => {
      const view = viewWhenStatus?.(r);
      const lead = leadingAction?.(r);
      return (
        <div className="flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
          {lead && (
            lead.src ? (
              <ActionIcon src={lead.src} label={lead.label} onClick={lead.onClick} />
            ) : (
              <button type="button" aria-label={lead.label} onClick={lead.onClick} className="text-primary hover:opacity-70 cursor-pointer">
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
            {view ? <Eye size={20} /> : <SquarePen size={20} />}
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
  const visibleRows = rows.filter((r) => {
    if (removedIds.includes(r.id)) return false;
    if (!searchable || !search.trim()) return true;
    return searchKeys.some((k) => String(r[k] ?? "").includes(search.trim()));
  });

  const toolbar = searchable || title || actions.length > 0 || chips;

  return (
    <div className="space-y-4">
      {toolbar && (
        <div className={`flex items-center gap-4 ${title ? "justify-between" : "justify-end"}`}>
          {title && <h3 className="text-[22px] font-bold text-[#052c65] shrink-0 text-right">{title}</h3>}
          {/* searchBoxed: dir=ltr + justify-start → actions on visual left (Figma) */}
          <div
            className={`flex flex-1 items-center gap-[15px] ${searchBoxed ? "justify-start" : "justify-end"}`}
            dir={searchBoxed ? "ltr" : undefined}
          >
            {searchBoxed && filterFields.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                aria-label="تصفية"
                className="size-10 rounded-[13.333px] bg-[rgba(5,44,101,0.1)] flex items-center justify-center text-[#052c65] hover:opacity-80 shrink-0 cursor-pointer"
              >
                <SlidersHorizontal size={22} />
              </button>
            )}
            {searchBoxed && actions.map((a) => <ToolbarAction key={a.label} action={a} />)}
            {searchable && (
              <div className="relative">
                <Search size={searchBoxed ? 16 : 15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={
                    searchBoxed
                      ? "h-[46px] w-[315px] rounded-[10px] bg-[#f0f0f0] border border-[rgba(5,44,101,0.16)] pr-9 pl-4 text-[14px] text-right placeholder:text-black/30 outline-none focus:border-primary"
                      : "border border-gray-200 rounded-full pr-9 pl-4 py-2 text-[13px] w-64 text-right placeholder:text-gray-400"
                  }
                />
              </div>
            )}
            {!searchBoxed && actions.map((a) => <ToolbarAction key={a.label} action={a} />)}
            {!searchBoxed && filterFields.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                aria-label="تصفية"
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary shrink-0 cursor-pointer"
              >
                <SlidersHorizontal size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {chips && <div className="mb-2"><StatusChips chips={chips} /></div>}

      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-[#D8D8D8]">
        <table className="w-full min-w-[900px] border-collapse">
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
                key={r.id ?? i}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={`text-[14px] text-[#404040] ${onRowClick ? "cursor-pointer hover:bg-page transition-colors" : ""} ${
                  i !== visibleRows.length - 1 ? "border-b border-[#E9ECEF]" : ""
                }`}
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

      {filterFields.length > 0 && (
        <ItFilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onClear={() => { onClearFilters?.(); setFilterOpen(false); }}
          fields={filterFields}
        />
      )}

      {showActions && (
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
      )}
    </div>
  );
}

/**
 * Shell for the IT module's detail screens: breadcrumb → title → info tiles →
 * status chips → tab strip → tab body.
 *
 * `cardTabs` wraps the tab strip in the Figma 645:5076 white card
 * (radius 20, blue border, 25px labels).
 */
export default function ItDetailPage({
  pageTitle,
  backTo,
  backLabel,
  midCrumb,
  heading,
  headingTone = "navy",
  tiles = [],
  chips,
  tabs,
  children,
  actions,
  showHeading = true,
  cardTabs = false,
  footer,
}) {
  const [active, setActive] = useState(tabs?.[0]?.id);
  const activeTab = tabs?.find((t) => t.id === active);
  const activeChips = activeTab && "chips" in activeTab ? activeTab.chips : chips;

  const crumbLast = headingTone === "primary" ? "text-primary font-semibold" : "text-[#052c65] font-semibold";

  const tabStrip = tabs && (
    <div className={`flex ${cardTabs ? "" : "gap-8 border-b border-[#D8D8D8]"}`} dir="rtl">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setActive(t.id)}
          className={
            cardTabs
              ? `flex-1 h-[75px] text-[25px] font-medium cursor-pointer ${
                  active === t.id
                    ? "text-[#052C65] border-b-2 border-[#0986ed]"
                    : "text-[#052C65] border-b border-[#eaeaeb] hover:opacity-80"
                }`
              : `pb-3 text-[16px] transition-colors cursor-pointer ${
                  active === t.id
                    ? "text-[#052C65] font-bold border-b-[3px] border-[#0986ED]"
                    : "text-muted hover:text-[#052C65]"
                }`
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <Layout title={pageTitle}>
      <div className="flex min-h-full flex-col">
      <div className="page-shell space-y-6 flex-1">
        <div className={`flex items-center gap-2 text-right ${cardTabs || headingTone === "primary" ? "" : "text-[15px] text-muted"}`} dir="rtl">
          <Link to={backTo} className={cardTabs || headingTone === "primary" ? "text-[20px] font-medium text-[#adb5bd] hover:text-primary" : "hover:text-primary"}>{backLabel}</Link>
          {midCrumb && (
            <>
              <ChevronLeft size={cardTabs || headingTone === "primary" ? 22 : 16} className="text-[#adb5bd] shrink-0" />
              {midCrumb.to ? (
                <Link to={midCrumb.to} className={cardTabs || headingTone === "primary" ? "text-[20px] font-medium text-[#adb5bd] hover:text-primary" : "hover:text-primary"}>{midCrumb.label}</Link>
              ) : (
                <span className={cardTabs || headingTone === "primary" ? "text-[20px] font-medium text-[#adb5bd]" : ""}>{midCrumb.label}</span>
              )}
            </>
          )}
          <ChevronLeft size={cardTabs || headingTone === "primary" ? 22 : 16} className="text-[#adb5bd] shrink-0" />
          <span className={cardTabs || headingTone === "primary" ? `text-[22px] ${crumbLast}` : crumbLast}>{heading}</span>
        </div>

        {(showHeading !== false || actions) && (
        <div
          className={`flex items-center gap-4 ${
            showHeading !== false ? "justify-between" : "justify-start"
          }`}
          dir={showHeading === false && actions ? "ltr" : undefined}
        >
          {showHeading !== false && <h2 className="text-[27px] font-bold text-[#052c65]">{heading}</h2>}
          {actions}
        </div>
        )}

        {tiles.length > 0 && (
          <div className="flex flex-wrap gap-5" dir="rtl">
            {tiles.map((t) => <InfoTile key={t.label} {...t} />)}
          </div>
        )}

        {!cardTabs && activeChips && <StatusChips chips={activeChips} />}

        {tabs && cardTabs && (
          <div className="rounded-[20px] border border-[rgba(9,134,237,0.41)] overflow-hidden bg-white">
            {tabStrip}
            <div className="px-8 py-8">{activeTab?.content}</div>
          </div>
        )}

        {tabs && !cardTabs && (
          <>
            {tabStrip}
            <div>{activeTab?.content}</div>
          </>
        )}

        {children}
      </div>
      {footer}
      </div>
    </Layout>
  );
}
