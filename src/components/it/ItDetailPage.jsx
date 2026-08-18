import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "./ItLayout";

export function StatusChips({ chips }) {
  return (
    <div className="flex flex-wrap gap-4" dir="rtl">
      {chips.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-[12px] shadow-sm px-5 py-3 flex items-center gap-3 min-w-[130px]"
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
          <span className="text-[14px] text-[#404040]">{c.label}</span>
          <span className="text-[18px] font-bold mr-auto" style={{ color: c.color }}>{c.value}</span>
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

export function DetailTable({ columns, rows, onRowClick, emptyText = "لا توجد بيانات للعرض" }) {
  return (
    <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-[#D8D8D8]">
      <table className="w-full min-w-[900px] text-center border-collapse">
        <thead>
          <tr className="bg-navy text-white text-[14px]">
            {columns.map((c) => (
              <th key={c.key} className="py-3.5 px-4 font-semibold whitespace-nowrap">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id ?? i}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              className={`text-[14px] text-[#404040] ${onRowClick ? "cursor-pointer hover:bg-page transition-colors" : ""} ${
                i !== rows.length - 1 ? "border-b border-[#E9ECEF]" : ""
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className="py-4 px-4 whitespace-nowrap" dir={c.dir}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-muted text-[14px]">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Shell for the IT module's detail screens: breadcrumb → title → info tiles →
 * status chips → tab strip → tab body.
 */
export default function ItDetailPage({
  pageTitle,
  backTo,
  backLabel,
  heading,
  tiles = [],
  chips,
  tabs,
  children,
  actions,
}) {
  const [active, setActive] = useState(tabs?.[0]?.id);

  return (
    <Layout title={pageTitle}>
      <div className="px-8 pt-7 pb-10 space-y-6">
        <div className="flex items-center gap-2 text-[15px] text-muted" dir="rtl">
          <Link to={backTo} className="hover:text-primary">{backLabel}</Link>
          <ChevronLeft size={16} />
          <span className="text-[#052c65] font-semibold">{heading}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[27px] font-bold text-[#052c65]">{heading}</h2>
          {actions}
        </div>

        {tiles.length > 0 && (
          <div className="flex flex-wrap gap-5" dir="rtl">
            {tiles.map((t) => <InfoTile key={t.label} {...t} />)}
          </div>
        )}

        {chips && <StatusChips chips={chips} />}

        {tabs && (
          <>
            <div className="flex gap-8 border-b border-[#D8D8D8]" dir="rtl">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(t.id)}
                  className={`pb-3 text-[16px] transition-colors cursor-pointer ${
                    active === t.id
                      ? "text-[#052C65] font-bold border-b-[3px] border-[#0986ED]"
                      : "text-muted hover:text-[#052C65]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div>{tabs.find((t) => t.id === active)?.content}</div>
          </>
        )}

        {children}
      </div>
    </Layout>
  );
}
