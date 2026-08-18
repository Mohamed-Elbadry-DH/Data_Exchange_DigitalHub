import { FileSpreadsheet, FileText, Check, LoaderCircle, Clock } from "lucide-react";
import { FORM_BUILD_STEPS, FORM_BUILD_STATUS } from "../../../domain/workflow";
import { structureCounts } from "./formBuilderState";

const UNSET = "غير محدد";

function SummaryCard({ meta }) {
  const entries = {
    "اسم البيان": meta.title || UNSET,
    "الجهة المسؤولة": meta.entity || UNSET,
    "السنة": meta.year || UNSET,
    "موعد الاستحقاق": meta.dueDate || UNSET,
  };
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-5">ملخص التحقق</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4" dir="rtl">
        {Object.entries(entries).map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 border-b border-[#E9ECEF] pb-3">
            <dt className="text-[14px] text-muted">{k}</dt>
            <dd className={`text-[16px] font-medium ${v === UNSET ? "text-[#ADB5BD]" : "text-[#052c65]"}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function StructureSummary({ structure }) {
  const c = structureCounts(structure);
  const empty = c.columns === 0;
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-5">هيكل الجدول</h3>
      {empty ? (
        <p className="text-[16px] text-[#ADB5BD] text-right">لم يتم إضافة أعمدة</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-right" dir="rtl">
          {[
            ["المجموعات الرئيسية", c.groups],
            ["الأقسام الفرعية", c.subsections],
            ["الأعمدة", c.columns],
            ["الصفوف", c.rows],
          ].map(([label, value]) => (
            <li key={label} className="border border-[#E9ECEF] rounded-[10px] px-4 py-3">
              <div className="text-[14px] text-muted">{label}</div>
              <div className="text-[22px] font-bold text-[#0986ed]">{value}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ExportOptions() {
  const btn =
    "flex items-center gap-2 border border-[#d8d8d8] bg-[#f8f9fa] rounded-[12px] px-5 py-3 text-[16px] text-[#052c65] cursor-pointer hover:border-[#0986ed] transition-colors";
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-5">خيارات التصدير</h3>
      <div className="flex flex-wrap gap-4 justify-end" dir="rtl">
        <button type="button" className={btn}>
          <FileSpreadsheet size={20} className="text-[#16A34A]" />
          تصدير Excel
        </button>
        <button type="button" className={btn}>
          <FileText size={20} className="text-[#DC2626]" />
          تصدير PDF
        </button>
      </div>
    </section>
  );
}

const STATUS_VISUAL = {
  [FORM_BUILD_STATUS.DONE]: { icon: Check, bg: "#16A34A", fg: "#16A34A" },
  [FORM_BUILD_STATUS.ACTIVE]: { icon: LoaderCircle, bg: "#0986ED", fg: "#0986ED" },
  [FORM_BUILD_STATUS.WAITING]: { icon: Clock, bg: "#ADB5BD", fg: "#ADB5BD" },
};

/**
 * «مسار الاعتماد» — the four-stage template approval path from
 * FORM_BUILD_STEPS. Distinct from the request lifecycle in STAGES.
 */
function ApprovalPath({ statuses }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-6">مسار الاعتماد</h3>
      <ol className="flex flex-wrap items-start justify-between gap-6" dir="rtl">
        {FORM_BUILD_STEPS.map((s, i) => {
          const status = statuses[i];
          const v = STATUS_VISUAL[status];
          const Icon = v.icon;
          return (
            <li key={s.id} className="flex-1 min-w-[170px] flex flex-col items-center gap-2 text-center">
              <span
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white"
                style={{ background: v.bg }}
              >
                <Icon size={24} strokeWidth={status === FORM_BUILD_STATUS.DONE ? 3 : 2} />
              </span>
              <span className="text-[16px] font-semibold text-[#052c65]">{s.label}</span>
              <span className="text-[13px] text-muted">{s.owner}</span>
              <span className="text-[13px] font-medium" style={{ color: v.fg }}>{status}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Step 3 — مراجعة و إرسال (Figma 645:3331) */
export default function StepReview({ meta, structure }) {
  const { DONE, ACTIVE, WAITING } = FORM_BUILD_STATUS;
  const statuses = [DONE, ACTIVE, WAITING, WAITING];

  return (
    <div className="space-y-6">
      <p className="text-[18px] text-muted text-right">راجع البيانات قبل الإرسال للاعتماد</p>
      <SummaryCard meta={meta} />
      <StructureSummary structure={structure} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExportOptions />
        <ApprovalPath statuses={statuses} />
      </div>
    </div>
  );
}
