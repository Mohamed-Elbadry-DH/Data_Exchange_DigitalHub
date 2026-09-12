import { CircleAlert, Download, History } from "lucide-react";
import { FORM_BUILD_STEPS, FORM_BUILD_STATUS } from "../../../domain/workflow";
import { structureCounts } from "./formBuilderState";
import { downloadCsv, downloadText } from "../exportDownload";

const UNSET = "غير محدد";

function SummaryRow({ label, value, empty }) {
  return (
    <div className="flex items-center justify-between border-b border-[#d8d8d8] pb-4" dir="rtl">
      <div className="flex items-center gap-3">
        <CircleAlert size={16} className="text-[#0986ed] shrink-0" />
        <span className="text-[15px] font-semibold text-[#052c65]">{label}</span>
      </div>
      <span className={`text-[15px] font-semibold ${empty ? "text-[#c89637]" : "text-[#052c65]"}`}>
        {value}
      </span>
    </div>
  );
}

function SummaryCard({ meta, structure }) {
  const c = structureCounts(structure);
  const structureValue = c.columns === 0 ? "لم يتم إضافة أعمدة" : `${c.columns} أعمدة`;
  return (
    <section className="bg-white border border-[#d8d8d8] rounded-[16px] p-5 flex flex-col gap-5 min-h-0">
      <div className="flex items-center gap-3 justify-end" dir="rtl">
        <CircleAlert size={18} className="text-[#0986ed] shrink-0" />
        <h3 className="text-[18px] font-bold text-[#052c65]">ملخص التحقق</h3>
      </div>
      <div className="flex flex-col gap-4">
        <SummaryRow label="اسم البيان" value={meta.title || UNSET} empty={!meta.title} />
        <SummaryRow label="الجهة المسؤولة" value={meta.entity || UNSET} empty={!meta.entity} />
        <SummaryRow label="السنة" value={meta.year || UNSET} empty={!meta.year} />
        <SummaryRow label="موعد الاستحقاق" value={meta.dueDate || UNSET} empty={!meta.dueDate} />
        <SummaryRow label="هيكل الجدول" value={structureValue} empty={c.columns === 0} />
      </div>
    </section>
  );
}

function ExportOptions({ meta, structure }) {
  const row =
    "w-full h-[46px] bg-[#f8f9fa] border border-[#d8d8d8] rounded-[12px] flex items-center px-4 gap-3 cursor-pointer hover:border-[#0986ed]";
  const c = structureCounts(structure);

  const exportExcel = () => {
    downloadCsv(
      "ملخص_نموذج_البيان.csv",
      ["الحقل", "القيمة"],
      [
        ["اسم البيان", meta.title || UNSET],
        ["الجهة المسؤولة", meta.entity || UNSET],
        ["السنة", meta.year || UNSET],
        ["موعد الاستحقاق", meta.dueDate || UNSET],
        ["عدد الأعمدة", c.columns],
        ["عدد المجموعات", c.groups],
        ["عدد الصفوف", c.rows],
      ],
    );
  };

  const exportPdf = () => {
    const body = [
      "ملخص نموذج البيان",
      "────────────────────",
      `اسم البيان: ${meta.title || UNSET}`,
      `الجهة المسؤولة: ${meta.entity || UNSET}`,
      `السنة: ${meta.year || UNSET}`,
      `موعد الاستحقاق: ${meta.dueDate || UNSET}`,
      `هيكل الجدول: ${c.columns} أعمدة · ${c.groups} مجموعات · ${c.rows} صفوف`,
      "",
      "(ملف نصي مؤقت — استبدال بـ PDF عند ربط التصدير الحقيقي)",
    ].join("\n");
    downloadText("ملخص_نموذج_البيان.txt", body);
  };

  return (
    <section className="bg-white border border-[#d8d8d8] rounded-[16px] p-5 flex flex-col gap-5 min-h-0">
      <div className="flex items-center gap-3 justify-end" dir="rtl">
        <Download size={18} className="text-[#052c65] shrink-0" />
        <h3 className="text-[18px] font-bold text-[#052c65]">خيارات التصدير</h3>
      </div>
      <div className="flex flex-col gap-4" dir="rtl">
        <button type="button" className={row} onClick={exportExcel}>
          <img src="/it/file-xls.png" alt="" className="size-5 object-contain" />
          <span className="flex-1 text-[15px] font-medium text-[#052c65] text-right">تصدير Excel</span>
          <Download size={18} className="text-[#052c65] shrink-0" />
        </button>
        <button type="button" className={row} onClick={exportPdf}>
          <img src="/it/file-pdf.png" alt="" className="size-5 object-contain" />
          <span className="flex-1 text-[15px] font-medium text-[#052c65] text-right">تصدير PDF</span>
          <Download size={18} className="text-[#052c65] shrink-0" />
        </button>
      </div>
    </section>
  );
}

const STATUS_VISUAL = {
  [FORM_BUILD_STATUS.DONE]: { src: "/it/timeline-sent.png", color: "#16a34a" },
  [FORM_BUILD_STATUS.ACTIVE]: { src: "/it/timeline-created.png", color: "#0986ed" },
  [FORM_BUILD_STATUS.WAITING]: { src: "/it/timeline-created.png", color: "#adb5bd" },
};

function ApprovalPath({ statuses }) {
  return (
    <section className="bg-white border border-[#d8d8d8] rounded-[16px] p-5">
      <div className="flex items-center gap-3 justify-end mb-5" dir="rtl">
        <History size={18} className="text-[#052c65] shrink-0" />
        <h3 className="text-[18px] font-bold text-[#052c65]">مسار الاعتماد</h3>
      </div>
      <ol className="flex flex-col" dir="rtl">
        {FORM_BUILD_STEPS.map((s, i) => {
          const status = statuses[i];
          const v = STATUS_VISUAL[status];
          return (
            <li key={s.id} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <img src={v.src} alt="" className="size-9 object-contain" />
                {i !== FORM_BUILD_STEPS.length - 1 && (
                  <span className="w-px flex-1 min-h-[28px] bg-[#0986ed]/40 my-1" />
                )}
              </div>
              <div className="text-right pb-4">
                <div className="text-[15px] font-bold text-[#1f254b]">{s.label}</div>
                <div className="text-[13px] font-medium text-[#adb5bd]">{s.owner}</div>
                <div className="text-[12px] font-normal" style={{ color: v.color }}>{status}</div>
              </div>
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
    <div className="space-y-5">
      <div className="text-right">
        <h2 className="text-[18px] font-bold text-[#052c65]">مراجعة وإرسال</h2>
        <p className="text-[14px] font-medium text-[#adb5bd] mt-1">راجع البيانات قبل الإرسال للاعتماد</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start" dir="rtl">
        <div className="flex flex-col gap-5 min-w-0">
          <SummaryCard meta={meta} structure={structure} />
          <ApprovalPath statuses={statuses} />
        </div>
        <ExportOptions meta={meta} structure={structure} />
      </div>
    </div>
  );
}
