import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, Monitor, User, Clock, FileClock, Plus, Trash2,
} from "lucide-react";
import Layout from "../../components/es/EsLayout";
import StatusBadge, { statusTileChrome } from "../../components/es/StatusBadge";
import SuccessModal from "../../components/SuccessModal";
import ItFilterModal from "../../components/it/ItFilterModal";
import { useAuth } from "../../context/AuthContext";
import { loadNotes, saveNotes } from "../../domain/notes";
import { esRequestDetail, esRequiredRows } from "../../data/mockEs";
import { ddmmyyyyToIso } from "../it/listUtils";

const TABS = [
  { key: "info", label: "بيانات نموذج البيان" },
  { key: "fulfillment", label: "استيفاء البيانات" },
  { key: "attachments", label: "المرفقات" },
  { key: "notes", label: "الملاحظات" },
];

function InfoTile({ icon: Icon, label, value, sub, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-[20px] p-5 flex-1 min-w-[220px] min-h-[120px] flex items-start gap-4 shadow-sm" dir="rtl">
      <div
        className="w-[60px] h-[60px] rounded-[15px] flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={28} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1 pt-1 flex flex-col gap-1 text-right items-start">
        <div className="w-full text-[16px] font-semibold text-[rgba(5,44,101,0.7)] text-right">{label}</div>
        {typeof value === "string" || typeof value === "number" ? (
          <div className="w-full text-[18px] font-bold text-[#052c65] leading-snug text-right">{value}</div>
        ) : (
          <div className="w-full text-right">{value}</div>
        )}
        {sub && <div className="w-full text-[13px] text-[rgba(5,44,101,0.7)] text-right">{sub}</div>}
      </div>
    </div>
  );
}

function PairTable({ rows }) {
  return (
    <div className="border border-[#d8d8d8] rounded-[16px] overflow-hidden flex-1 min-w-0">
      <table className="w-full">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i !== rows.length - 1 ? "border-b border-[#d8d8d8]" : ""}>
              <th className="w-[42%] px-4 py-3 text-right text-[15px] font-semibold text-[#052c65] border-l border-[#d8d8d8] align-top">
                {label}
              </th>
              <td className="px-4 py-3 text-right text-[14px] text-[rgba(5,44,101,0.6)] align-top leading-relaxed">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** مصفوفة استيفاء — قراءة فقط لمراجعة المشرف (Figma 1689:4099) */
function FulfillmentMatrix({ matrix, values }) {
  const leafCols = matrix.groups.flatMap((g) => g.columns.map((c) => `${g.label}·${c}`));
  const th = "border border-[#d8d8d8] bg-[#f3f6fd] text-[#052c65] font-semibold text-[13px] py-2.5 px-2 text-center whitespace-nowrap";
  const td = "border border-[#d8d8d8] p-0 text-center";

  const downloadTemplate = () => {
    const headers = ["م", matrix.rowHeader, ...leafCols.map((c) => c.replace("·", " / "))];
    const lines = [
      headers.join(","),
      ...matrix.rows.map((row, i) => [
        i + 1,
        row.name,
        ...leafCols.map((col) => values[`${row.id}|${col}`] ?? ""),
      ].join(",")),
    ];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "نموذج_البيان.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-[21px]" dir="ltr">
        <button
          type="button"
          onClick={downloadTemplate}
          className="h-[43px] min-w-[172px] rounded-[10px] border border-[#052c65] text-[#052c65] text-[16px] font-semibold inline-flex items-center justify-center gap-[15px] bg-white px-4 cursor-pointer hover:bg-[rgba(5,44,101,0.04)]"
        >
          <span>تحميل نموذج البيان</span>
          <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
            <img src="/ent/download-navy.svg" alt="" className="absolute inset-0 size-full max-w-none" />
          </span>
        </button>
      </div>

      <div className="overflow-x-auto border border-[#d8d8d8] rounded-[16px]">
        <table className="w-full min-w-[860px] border-collapse text-[13px]" dir="rtl">
          <thead>
            <tr>
              <th className={`${th} w-[56px]`} rowSpan={2}>م</th>
              <th className={`${th} w-[210px]`} rowSpan={2}>{matrix.rowHeader}</th>
              {matrix.groups.map((g) => (
                <th key={g.label} className={th} colSpan={g.columns.length}>{g.label}</th>
              ))}
            </tr>
            <tr>
              {matrix.groups.flatMap((g) =>
                g.columns.map((c) => <th key={`${g.label}-${c}`} className={th}>{c}</th>),
              )}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, i) => (
              <tr key={row.id}>
                <td className={`${td} py-2.5 text-[#052c65]`}>{i + 1}</td>
                <td className={`${td} py-2.5 px-3 text-right text-[#052c65]`}>{row.name}</td>
                {leafCols.map((col) => {
                  const key = `${row.id}|${col}`;
                  return (
                    <td key={col} className={`${td} py-2.5 text-[#052c65]`} dir="ltr">
                      {values[key] ?? "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-[#f3f6fd]">
              <td className={`${td} py-2.5`} colSpan={2}>
                <span className="text-[#052c65] font-bold">الإجمالي</span>
              </td>
              {leafCols.map((col) => {
                const sum = matrix.rows.reduce(
                  (s, r) => s + (Number(values[`${r.id}|${col}`]) || 0),
                  0,
                );
                return (
                  <td key={col} className={`${td} py-2.5 font-bold text-[#052c65]`} dir="ltr">
                    {sum || ""}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** المرفقات — عرض للمراجعة */
function AttachmentsTab({ seed }) {
  const [files, setFiles] = useState(seed);
  const [filterOpen, setFilterOpen] = useState(false);
  const [type, setType] = useState("");
  const [by, setBy] = useState("");
  const [uploadedAt, setUploadedAt] = useState("");

  useEffect(() => {
    setFiles(seed);
    setType("");
    setBy("");
    setUploadedAt("");
  }, [seed]);

  const typeOptions = useMemo(() => [...new Set(files.map((f) => f.type))], [files]);
  const byOptions = useMemo(() => [...new Set(files.map((f) => f.by))], [files]);

  const filtered = files.filter((f) => {
    if (type && f.type !== type) return false;
    if (by && f.by !== by) return false;
    if (uploadedAt && ddmmyyyyToIso(f.uploadedAt) !== uploadedAt) return false;
    return true;
  });

  const cell = "py-4 px-3 text-[17px] font-semibold tracking-[0.17px] text-[#052c65]/60 whitespace-nowrap";
  const head = "py-3.5 px-3 text-[16px] font-semibold tracking-[0.16px] text-white whitespace-nowrap";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-[23px]" dir="ltr">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          aria-label="تصفية"
          className="size-10 rounded-[13.333px] bg-[rgba(5,44,101,0.1)] flex items-center justify-center cursor-pointer hover:bg-[rgba(5,44,101,0.16)]"
        >
          <span className="relative size-8 shrink-0 overflow-hidden" aria-hidden>
            <img src="/ent/filter.svg" alt="" className="absolute inset-0 size-full max-w-none" />
          </span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-[rgba(18,36,67,0.1)]">
        <table className="w-full min-w-[1100px] text-center border-collapse" dir="rtl">
          <thead>
            <tr className="bg-[#052c65]">
              <th className={`${head} text-right rounded-tr-[20px]`}>اسم الملف</th>
              <th className={head}>موجهة إلى</th>
              <th className={head}>نوع الملف</th>
              <th className={head}>تاريخ الرفع</th>
              <th className={head}>الحجم</th>
              <th className={head}>بواسطة</th>
              <th className={`${head} rounded-tl-[20px]`}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr
                key={f.id}
                className={`h-[60px] border-[rgba(18,36,67,0.1)] ${
                  i !== filtered.length - 1 ? "border-b" : ""
                }`}
              >
                <td className={`${cell} text-right font-medium`}>{f.name}</td>
                <td className={cell}>{f.directedTo || "—"}</td>
                <td className={cell}>
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
                      <img
                        src={f.type === "Excel" ? "/ent/excel.svg" : "/ent/pdf.svg"}
                        alt=""
                        className="absolute inset-0 size-full max-w-none"
                      />
                    </span>
                    <span className="font-medium">{f.type}</span>
                  </span>
                </td>
                <td className={cell} dir="ltr">{f.uploadedAt}</td>
                <td className={cell} dir="ltr">{f.size}</td>
                <td className={cell}>{f.by}</td>
                <td className={cell}>
                  <button
                    type="button"
                    aria-label={`تحميل ${f.name}`}
                    className="inline-flex size-6 items-center justify-center cursor-pointer hover:opacity-70"
                  >
                    <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
                      <img src="/ent/download-blue.svg" alt="" className="absolute inset-0 size-full max-w-none" />
                    </span>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-muted text-[14px]">لا توجد مرفقات مطابقة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ItFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onClear={() => { setType(""); setBy(""); setUploadedAt(""); setFilterOpen(false); }}
        fields={[
          { label: "نوع الملف", value: type, onChange: setType, options: typeOptions },
          { label: "بواسطة", value: by, onChange: setBy, options: byOptions },
          { label: "تاريخ الرفع", type: "date", value: uploadedAt, onChange: setUploadedAt },
        ]}
      />
    </div>
  );
}

function NotesTab({ requestId, author }) {
  const [notes, setNotes] = useState(() => loadNotes(requestId));
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
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
    const date = now.toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit", year: "numeric" });
    const time = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    updateNotes([{ id: Date.now(), text, author, date, time }, ...notes]);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="border border-[rgba(5,44,101,0.47)] rounded-[15px] p-5 min-h-[98px]">
        {!adding ? (
          <div className="flex items-center justify-between gap-4" dir="rtl">
            <span className="text-[16px] text-[rgba(5,44,101,0.33)] text-right">
              اضف أى ملاحظات او معلومات إضافيىة تتعلق بهذا النموذج ....
            </span>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="bg-[#052c65] text-white rounded-[10px] h-[43px] px-4 text-[16px] font-semibold inline-flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus size={18} /> إضافة ملاحظة
            </button>
          </div>
        ) : (
          <div className="space-y-3" dir="rtl">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full border border-[#d8d8d8] rounded-[10px] p-3 text-[15px] text-[#052c65] text-right outline-none focus:border-[#0986ed]"
              placeholder="اكتب ملاحظتك هنا..."
            />
            <div className="flex items-center gap-3 justify-end">
              <button type="button" onClick={() => { setAdding(false); setDraft(""); }} className="text-[#7f8999] text-[15px] cursor-pointer">
                إلغاء
              </button>
              <button type="button" onClick={addNote} className="bg-[#052c65] text-white rounded-[10px] h-[40px] px-5 text-[15px] font-semibold cursor-pointer">
                حفظ
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
            <li key={note.id} className="border border-[#D8D8D8] rounded-xl p-4 bg-white text-right">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-semibold text-[14px] text-[#052C65]">{note.author}</div>
                  <div className="text-[12px] text-muted mt-0.5">{note.date} — {note.time}</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateNotes(notes.filter((n) => n.id !== note.id))}
                  className="text-danger hover:opacity-70 shrink-0 cursor-pointer"
                  aria-label="حذف الملاحظة"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-[14px] text-[#404040] leading-7 whitespace-pre-wrap">{note.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** تفاصيل الطلب — مراجعة مشرف الجهة (Figma 1689:4099 / 1689:5203) */
export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { name } = useAuth();
  const [tab, setTab] = useState("info");
  const [successOpen, setSuccessOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [uiStatus, setUiStatus] = useState(null);

  const row = esRequiredRows.find((r) => String(r.id) === String(id));
  const req = esRequestDetail;
  const matrix = req.matrix;
  const values = req.matrixValues || {};
  const author = name || req.officer;
  const status = uiStatus || row?.status || req.status;
  const isApproved = status === "معتمدة" || status === "معتمد";
  const isModify = status === "مطلوب تعديل" || status === "تعديل";
  const showActions = !isApproved;

  useEffect(() => {
    setTab("info");
    setUiStatus(null);
  }, [id]);

  return (
    <Layout title="البيانات المطلوبة">
      <div className="page-shell space-y-5 pb-28">
        <div className="flex items-center gap-2 text-right" dir="rtl">
          <Link to="/es/required" className="text-[20px] font-medium text-[#adb5bd] hover:text-primary">
            البيانات المطلوبة
          </Link>
          <ChevronLeft size={22} className="text-[#adb5bd] shrink-0" />
          <span className="text-[22px] font-semibold text-[#052c65]">تفاصيل الطلب</span>
        </div>

        <div className="flex flex-wrap items-center gap-4" dir="rtl">
          <h2 className="text-[26px] font-bold text-[#052c65]">{row?.title || req.name}</h2>
        </div>

        <div className="flex flex-wrap gap-5" dir="rtl">
          <InfoTile
            icon={FileClock}
            label="الحالة"
            value={<StatusBadge status={status} size="lg" />}
            iconBg={statusTileChrome(status).bg}
            iconColor={statusTileChrome(status).fg}
          />
          <InfoTile
            icon={Monitor}
            label="الإدارة العامة"
            value={row?.admin || req.admin}
            iconBg="rgba(9,134,237,0.3)"
            iconColor="#0986ED"
          />
          <InfoTile
            icon={User}
            label="الموظف المختص"
            value={req.officer}
            sub={req.officerRole}
            iconBg="rgba(9,134,237,0.3)"
            iconColor="#0986ED"
          />
          <InfoTile
            icon={Clock}
            label="موعد الانتهاء"
            value={row?.due || req.due}
            iconBg="rgba(9,134,237,0.3)"
            iconColor="#0986ED"
          />
        </div>

        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden border border-[rgba(5,44,101,0.08)]">
          <div className="flex" dir="rtl">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 h-[64px] sm:h-[75px] text-[16px] sm:text-[22px] font-medium transition-colors cursor-pointer ${
                  tab === t.key
                    ? "text-[#052C65] border-b-2 border-[#0986ED]"
                    : "text-[#052C65] border-b border-[#eaeaeb] hover:opacity-80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            {tab === "info" && (
              <div className="flex flex-col lg:flex-row gap-6" dir="rtl">
                <PairTable rows={Object.entries(req.info)} />
                <PairTable rows={Object.entries(req.yearInfo)} />
              </div>
            )}
            {tab === "fulfillment" && (
              <FulfillmentMatrix matrix={matrix} values={values} />
            )}
            {tab === "attachments" && (
              <AttachmentsTab seed={req.attachments} />
            )}
            {tab === "notes" && (
              <NotesTab requestId={id} author={author} />
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="sticky bottom-0 z-10 bg-[#f9f9f9] border-t border-[#eaeaeb] px-4 sm:px-6 xl:px-8 py-4">
          <div className="flex items-center justify-start gap-[34px] max-w-[1535.5px] mx-auto" dir="ltr">
            <button
              type="button"
              onClick={() => setSuccessOpen(true)}
              className="bg-[#16a34a] text-white rounded-[8px] h-[49px] w-[333px] max-w-full text-[18px] font-normal cursor-pointer hover:opacity-90"
            >
              اعتماد نهائي و إرساله
            </button>
            {!isModify && (
              <button
                type="button"
                onClick={() => setModifyOpen(true)}
                className="bg-[#0986ed] text-white rounded-[8px] h-[49px] w-[226px] max-w-full text-[18px] font-normal cursor-pointer hover:opacity-90"
              >
                طلب تعديل
              </button>
            )}
          </div>
        </div>
      )}

      <SuccessModal
        open={successOpen}
        message="تم اعتماد البيانات المطلوبة و إرسالها"
        subtitle="تم إرسال البيانات للمراجعة والاعتماد النهائي"
        onClose={() => {
          setSuccessOpen(false);
          setUiStatus("معتمدة");
          navigate("/es/required");
        }}
      />

      <SuccessModal
        open={modifyOpen}
        message="تم إرسال طلب التعديل"
        subtitle="سيُعاد الطلب لموظف الجهة لاستكمال التعديلات"
        onClose={() => {
          setModifyOpen(false);
          setUiStatus("تعديل");
        }}
      />
    </Layout>
  );
}
