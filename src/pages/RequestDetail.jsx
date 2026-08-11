import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, User, Monitor, RefreshCw, Download, FileSpreadsheet, FileIcon, Plus,
} from "lucide-react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import SuccessModal from "../components/SuccessModal";
import { requestDetail as d } from "../data/mock";

function InfoTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 flex items-center gap-4 shadow-sm">
      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div className="text-right">
        <div className="text-[13px] text-muted">{label}</div>
        <div className="text-[15px] font-bold text-[rgba(0,0,0,0.9)]">{value}</div>
        {sub && <div className="text-[12px] text-muted">{sub}</div>}
      </div>
    </div>
  );
}

function KVTable({ data }) {
  const entries = Object.entries(data);
  return (
    <table className="w-full text-right text-[14px]">
      <tbody>
        {entries.map(([k, v], i) => (
          <tr key={k} className={i !== entries.length - 1 ? "border-b border-gray-100" : ""}>
            <td className="py-3.5 px-5 w-1/2 text-[#404040] leading-relaxed">{v}</td>
            <td className="py-3.5 px-5 w-1/2 font-semibold text-[rgba(0,0,0,0.9)] bg-page/60">{k}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FormDataTab() {
  return (
    <div className="overflow-auto">
      <table className="w-full text-center text-[13px] border-collapse">
        <thead>
          <tr>
            <th rowSpan={3} className="bg-page border border-gray-100 px-4 py-3 font-bold text-[rgba(0,0,0,0.9)]">التخصص</th>
            <th colSpan={6} className="bg-page border border-gray-100 px-4 py-2 font-bold">مصري</th>
            <th colSpan={6} className="bg-page border border-gray-100 px-4 py-2 font-bold">وافد</th>
          </tr>
          <tr>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2">دبلوم</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2">ماجستير</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2">دكتوراه</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2">دبلوم</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2">ماجستير</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2">دكتوراه</th>
          </tr>
          <tr className="text-muted">
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={i}>
                <th className="border border-gray-100 px-3 py-2">ذكور</th>
                <th className="border border-gray-100 px-3 py-2">إناث</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {d.formTable.specialties.map((s) => (
            <tr key={s} className="text-[#404040]">
              <td className="border border-gray-100 px-4 py-3 font-semibold bg-page/50">{s}</td>
              {Array.from({ length: 12 }).map((_, i) => (
                <td key={i} className="border border-gray-100 px-4 py-3">-</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FulfillmentTab() {
  const rows = d.fulfillmentTable.rows;
  const cols = [
    ["دبلوم", "m"], ["دبلوم", "f"], ["ماجستير", "m"], ["ماجستير", "f"],
    ["دكتوراه", "m"], ["دكتوراه", "f"],
  ];
  return (
    <div className="overflow-auto">
      <table className="w-full text-center text-[13px] border-collapse">
        <thead>
          <tr>
            <th rowSpan={2} className="bg-page border border-gray-100 px-4 py-3 font-bold">التخصص</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2 font-bold">دبلوم</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2 font-bold">ماجستير</th>
            <th colSpan={2} className="bg-page border border-gray-100 px-3 py-2 font-bold">دكتوراه</th>
            <th colSpan={3} className="bg-page border border-gray-100 px-3 py-2 font-bold">الإجمالي</th>
          </tr>
          <tr className="text-muted">
            <th className="border border-gray-100 px-3 py-2">ذكور</th>
            <th className="border border-gray-100 px-3 py-2">إناث</th>
            <th className="border border-gray-100 px-3 py-2">ذكور</th>
            <th className="border border-gray-100 px-3 py-2">إناث</th>
            <th className="border border-gray-100 px-3 py-2">ذكور</th>
            <th className="border border-gray-100 px-3 py-2">إناث</th>
            <th className="border border-gray-100 px-3 py-2">ذكور</th>
            <th className="border border-gray-100 px-3 py-2">إناث</th>
            <th className="border border-gray-100 px-3 py-2">الإجمالي الكلي</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.specialty} className="text-[#404040]">
              <td className="border border-gray-100 px-4 py-3 font-semibold bg-page/50">{r.specialty}</td>
              <td className="border border-gray-100 px-4 py-3">{r.dipM}</td>
              <td className="border border-gray-100 px-4 py-3">{r.dipF}</td>
              <td className="border border-gray-100 px-4 py-3">{r.msM}</td>
              <td className="border border-gray-100 px-4 py-3">{r.msF}</td>
              <td className="border border-gray-100 px-4 py-3">{r.phdM}</td>
              <td className="border border-gray-100 px-4 py-3">{r.phdF}</td>
              <td className="border border-gray-100 px-4 py-3">{r.m}</td>
              <td className="border border-gray-100 px-4 py-3">{r.f}</td>
              <td className="border border-gray-100 px-4 py-3 font-bold">{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AttachmentsTab() {
  return (
    <table className="w-full text-right text-[14px]">
      <thead>
        <tr className="bg-navy text-white">
          <th className="py-3 px-5 font-semibold">إجراءات</th>
          <th className="py-3 px-5 font-semibold">رفع بواسطة</th>
          <th className="py-3 px-5 font-semibold">الحجم</th>
          <th className="py-3 px-5 font-semibold">تاريخ الرفع</th>
          <th className="py-3 px-5 font-semibold">نوع الملف</th>
          <th className="py-3 px-5 font-semibold">اسم الملف</th>
        </tr>
      </thead>
      <tbody>
        {d.attachments.map((a, i) => (
          <tr key={i} className="border-b border-gray-100 text-[#404040]">
            <td className="py-3.5 px-5"><button className="text-primary"><Download size={17} /></button></td>
            <td className="py-3.5 px-5">{a.by}</td>
            <td className="py-3.5 px-5">{a.size}</td>
            <td className="py-3.5 px-5">{a.date}</td>
            <td className="py-3.5 px-5 flex items-center gap-2">
              {a.type === "Excel" ? <FileSpreadsheet size={16} className="text-success" /> : <FileIcon size={16} className="text-danger" />}
              {a.type}
            </td>
            <td className="py-3.5 px-5 font-medium">{a.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NotesTab() {
  return (
    <div className="border border-gray-100 rounded-xl p-5 flex items-center justify-between">
      <button className="bg-navy text-white rounded-lg px-4 py-2.5 text-[14px] flex items-center gap-2 shrink-0">
        <Plus size={16} /> إضافة ملاحظة
      </button>
      <span className="text-muted text-[14px]">اضف أي ملاحظات او معلومات إضافية تتعلق بهذا النموذج ....</span>
    </div>
  );
}

export default function RequestDetail({ mode = "forms" }) {
  const isRequired = mode === "required";
  const tabs = isRequired
    ? [
        { key: "info", label: "بيانات نموذج البيان" },
        { key: "form", label: "نموذج البيان" },
        { key: "fulfillment", label: "استيفاء البيانات" },
        { key: "attachments", label: "المرفقات" },
        { key: "notes", label: "الملاحظات" },
      ]
    : [
        { key: "info", label: "بيانات نموذج البيان" },
        { key: "form", label: "نموذج البيان" },
        { key: "attachments", label: "المرفقات" },
        { key: "notes", label: "الملاحظات" },
      ];

  const [tab, setTab] = useState("info");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const backTo = isRequired ? "/required" : "/forms";
  const backLabel = isRequired ? "البيانات المطلوبة" : "نماذج البيان";

  return (
    <Layout title={d.title} breadcrumb={backLabel}>
      <div className="p-8 space-y-6">
        <div className="flex gap-5 flex-wrap">
          <InfoTile icon={Clock} label="موعد الانتهاء" value={d.due} />
          <InfoTile icon={User} label="الموظف المختص" value={d.officer} sub={d.officerRole} />
          <InfoTile icon={Monitor} label="الجهة الخارجية" value={d.org} />
          <InfoTile icon={RefreshCw} label="الحالة" value={<StatusBadge status={d.status} />} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-7 py-4 text-[15px] font-semibold border-b-2 transition-colors ${
                  tab === t.key ? "text-primary border-primary" : "text-muted border-transparent hover:text-[#404040]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === "info" && (
              <div className="grid grid-cols-2 gap-6">
                <KVTable data={d.yearInfo} />
                <KVTable data={d.info} />
              </div>
            )}
            {tab === "form" && <FormDataTab />}
            {tab === "fulfillment" && <FulfillmentTab />}
            {tab === "attachments" && <AttachmentsTab />}
            {tab === "notes" && <NotesTab />}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setSuccess(true)}
            className="bg-success text-white rounded-lg px-8 py-3 text-[15px] font-semibold"
          >
            {isRequired ? "اعتماد نهائي و إرساله" : "اعتماد و إرسال"}
          </button>
          <button className="bg-primary text-white rounded-lg px-8 py-3 text-[15px] font-semibold">
            طلب تعديل
          </button>
        </div>
      </div>

      <SuccessModal
        open={success}
        message={isRequired ? "تم اعتماد البيانات المطلوبة و إرسالها" : "تم اعتماد نموذج البيان و إرساله"}
        onClose={() => { setSuccess(false); navigate(backTo); }}
      />
    </Layout>
  );
}
