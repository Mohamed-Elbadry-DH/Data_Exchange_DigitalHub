import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, FilePlus, Monitor, User, Clock, Download, FileSpreadsheet,
  FileText, SlidersHorizontal, Plus, Trash2,
} from "lucide-react";
import Layout from "../../components/ent/EntLayout";
import StatusBadge from "../../components/ent/StatusBadge";
import SuccessModal from "../../components/SuccessModal";
import DataIncompleteModal from "../../components/ent/DataIncompleteModal";
import ItFilterModal from "../../components/it/ItFilterModal";
import { useAuth } from "../../context/AuthContext";
import { loadNotes, saveNotes } from "../../domain/notes";
import { entRequestDetail, entRequiredRows } from "../../data/mockEnt";
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
      <div className="text-right min-w-0 pt-1">
        <div className="text-[16px] font-semibold text-[rgba(5,44,101,0.7)]">{label}</div>
        <div className="text-[18px] font-bold text-[#052c65] mt-1 leading-snug">{value}</div>
        {sub && <div className="text-[13px] text-[rgba(5,44,101,0.7)] mt-1">{sub}</div>}
      </div>
    </div>
  );
}

/** جدول مفاتيح/قيم بإطار — عمودان كما في Figma 1706:8969 */
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

/** مصفوفة استيفاء البيانات — أعمدة مجمّعة قابلة للتعبئة (Figma 1706:9252) */
function FulfillmentMatrix({ matrix, values, onChange }) {
  const leafCols = matrix.groups.flatMap((g) => g.columns.map((c) => `${g.label}·${c}`));
  const th = "border border-[#d8d8d8] bg-[#f7f9fb] text-[#052c65] font-semibold text-[13px] py-2.5 px-2 text-center whitespace-nowrap";
  const td = "border border-[#d8d8d8] p-0 text-center";

  return (
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
                  <td key={col} className={td}>
                    <input
                      inputMode="numeric"
                      value={values[key] ?? ""}
                      onChange={(e) => onChange(key, e.target.value.replace(/[^\d]/g, ""))}
                      aria-label={`${row.name} — ${col.replace("·", " ")}`}
                      className="w-full h-[42px] text-center text-[13px] text-[#052c65] outline-none focus:bg-[rgba(9,134,237,0.06)]"
                      dir="ltr"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-[#eef3fb]">
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
  );
}

/** المرفقات — جدول + رفع + تصفية (Figma 1706:9783 / 1707:12726) */
function AttachmentsTab({ seed, uploader }) {
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

  const upload = () => {
    const now = new Date();
    const uploaded = now.toLocaleDateString("en-GB");
    setFiles((prev) => [
      {
        id: Date.now(),
        name: `مرفق_جديد_${prev.length + 1}`,
        type: "Excel",
        uploadedAt: uploaded,
        size: "120 KB",
        by: uploader || "أحمد محمد",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-3" dir="ltr">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          aria-label="تصفية"
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[#404040] hover:border-primary hover:text-primary cursor-pointer"
        >
          <SlidersHorizontal size={18} />
        </button>
        <button
          type="button"
          onClick={upload}
          className="flex items-center gap-2 bg-[#052c65] text-white rounded-[10px] h-[43px] px-4 text-[16px] font-semibold cursor-pointer"
        >
          <Plus size={18} />
          رفع ملف
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto border border-[#D8D8D8]">
        <table className="w-full min-w-[900px] text-center border-collapse" dir="rtl">
          <thead>
            <tr className="bg-[#052c65] text-white text-[14px]">
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">اسم الملف</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">نوع الملف</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">تاريخ الرفع</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">الحجم</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">بواسطة</th>
              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr
                key={f.id}
                className={`text-[14px] text-[#404040] ${i !== filtered.length - 1 ? "border-b border-[#E9ECEF]" : ""}`}
              >
                <td className="py-4 px-4 text-right text-[#052c65] font-medium whitespace-nowrap">{f.name}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center justify-center gap-2">
                    {f.type === "Excel"
                      ? <FileSpreadsheet size={20} className="text-[#16A34A]" />
                      : <FileText size={20} className="text-[#DC2626]" />}
                    <span>{f.type}</span>
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{f.uploadedAt}</td>
                <td className="py-4 px-4 whitespace-nowrap" dir="ltr">{f.size}</td>
                <td className="py-4 px-4 whitespace-nowrap">{f.by}</td>
                <td className="py-4 px-4">
                  <button type="button" aria-label={`تحميل ${f.name}`} className="text-primary hover:opacity-70 cursor-pointer">
                    <Download size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-muted text-[14px]">لا توجد مرفقات مطابقة</td>
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

/** الملاحظات — بطاقة إضافة + قائمة (Figma 1706:10056) */
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
              className="bg-[#052c65] text-white rounded-[10px] h-[43px] px-4 text-[16px] font-semibold flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus size={18} />
              إضافة ملاحظة
            </button>
          </div>
        ) : (
          <div className="space-y-3" dir="rtl">
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
                onClick={() => { setDraft(""); setAdding(false); }}
                className="rounded-lg px-4 py-2.5 text-[14px] text-[#404040] border border-[#D8D8D8] hover:bg-page cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={addNote}
                disabled={!draft.trim()}
                className="bg-[#052c65] text-white rounded-lg px-4 py-2.5 text-[14px] disabled:opacity-40 cursor-pointer"
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

/** تفاصيل الطلب — Figma 1706:8969 / 9252 / 9783 / 10056 */
export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { name } = useAuth();
  const [tab, setTab] = useState("info");
  const [values, setValues] = useState({});
  const [incompleteOpen, setIncompleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const row = entRequiredRows.find((r) => String(r.id) === String(id));
  const req = entRequestDetail;
  const matrix = req.matrix;
  const author = name || req.officer;

  useEffect(() => {
    setTab("info");
    setValues({});
  }, [id]);

  const filledCount = useMemo(
    () => Object.values(values).filter((v) => String(v).trim() !== "").length,
    [values],
  );

  const setValue = (key, v) => setValues((s) => ({ ...s, [key]: v }));

  const submit = () => {
    if (filledCount < matrix.requiredCount) setIncompleteOpen(true);
    else setSuccessOpen(true);
  };

  return (
    <Layout title="البيانات المطلوبة">
      <div className="page-shell space-y-5 pb-28">
        <div className="flex items-center gap-2 text-right" dir="rtl">
          <Link to="/ent/required" className="text-[20px] font-medium text-[#adb5bd] hover:text-primary">
            البيانات المطلوبة
          </Link>
          <ChevronLeft size={22} className="text-[#adb5bd] shrink-0" />
          <span className="text-[22px] font-semibold text-[#052c65]">تفاصيل الطلب</span>
        </div>

        <div className="flex flex-wrap items-center gap-4" dir="rtl">
          <h2 className="text-[26px] font-bold text-[#052c65]">{row?.title || req.name}</h2>
          <StatusBadge status={row?.status || req.status} />
        </div>

        <div className="flex flex-wrap gap-5" dir="rtl">
          <InfoTile
            icon={FilePlus}
            label="المرحلة"
            value={row?.stageLabel || req.stage}
            iconBg="rgba(151,71,255,0.3)"
            iconColor="#9747FF"
          />
          <InfoTile
            icon={Monitor}
            label="الإدارة العامة"
            value={req.admin}
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
              <FulfillmentMatrix matrix={matrix} values={values} onChange={setValue} />
            )}

            {tab === "attachments" && (
              <AttachmentsTab seed={req.attachments} uploader={author} />
            )}

            {tab === "notes" && (
              <NotesTab requestId={id} author={author} />
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 bg-[#f9f9f9] border-t border-[#eaeaeb] px-4 sm:px-6 xl:px-8 py-4">
        <div className="flex" dir="rtl">
          <button
            type="button"
            onClick={submit}
            className="bg-[#0986ed] text-white rounded-[8px] h-[49px] w-[288px] max-w-full text-[18px] font-normal cursor-pointer"
          >
            إرسال لمشرف الجهة
          </button>
        </div>
      </div>

      <DataIncompleteModal
        open={incompleteOpen}
        onClose={() => setIncompleteOpen(false)}
        onContinue={() => { setIncompleteOpen(false); setTab("fulfillment"); }}
        required={matrix.requiredCount}
        current={filledCount}
      />

      <SuccessModal
        open={successOpen}
        message="تم إرسال البيانات بنجاح"
        subtitle="تم إرسال البيانات والملاحظات والملفات للمراجعة"
        onClose={() => { setSuccessOpen(false); navigate("/ent/required"); }}
      />
    </Layout>
  );
}
