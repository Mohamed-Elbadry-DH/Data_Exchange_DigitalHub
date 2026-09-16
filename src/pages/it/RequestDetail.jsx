import { useNavigate, useParams } from "react-router-dom";
import { FileText, Download, Paperclip, History } from "lucide-react";
import ItDetailPage from "../../components/it/ItDetailPage";
import { requestDetails, itRequests } from "../../data/mockIt";

const CARD_SHADOW = { boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" };

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-5" dir="rtl">
      {Icon && <Icon size={24} className="text-[#052c65] shrink-0" />}
      <h3 className="text-[22px] font-bold text-[#052c65] text-right">{children}</h3>
    </div>
  );
}

function InfoBar({ title, fields }) {
  return (
    <section
      className="bg-[#f8f9fa] rounded-[20px] px-6 pt-5 pb-6"
      style={CARD_SHADOW}
    >
      <h3 className="text-[22px] font-bold text-[#052c65] text-right mb-5">{title}</h3>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 w-full" dir="rtl">
        {fields.map(([label, value]) => (
          <p key={label} className="text-[16px] font-semibold text-[#1f254b] whitespace-nowrap shrink-0">
            {label} :
            <span className="font-medium text-[15px] text-[rgba(31,37,75,0.6)]"> {value}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function PairTable({ rows }) {
  return (
    <div className="border border-[#d8d8d8] rounded-[20px] overflow-hidden flex-1 min-w-0">
      <table className="w-full">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i !== rows.length - 1 ? "border-b border-[#d8d8d8]" : ""}>
              <th className="w-1/2 min-h-[54px] px-4 py-3 text-right text-[18px] font-semibold text-[#052c65] border-l border-[#d8d8d8] align-top">
                {label}
              </th>
              <td className="px-4 py-3 text-right text-[18px] font-normal text-[rgba(5,44,101,0.57)] align-top">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormDataCard({ title, infoRows, yearRows }) {
  return (
    <section className="bg-white rounded-[20px] p-6">
      <SectionTitle icon={FileText}>{title}</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] xl:gap-[78px]" dir="rtl">
        <PairTable rows={infoRows} />
        <PairTable rows={yearRows} />
      </div>
    </section>
  );
}

function Attachments({ files }) {
  return (
    <section className="bg-white rounded-[20px] p-6">
      <SectionTitle icon={Paperclip}>المرفقات</SectionTitle>
      <ul className="flex flex-col gap-[30px]" dir="rtl">
        {files.map((f) => {
          const src = f.type === "Excel" ? "/it/file-xls.png" : "/it/file-pdf.png";
          return (
            <li
              key={f.name}
              className="flex items-center gap-4 bg-[#f8f9fa] border border-[#d8d8d8] rounded-[15px] h-[47px] px-6"
            >
              <img src={src} alt="" className="size-6 shrink-0 object-contain" />
              <span className="flex-1 text-[18px] font-medium text-[#052c65] truncate text-right">
                {f.name}
              </span>
              <button
                type="button"
                className="text-[#0986ed] hover:opacity-70 cursor-pointer shrink-0"
                aria-label={`تحميل ${f.name}`}
              >
                <Download size={24} />
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
    <section className="bg-white rounded-[20px] p-6">
      <SectionTitle icon={History}>سجل النشاط</SectionTitle>
      <ol className="flex flex-col" dir="rtl">
        {events.map((e, i) => {
          const sent = i === 0;
          const src = sent ? "/it/timeline-sent.png" : "/it/timeline-created.png";
          return (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <img src={src} alt="" className="size-[45px] object-contain" />
                {i !== events.length - 1 && (
                  <span className="w-px flex-1 min-h-[40px] bg-[#0986ed]/40 my-1" />
                )}
              </div>
              <div className="text-right pb-6">
                <div className="text-[18px] font-bold text-[#1f254b]">{e.title}</div>
                <div className="text-[16px] font-medium text-[#adb5bd] mt-0.5">{e.by}</div>
                <div className="text-[14px] text-[#0986ed]" dir="ltr">{e.at}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** تفاصيل طلب — Figma 649:7905 */
export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listRow = itRequests.find((r) => r.id === id);
  const base = requestDetails[id] || requestDetails["REQ-2024-085"];
  const req = listRow
    ? {
        ...base,
        id: listRow.id,
        admin: listRow.admin,
        type: listRow.type,
        submitted: listRow.submitted,
        due: listRow.due,
      }
    : base;

  const infoRows = Object.entries(req.info);
  const yearRows = Object.entries(req.yearInfo);

  return (
    <ItDetailPage
      pageTitle="الطلبات"
      backTo="/it/requests"
      backLabel="الطلبات"
      heading={req.name}
      showHeading={false}
      footer={(
        <div className="sticky bottom-0 z-10 h-[87px] bg-[#f9f9f9] border-t border-[#eaeaeb] px-4 sm:px-6 xl:px-8">
          <div className="h-full w-full flex items-center justify-end" dir="rtl">
            <button
              type="button"
              onClick={() => navigate("/it/forms/new")}
              className="bg-[#0986ed] text-white text-[22px] font-medium rounded-[11px] h-[57px] w-[259px] cursor-pointer"
            >
              إنشاء نموذج البيان
            </button>
          </div>
        </div>
      )}
    >
      <div className="space-y-8">
        <InfoBar
          title="معلومات الطلب"
          fields={[
            ["رقم الطلب", req.id],
            ["نوع الطلب", req.type],
            ["الإدارة", req.admin],
            ["المرسل بواسطة", req.sentBy],
            ["تاريخ تقديم الطلب", req.submitted],
            ["الموعد النهائي", req.due],
          ]}
        />
        <FormDataCard title="بيانات نموذج البيان" infoRows={infoRows} yearRows={yearRows} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Attachments files={req.attachments} />
          <Timeline events={req.timeline} />
        </div>
      </div>
    </ItDetailPage>
  );
}
