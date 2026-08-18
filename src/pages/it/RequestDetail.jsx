import { useParams } from "react-router-dom";
import { FileSpreadsheet, FileText, Download, Check } from "lucide-react";
import ItDetailPage from "../../components/it/ItDetailPage";
import { requestDetails, itRequests } from "../../data/mockIt";

function KVCard({ title, entries }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-5">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4" dir="rtl">
        {Object.entries(entries).map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 border-b border-[#E9ECEF] pb-3 last:border-0">
            <dt className="text-[14px] text-muted">{k}</dt>
            <dd className="text-[16px] text-[#052c65] font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Attachments({ files }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-5">المرفقات</h3>
      <ul className="flex flex-col gap-3" dir="rtl">
        {files.map((f) => {
          const Icon = f.type === "Excel" ? FileSpreadsheet : FileText;
          const tint = f.type === "Excel" ? "#16A34A" : "#DC2626";
          return (
            <li
              key={f.name}
              className="flex items-center gap-4 border border-[#E9ECEF] rounded-[10px] px-4 py-3"
            >
              <Icon size={24} style={{ color: tint }} className="shrink-0" />
              <span className="flex-1 text-[15px] text-[#052c65] truncate">{f.name}</span>
              <button type="button" className="text-muted hover:text-primary cursor-pointer" aria-label={`تحميل ${f.name}`}>
                <Download size={20} />
              </button>
            </li>
          );
        })}
        {files.length === 0 && <li className="text-muted text-[15px]">لا توجد مرفقات</li>}
      </ul>
    </section>
  );
}

function Timeline({ events }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm p-6">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-5">سجل الطلب</h3>
      <ol className="flex flex-col gap-6" dir="rtl">
        {events.map((e, i) => (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <span className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center">
                <Check size={18} className="text-white" strokeWidth={3} />
              </span>
              {i !== events.length - 1 && <span className="flex-1 w-px bg-[#DEE2E6] mt-1" />}
            </div>
            <div className="text-right pb-2">
              <div className="text-[16px] font-semibold text-[#052c65]">{e.title}</div>
              <div className="text-[14px] text-muted mt-1">{e.by}</div>
              <div className="text-[13px] text-muted" dir="ltr">{e.at}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function RequestDetail() {
  const { id } = useParams();
  const listRow = itRequests.find((r) => r.id === id);
  const base = requestDetails[id] || requestDetails["REQ-2024-085"];
  const req = listRow
    ? { ...base, id: listRow.id, admin: listRow.admin, type: listRow.type, submitted: listRow.submitted, due: listRow.due }
    : base;

  return (
    <ItDetailPage
      pageTitle="الطلبات"
      backTo="/it/requests"
      backLabel="الطلبات"
      heading={req.name}
    >
      <div className="space-y-6">
        <KVCard
          title="معلومات الطلب"
          entries={{
            "رقم الطلب :": req.id,
            "نوع الطلب :": req.type,
            "الإدارة :": req.admin,
            "المرسل بواسطة :": req.sentBy,
            "تاريخ تقديم الطلب :": req.submitted,
            "الموعد النهائي :": req.due,
          }}
        />
        <KVCard title="بيانات نموذج البيان" entries={req.info} />
        <KVCard title="بيانات الدورية و التوقيتات" entries={req.yearInfo} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Attachments files={req.attachments} />
          <Timeline events={req.timeline} />
        </div>
      </div>
    </ItDetailPage>
  );
}
