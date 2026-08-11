import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock, User, Monitor, FileClock, Download, FileSpreadsheet, FileIcon, Plus,
} from "lucide-react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import SuccessModal from "../components/SuccessModal";
import RequestEditModal from "../components/RequestEditModal";
import { requestDetailById } from "../data/mock";

function InfoTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 flex items-center gap-4 shadow-sm">
      <div
        className="w-[60px] h-[60px] rounded-[15px] flex items-center justify-center shrink-0"
        style={{ background: "#2563EB4D" }}
      >
        <Icon size={36} className="text-[#2563EB]" />
      </div>
      <div className="text-right min-w-0">
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
    <div className="relative rounded-xl overflow-hidden border border-[#D8D8D8] bg-white h-full min-h-[385px]">
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#D8D8D8]" aria-hidden="true" />
      <table className="w-full text-right text-[14px] border-collapse table-fixed">
        <tbody>
          {entries.map(([k, v], i) => (
            <tr key={k} className={i !== entries.length - 1 ? "border-b border-[#D8D8D8]" : ""}>
              <td className="py-3.5 px-5 w-1/2 font-semibold text-[rgba(0,0,0,0.9)] align-middle">
                {k}
              </td>
              <td className="py-3.5 px-5 w-1/2 text-[#404040] leading-relaxed align-middle">
                {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value, format = "number") {
  if (value === null || value === undefined || value === "-") return "-";
  if (typeof value !== "number") return value;
  if (format === "percent1") return `${value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  if (format === "decimal1") return value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return value.toLocaleString("en-US");
}

function getLeafCount(table) {
  if (table.nestedGroups) {
    return table.nestedGroups.reduce(
      (sum, ng) => sum + ng.groups.reduce((s, g) => s + g.columns.length, 0),
      0
    );
  }
  if (table.groups) {
    return table.groups.reduce((sum, g) => sum + g.columns.length, 0);
  }
  return table.columns?.length || 0;
}

function DataMatrixTable({ table, showTotals = false }) {
  if (!table?.rows?.length) return null;

  const formats = table.formats || [];
  const summable = table.summable || [];
  const leafCount = getLeafCount(table);

  const totals = showTotals
    ? Array.from({ length: leafCount }, (_, i) => {
        if (!summable[i]) return null;
        return table.rows.reduce((sum, row) => sum + (Number(row.values[i]) || 0), 0);
      })
    : null;

  const th = "border border-[#D8D8D8] px-3 py-2 font-bold text-[rgba(0,0,0,0.9)] bg-[#DDEBF4]";
  const thMuted = "border border-[#D8D8D8] px-3 py-2 text-muted font-semibold bg-[#DDEBF4]";

  return (
    <div className="overflow-auto">
      <table className="w-full text-center text-[13px] border-collapse">
        <thead>
          {table.nestedGroups ? (
            <>
              <tr>
                <th rowSpan={3} className={`${th} px-4`}>
                  {table.rowHeader}
                </th>
                {table.nestedGroups.map((ng) => (
                  <th
                    key={ng.label}
                    colSpan={ng.groups.reduce((s, g) => s + g.columns.length, 0)}
                    className={th}
                  >
                    {ng.label}
                  </th>
                ))}
              </tr>
              <tr>
                {table.nestedGroups.flatMap((ng) =>
                  ng.groups.map((g) => (
                    <th key={`${ng.label}-${g.label}`} colSpan={g.columns.length} className={th}>
                      {g.label}
                    </th>
                  ))
                )}
              </tr>
              <tr>
                {table.nestedGroups.flatMap((ng) =>
                  ng.groups.flatMap((g) =>
                    g.columns.map((col) => (
                      <th key={`${ng.label}-${g.label}-${col}`} className={thMuted}>
                        {col}
                      </th>
                    ))
                  )
                )}
              </tr>
            </>
          ) : table.groups ? (
            <>
              <tr>
                <th rowSpan={2} className={`${th} px-4`}>
                  {table.rowHeader}
                </th>
                {table.groups.map((g) => (
                  <th key={g.label} colSpan={g.columns.length} className={th}>
                    {g.label}
                  </th>
                ))}
              </tr>
              <tr>
                {table.groups.flatMap((g) =>
                  g.columns.map((col) => (
                    <th key={`${g.label}-${col}`} className={thMuted}>
                      {col}
                    </th>
                  ))
                )}
              </tr>
            </>
          ) : (
            <tr>
              <th className={`${th} px-4`}>{table.rowHeader}</th>
              {table.columns.map((col) => (
                <th key={col} className={th}>
                  {col}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.label} className="text-[#404040]">
              <td className="border border-[#D8D8D8] px-4 py-3 font-semibold bg-[#DDEBF4] text-right">
                {row.label}
              </td>
              {row.values.map((v, i) => (
                <td key={i} className="border border-[#D8D8D8] px-4 py-3">
                  {formatCell(v, formats[i])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {showTotals && totals && (
          <tfoot>
            <tr className="text-[rgba(0,0,0,0.9)] font-bold">
              <td className="border border-[#D8D8D8] px-4 py-3 bg-[#DDEBF4] text-right">الإجمالي</td>
              {totals.map((v, i) => (
                <td key={i} className="border border-[#D8D8D8] px-4 py-3 bg-[#DDEBF4]">
                  {v === null ? "—" : formatCell(v, formats[i])}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

function FormDataTab({ d }) {
  return <DataMatrixTable table={d.formTable} showTotals />;
}

function FulfillmentTab({ d }) {
  return <DataMatrixTable table={d.fulfillmentTable} showTotals />;
}

function AttachmentsTab({ d }) {
  return (
    <table className="w-full text-right text-[14px]">
      <thead>
        <tr className="bg-navy text-white">
          <th className="py-3 px-5 font-semibold">اسم الملف</th>
          <th className="py-3 px-5 font-semibold">نوع الملف</th>
          <th className="py-3 px-5 font-semibold">تاريخ الرفع</th>
          <th className="py-3 px-5 font-semibold">الحجم</th>
          <th className="py-3 px-5 font-semibold">رفع بواسطة</th>
          <th className="py-3 px-5 font-semibold">إجراءات</th>
        </tr>
      </thead>
      <tbody>
        {d.attachments.map((a, i) => (
          <tr key={i} className="border-b border-[#D8D8D8] text-[#404040]">
            <td className="py-3.5 px-5 font-medium">{a.name}</td>
            <td className="py-3.5 px-5 flex items-center gap-2">
              {a.type === "Excel" ? <FileSpreadsheet size={16} className="text-success" /> : <FileIcon size={16} className="text-danger" />}
              {a.type}
            </td>
            <td className="py-3.5 px-5">{a.date}</td>
            <td className="py-3.5 px-5">{a.size}</td>
            <td className="py-3.5 px-5">{a.by}</td>
            <td className="py-3.5 px-5"><button className="text-primary"><Download size={17} /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function loadNotes(requestId) {
  try {
    const raw = localStorage.getItem(`mped-notes-${requestId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(requestId, notes) {
  localStorage.setItem(`mped-notes-${requestId}`, JSON.stringify(notes));
}

function NotesTab({ requestId, author = "أحمد محمد" }) {
  const [notes, setNotes] = useState(() => loadNotes(requestId));
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  React.useEffect(() => {
    setNotes(loadNotes(requestId));
    setDraft("");
    setAdding(false);
  }, [requestId]);

  const updateNotes = (next) => {
    setNotes(next);
    saveNotes(requestId, next);
  };

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const date = now.toLocaleDateString("ar-EG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
    updateNotes([
      {
        id: Date.now(),
        text,
        author,
        date,
        time,
      },
      ...notes,
    ]);
    setDraft("");
    setAdding(false);
  };

  const removeNote = (id) => {
    updateNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border border-[#D8D8D8] rounded-xl p-5">
        {!adding ? (
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="bg-navy text-white rounded-lg px-4 py-2.5 text-[14px] flex items-center gap-2 shrink-0 hover:opacity-90"
            >
              <Plus size={16} /> إضافة ملاحظة
            </button>
            <span className="text-muted text-[14px] text-right">
              اضف أي ملاحظات او معلومات إضافية تتعلق بهذا النموذج ....
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[14px] font-semibold text-[#052C65] text-right">ملاحظة جديدة</div>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full border border-[#D8D8D8] rounded-lg py-2.5 px-3 text-[14px] text-right placeholder:text-gray-400 resize-none focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setAdding(false);
                }}
                className="rounded-lg px-4 py-2.5 text-[14px] text-[#404040] border border-[#D8D8D8] hover:bg-page"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={addNote}
                disabled={!draft.trim()}
                className="bg-navy text-white rounded-lg px-4 py-2.5 text-[14px] disabled:opacity-40"
              >
                حفظ الملاحظة
              </button>
            </div>
          </div>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D8D8D8] py-10 text-center text-muted text-[14px]">
          لا توجد ملاحظات بعد
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border border-[#D8D8D8] rounded-xl p-4 bg-white text-right"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => removeNote(note.id)}
                  className="text-danger text-[13px] hover:underline shrink-0"
                >
                  حذف
                </button>
                <div>
                  <div className="font-semibold text-[14px] text-[#052C65]">{note.author}</div>
                  <div className="text-[12px] text-muted mt-0.5">
                    {note.date} — {note.time}
                  </div>
                </div>
              </div>
              <p className="text-[14px] text-[#404040] leading-7 whitespace-pre-wrap">{note.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RequestDetail({ mode = "forms" }) {
  const isRequired = mode === "required";
  const tabs = isRequired
    ? [
        { key: "info", label: "بيانات نموذج البيان", width: 186 },
        { key: "form", label: "نموذج البيان", width: 125 },
        { key: "fulfillment", label: "استيفاء البيانات", width: 140 },
        { key: "attachments", label: "المرفقات", width: 98 },
        { key: "notes", label: "الملاحظات", width: 109 },
      ]
    : [
        { key: "info", label: "بيانات نموذج البيان", width: 186 },
        { key: "form", label: "نموذج البيان", width: 125 },
        { key: "attachments", label: "المرفقات", width: 98 },
        { key: "notes", label: "الملاحظات", width: 109 },
      ];

  const { id } = useParams();
  const d = requestDetailById[id] || requestDetailById[1];

  const [tab, setTab] = useState("info");
  const [success, setSuccess] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSent, setEditSent] = useState(false);
  const navigate = useNavigate();

  const backTo = isRequired ? "/required" : "/forms";
  const backLabel = isRequired ? "البيانات المطلوبة" : "نماذج البيان";

  return (
    <Layout title={backLabel}>
      <div className="px-8 pt-7 space-y-5">
        <div>
          <nav className="inline-flex items-center gap-1 h-[41px] text-right" aria-label="مسار التنقل">
            <button
              type="button"
              onClick={() => navigate(backTo)}
              className="font-[Cairo] font-medium text-[20px] leading-none text-[#ADB5BD] hover:opacity-80"
            >
              {backLabel}
            </button>
            <span className="inline-flex items-center justify-center w-[30px] h-[30px] shrink-0" aria-hidden="true">
              <img src="/navigate-next.svg" alt="" width={30} height={30} className="rotate-180" />
            </span>
            <span className="font-[Cairo] font-semibold text-[22px] leading-none text-[#052C65]">
              تفاصيل الطلب
            </span>
          </nav>
          <h2 className="mt-5 font-[Cairo] font-bold text-[27px] leading-none text-[#052C65] text-right">
            {d.title}
          </h2>
        </div>

        <div className="flex gap-5 flex-wrap">
          <InfoTile icon={FileClock} label="الحالة" value={<StatusBadge status={d.status} />} />
          <InfoTile icon={Monitor} label="الجهة الخارجية" value={d.org} />
          <InfoTile icon={User} label="الموظف المختص" value={d.officer} sub={d.officerRole} />
          <InfoTile icon={Clock} label="موعد الانتهاء" value={d.due} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#D8D8D8]">
          <div
            className={`grid border-b border-[#D8D8D8] px-6 pt-[14px] ${
              isRequired ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`h-[47px] w-full font-[Cairo] font-medium text-[22px] lg:text-[25px] leading-none whitespace-nowrap text-right flex items-center justify-start border-b-[3px] transition-colors ${
                    active
                      ? "text-[#052C65] border-[#0986ED]"
                      : "text-[#7F8999] border-transparent hover:text-[#052C65]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="p-6">
            {tab === "info" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <KVTable data={d.info} />
                <KVTable data={d.yearInfo} />
              </div>
            )}
            {tab === "form" && <FormDataTab d={d} />}
            {tab === "fulfillment" && isRequired && <FulfillmentTab d={d} />}
            {tab === "attachments" && <AttachmentsTab d={d} />}
            {tab === "notes" && <NotesTab requestId={id} author={d.officer} />}
          </div>
        </div>

        <div className="flex gap-4 justify-end pb-8">
          <button
            onClick={() => setEditOpen(true)}
            className="bg-primary text-white rounded-lg px-8 py-3 text-[15px] font-semibold"
          >
            طلب تعديل
          </button>
          <button
            onClick={() => setSuccess(true)}
            className="bg-success text-white rounded-lg px-8 py-3 text-[15px] font-semibold"
          >
            {isRequired ? "اعتماد نهائي و إرساله" : "اعتماد و إرسال"}
          </button>
        </div>
      </div>

      <RequestEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={() => { setEditOpen(false); setEditSent(true); }}
      />

      <SuccessModal
        open={success}
        message={isRequired ? "تم اعتماد البيانات المطلوبة و إرسالها" : "تم اعتماد نموذج البيان و إرساله"}
        onClose={() => { setSuccess(false); navigate(backTo); }}
      />

      <SuccessModal
        open={editSent}
        message="تم إرسال طلب التعديل"
        onClose={() => setEditSent(false)}
      />
    </Layout>
  );
}

