import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, FileText, Monitor, User, Clock, Download, Paperclip, FileSpreadsheet,
} from "lucide-react";
import Layout from "../../components/ent/EntLayout";
import StatusBadge from "../../components/ent/StatusBadge";
import SuccessModal from "../../components/SuccessModal";
import DataIncompleteModal from "../../components/ent/DataIncompleteModal";
import { entRequestDetail, entRequiredRows } from "../../data/mockEnt";

const TABS = [
  { key: "info", label: "بيانات نموذج البيان" },
  { key: "fulfillment", label: "استيفاء البيانات" },
  { key: "attachments", label: "المرفقات" },
  { key: "notes", label: "الملاحظات" },
];

function InfoTile({ icon: Icon, label, value, sub, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex-1 min-w-[200px] flex items-center gap-4 shadow-sm" dir="rtl">
      <div
        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={26} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="text-right min-w-0">
        <div className="text-[13px] text-muted">{label}</div>
        <div className="text-[15px] font-bold text-[#052c65] truncate">{value}</div>
        {sub && <div className="text-[11px] text-muted truncate">{sub}</div>}
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

/** تفاصيل الطلب — Figma 1706:8969 (بيانات النموذج) و 1706:9252 (استيفاء البيانات) */
export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");
  const [values, setValues] = useState({});
  const [notes, setNotes] = useState("");
  const [incompleteOpen, setIncompleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const row = entRequiredRows.find((r) => String(r.id) === String(id));
  const req = entRequestDetail;
  const matrix = req.matrix;

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
      <div className="p-4 sm:p-6 xl:p-8 pb-28 space-y-5">
        <div className="flex items-center gap-2 text-[15px] text-muted" dir="rtl">
          <Link to="/ent/required" className="hover:text-primary">البيانات المطلوبة</Link>
          <ChevronLeft size={16} />
          <span className="text-[#052c65] font-semibold">تفاصيل الطلب</span>
        </div>

        <div className="flex items-center gap-4" dir="rtl">
          <h2 className="text-[26px] font-bold text-[#052c65]">{row?.title || req.name}</h2>
          <StatusBadge status={row?.status || req.status} />
        </div>

        <div className="flex flex-wrap gap-4" dir="rtl">
          <InfoTile icon={FileText} label="المرحلة" value={row?.stageLabel || req.stage}
            iconBg="rgba(151,71,255,0.15)" iconColor="#9747FF" />
          <InfoTile icon={Monitor} label="الإدارة العامة" value={req.admin}
            iconBg="rgba(27,117,255,0.15)" iconColor="#1B75FF" />
          <InfoTile icon={User} label="الموظف المختص" value={req.officer} sub={req.officerRole}
            iconBg="rgba(9,134,237,0.15)" iconColor="#0986ED" />
          <InfoTile icon={Clock} label="موعد الانتهاء" value={row?.due || req.due}
            iconBg="rgba(9,134,237,0.15)" iconColor="#0986ED" />
        </div>

        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="flex border-b border-[#d8d8d8]" dir="rtl">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 py-4 text-[16px] transition-colors cursor-pointer ${
                  tab === t.key
                    ? "text-[#052C65] font-bold border-b-[3px] border-[#0986ED]"
                    : "text-muted hover:text-[#052C65]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
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
              <ul className="flex flex-col gap-3" dir="rtl">
                {req.attachments.map((f) => (
                  <li
                    key={f.name}
                    className="flex items-center gap-4 bg-[#f8f9fa] border border-[#d8d8d8] rounded-[14px] px-5 h-[52px]"
                  >
                    {f.type === "Excel"
                      ? <FileSpreadsheet size={22} className="text-[#16A34A] shrink-0" />
                      : <Paperclip size={22} className="text-[#DC2626] shrink-0" />}
                    <span className="flex-1 text-[15px] text-[#052c65] truncate">{f.name}</span>
                    <button type="button" aria-label={`تحميل ${f.name}`} className="text-primary hover:opacity-70 cursor-pointer shrink-0">
                      <Download size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {tab === "notes" && (
              <div dir="rtl">
                <label className="block text-[15px] font-semibold text-[#052c65] mb-3">ملاحظات</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="اكتب ملاحظاتك هنا"
                  className="w-full rounded-[12px] border border-[rgba(5,44,101,0.16)] p-4 text-[15px] text-right text-[#1f254b] placeholder:text-[#1f254b]/30 outline-none focus:border-primary resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 bg-[#f9f9f9] border-t border-[#eaeaeb] px-8 py-4">
        <div className="flex" dir="rtl">
          <button
            type="button"
            onClick={submit}
            className="bg-primary text-white rounded-[11px] h-[48px] w-[220px] text-[18px] font-semibold cursor-pointer"
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
        onClose={() => { setSuccessOpen(false); navigate("/ent/required"); }}
      />
    </Layout>
  );
}
