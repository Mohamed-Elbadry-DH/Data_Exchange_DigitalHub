import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User, Monitor, FileText, LoaderCircle, Download, FileSpreadsheet, FileIcon, Plus, Check,
  FileSearch, CircleCheckBig,
} from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import StatusBadge from "../../components/ga/StatusBadge";
import SuccessModal from "../../components/SuccessModal";
import RequestEditModal from "../../components/RequestEditModal";
import { getGaRequestSeed } from "../../data/mockGa";
import { loadNotes, saveNotes } from "../../domain/notes";
import { STAGES, stageById, stageIndex, hasReachedStage, isRequiredStage, isFormsStage } from "../../domain/workflow";
import {
  resolveRequest, advanceRequest, markModification, resubmitAfterModification, resetRequestToStart,
} from "../../domain/requestState";
import { useAuth } from "../../context/AuthContext";

function statusTileVisual(status) {
  if (status === "معتمد" || status === "معتمدة") {
    return { icon: CircleCheckBig, iconBg: "#16A34A", iconClass: "text-white" };
  }
  if (
    status === "بانتظار المراجعة"
    || status === "قيد المراجعة"
    || status === "بانتظار الاعتماد"
    || status === "قيد الاعتماد"
  ) {
    return { icon: FileSearch, iconBg: "#9747FF", iconClass: "text-white" };
  }
  if (status === "مطلوب تعديل" || status === "تعديل") {
    return { icon: FileText, iconBg: "#FF8C08", iconClass: "text-white" };
  }
  // قيد التنفيذ / default
  return { icon: LoaderCircle, iconBg: "#FFC107", iconClass: "text-white" };
}

function InfoTile({ icon: Icon, label, value, sub, iconBg = "#2563EB4D", iconClass = "text-[#2563EB]" }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 flex items-center gap-4 shadow-sm min-w-[220px]">
      <div
        className="w-[60px] h-[60px] rounded-[15px] flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={36} className={iconClass} strokeWidth={2} />
      </div>
      <div className="text-right min-w-0">
        <div className="text-[13px] text-muted">{label}</div>
        <div className="text-[15px] font-bold text-[rgba(0,0,0,0.9)]">{value}</div>
        {sub && <div className="text-[12px] text-muted mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function StageNode({ index, done, waiting }) {
  if (done) {
    return (
      <div
        className="w-[50px] h-[50px] rounded-full bg-[#16A34A] flex items-center justify-center shrink-0"
        aria-label={`مكتمل: المرحلة ${index + 1}`}
      >
        <Check size={24} className="text-white" strokeWidth={3} />
      </div>
    );
  }

  if (waiting) {
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        className="shrink-0"
        aria-label={`قيد الانتظار: المرحلة ${index + 1}`}
      >
        <circle cx="25" cy="25" r="24" fill="#F59E0B33" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="25" cy="25" r="7" fill="#F59E0B" />
      </svg>
    );
  }

  return (
    <div
      className="w-[50px] h-[50px] rounded-full bg-[#F1F3F5] border border-[#DEE2E6] flex items-center justify-center text-[#052C65] text-[16px] font-semibold shrink-0"
      aria-label={`قادم: المرحلة ${index + 1}`}
    >
      {index + 1}
    </div>
  );
}

const STEP_LINE_GAP = 8;

function StageStepper({ stageId, status }) {
  const stages = STAGES;
  const current = Math.max(0, stageIndex(stageId));
  const isClosed = stageId === "close";
  const formApproved =
    (status === "معتمد" || status === "معتمدة") && isFormsStage(stageId);
  const colCount = stages.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D8D8D8] px-4 sm:px-8 py-8">
      <div className="relative w-full" dir="rtl">
        {/* خطوط الربط — تمتد بين مراكز الدوائر مع فجوة بسيطة عن كل دائرة */}
        <div
          className="pointer-events-none absolute top-[25px] flex items-center"
          style={{
            left: `calc(100% / ${colCount * 2} + ${STEP_LINE_GAP}px)`,
            right: `calc(100% / ${colCount * 2} + ${STEP_LINE_GAP}px)`,
          }}
          aria-hidden="true"
        >
          {stages.slice(0, -1).map((_, i) => {
            const lineDone =
              isClosed
              || i < current
              || (formApproved && i < 3);
            return (
              <div
                key={i}
                className="flex-1"
                style={{
                  borderTop: lineDone
                    ? "2.64px solid #16A34A"
                    : "2.64px solid #DEE2E6",
                }}
              />
            );
          })}
        </div>

        <div
          className="relative z-10 grid w-full"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {stages.map((s, i) => {
            const done =
              isClosed
              || i < current
              || (formApproved && i <= 2);
            const waiting = !isClosed && !formApproved && i === current;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 min-w-0 px-1">
                <StageNode index={i} done={done} waiting={waiting} />
                <div
                  className={`w-full text-[12px] sm:text-[13px] text-center leading-5 ${
                    done || waiting ? "text-[#052C65] font-bold" : "text-[#ADB5BD] font-medium"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
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

function blankTable(table) {
  if (!table?.rows?.length) return table;
  const leafCount = getLeafCount(table);
  return {
    ...table,
    rows: table.rows.map((row) => ({
      ...row,
      values: Array.from({ length: leafCount }, () => "-"),
    })),
  };
}

function FormDataTab({ d, mode = "blank" }) {
  if (mode === "empty") {
    return <EmptyTabMessage text="لا توجد جداول للعرض في هذه المرحلة" />;
  }
  // نماذج البيان = هيكل فارغ بدون أرقام؛ البيانات تظهر في استيفاء البيانات
  return <DataMatrixTable table={blankTable(d.formTable)} showTotals={false} />;
}

function FulfillmentTab({ d, mode = "filled" }) {
  if (mode === "blank") {
    return <DataMatrixTable table={blankTable(d.fulfillmentTable)} showTotals={false} />;
  }
  return <DataMatrixTable table={d.fulfillmentTable} showTotals />;
}

function InfoTab({ d, variant }) {
  if (variant === "empty") {
    return (
      <div className="rounded-xl border border-dashed border-[#D8D8D8] py-16 text-center text-muted text-[15px]">
        لا توجد جداول للعرض في هذه المرحلة
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <KVTable data={d.info} />
      <KVTable data={d.yearInfo} />
    </div>
  );
}

function EmptyTabMessage({ text = "لا توجد بيانات للعرض في هذه المرحلة" }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8D8D8] py-16 text-center text-muted text-[15px]">
      {text}
    </div>
  );
}

function AttachmentsTab({ d, empty = false }) {
  if (empty) return <EmptyTabMessage text="لا توجد مرفقات في هذه المرحلة" />;
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

function NotesTab({ requestId, author = "أحمد محمد", empty = false }) {
  const [notes, setNotes] = useState(() => loadNotes(requestId));
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  React.useEffect(() => {
    setNotes(loadNotes(requestId));
    setDraft("");
    setAdding(false);
  }, [requestId]);

  if (empty) return <EmptyTabMessage text="لا توجد ملاحظات في هذه المرحلة" />;

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
            <span className="text-muted text-[14px] text-right">
              اضف أي ملاحظات او معلومات إضافية تتعلق بهذا النموذج ....
            </span>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="bg-navy text-white rounded-lg px-4 py-2.5 text-[14px] flex items-center gap-2 shrink-0 hover:opacity-90"
            >
              <Plus size={16} /> إضافة ملاحظة
            </button>
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
                <div>
                  <div className="font-semibold text-[14px] text-[#052C65]">{note.author}</div>
                  <div className="text-[12px] text-muted mt-0.5">
                    {note.date} — {note.time}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeNote(note.id)}
                  className="text-danger text-[13px] hover:underline shrink-0"
                >
                  حذف
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

export default function RequestDetail({ mode = "forms" }) {
  const isRequired = mode === "required";
  const { id } = useParams();
  const seed = useMemo(() => getGaRequestSeed(id), [id]);

  const [live, setLive] = useState(() => resolveRequest(seed, id));
  const [tab, setTab] = useState("info");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSent, setEditSent] = useState(false);
  const navigate = useNavigate();
  const { name } = useAuth();

  useEffect(() => {
    const nextSeed = getGaRequestSeed(id);
    setLive(resolveRequest(nextSeed, id));
    setTab("info");
    setPendingAdvance(false);
  }, [id]);

  const refresh = () => setLive(resolveRequest(getGaRequestSeed(id), id));

  const backTo = isRequired ? "/ga/required" : "/ga/forms";
  const backLabel = isRequired ? "البيانات المطلوبة" : "نماذج البيان";
  const stageId = live.stageId || "create";
  const stage = stageById(stageId) || STAGES[0];
  const stageNumber = Math.max(1, stageIndex(stageId) + 1);
  const needsModification = live.status === "مطلوب تعديل" || live.status === "تعديل";
  const showFulfillmentTab = hasReachedStage(stageId, "fulfill");
  // من نماذج البيان بعد الاستيفاء: عرض فقط — الاستكمال من البيانات المطلوبة
  const formsHandoff = !isRequired && isRequiredStage(stageId);

  // من البيانات المطلوبة: ارجع لنماذج البيان إذا لم يصل للاستيفاء بعد
  useEffect(() => {
    if (isRequired && !isRequiredStage(stageId)) {
      navigate(`/ga/forms/${id}`, { replace: true });
    }
  }, [stageId, isRequired, id, navigate]);

  // فتح من نماذج البيان بعد الاستيفاء → تاب الاستيفاء مباشرة
  useEffect(() => {
    if (formsHandoff && showFulfillmentTab) {
      setTab("fulfillment");
    }
  }, [id, formsHandoff, showFulfillmentTab]);
  // قيد التنفيذ في الإنشاء فقط: بيانات KV ظاهرة؛ باقي التبويبات فارغة
  const isInProgressCreate = stageId === "create";
  const infoVariant = "kv";
  const formMode = isInProgressCreate
    ? "empty"
    : hasReachedStage(stageId, "review-form")
      ? "blank"
      : "empty";
  // مرحلة الاستيفاء: بدون أرقام؛ بعد اكتمالها (مراجعة البيانات+) بالقيم
  const fulfillmentMode = hasReachedStage(stageId, "review-data") ? "filled" : "blank";

  const tabs = useMemo(() => {
    const base = [
      { key: "info", label: "بيانات نموذج البيان" },
      { key: "form", label: "نموذج البيان" },
    ];
    if (showFulfillmentTab) {
      base.push({ key: "fulfillment", label: "استيفاء البيانات" });
    }
    base.push(
      { key: "attachments", label: "المرفقات" },
      { key: "notes", label: "الملاحظات" },
    );
    return base;
  }, [showFulfillmentTab]);

  useEffect(() => {
    if (!tabs.some((t) => t.key === tab)) setTab("info");
  }, [tab, tabs]);

  const isTerminal =
    stageId === "close"
    || ((live.status === "معتمد" || live.status === "معتمدة") && isFormsStage(stageId));

  const actions = (() => {
    if (formsHandoff) {
      return { showEdit: false, primaryLabel: null, primaryMessage: "", kind: null };
    }
    if (isTerminal) {
      return { showEdit: false, primaryLabel: null, primaryMessage: "", kind: null };
    }
    if (needsModification) {
      return {
        showEdit: false,
        primaryLabel: "إعادة الإرسال للمراجعة",
        primaryMessage: "تم إعادة إرسال الطلب بعد التعديل",
        kind: "resubmit",
      };
    }
    if (stageId === "create") {
      return {
        showEdit: false,
        primaryLabel: "تم انشاء نموذج البيان",
        primaryMessage: "تم انشاء نموذج البيان",
        kind: "advance",
      };
    }
    if (stageId === "review-form") {
      return {
        showEdit: true,
        primaryLabel: "اعتماد وإرساله لمشرف الإدارة",
        primaryMessage: "تم اعتماد نموذج البيان وإرساله لمشرف الإدارة",
        kind: "advance",
      };
    }
    if (stageId === "approve-form") {
      return {
        showEdit: false,
        primaryLabel: "إرسال للجهة",
        primaryMessage: "تم اعتماد نموذج البيان وإرساله للجهة — يمكن استكمال الطلب من البيانات المطلوبة",
        kind: "advance-to-required",
      };
    }
    if (stageId === "fulfill") {
      return {
        showEdit: false,
        primaryLabel: "اكتمال مرحلة الاستيفاء",
        primaryMessage: "تم اكتمال مرحلة الاستيفاء والانتقال إلى مراجعة البيانات",
        kind: "advance",
      };
    }
    if (stageId === "review-data") {
      return {
        showEdit: true,
        primaryLabel: "إرسال للاعتماد",
        primaryMessage: "تم إنهاء المراجعة وإرسال الطلب للاعتماد",
        kind: "advance",
      };
    }
    if (stageId === "final-approval") {
      return {
        showEdit: false,
        primaryLabel: "اعتماد وإغلاق الطلب",
        primaryMessage: "تم اعتماد الطلب وإغلاقه",
        kind: "advance",
      };
    }
    return { showEdit: false, primaryLabel: null, primaryMessage: "", kind: null };
  })();

  const handlePrimary = () => {
    setSuccessMessage(actions.primaryMessage);
    setPendingAdvance(true);
    setSuccess(true);
  };

  const handleEditSubmit = () => {
    setEditOpen(false);
    markModification(id, live);
    refresh();
    setEditSent(true);
  };

  const closeSuccess = () => {
    setSuccess(false);
    if (!pendingAdvance) return;
    setPendingAdvance(false);
    if (actions.kind === "resubmit") {
      resubmitAfterModification(id, live);
      refresh();
      return;
    }
    if (actions.kind === "advance" || actions.kind === "advance-to-required") {
      const updated = advanceRequest(id, live);
      refresh();
      if (updated?.stageId === "fulfill") {
        setTab("fulfillment");
      } else if (updated?.stageId === "review-data") {
        setTab("fulfillment");
      }
    }
  };

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
          <div className="mt-5 flex items-center justify-start gap-3 flex-wrap">
            <h2 className="font-[Cairo] font-bold text-[27px] leading-none text-[#052C65] text-right">
              {live.title || seed.title}
            </h2>
            <StatusBadge status={live.status} />
          </div>
        </div>

        <div className="flex gap-5 flex-wrap">
          <InfoTile
            icon={FileText}
            label="المرحلة الحالية"
            value={stage.label}
            sub={`المرحلة ${stageNumber} من ${STAGES.length}`}
          />
          <InfoTile
            icon={Monitor}
            label="الجهة الحالية"
            value={live.currentEntity || live.org}
          />
          <InfoTile
            icon={User}
            label="المسؤول الحالي"
            value={live.officer}
            sub={live.officerRole}
          />
          <InfoTile
            icon={statusTileVisual(live.status).icon}
            label="الحالة"
            value={live.status}
            iconBg={statusTileVisual(live.status).iconBg}
            iconClass={statusTileVisual(live.status).iconClass}
          />
        </div>

        <StageStepper stageId={stageId} status={live.status} />

        {formsHandoff && (
          <div className="rounded-xl border border-[#D8D8D8] bg-[#F8F9FA] px-5 py-4 text-[14px] text-[#404040] text-right">
            هذا الطلب في مرحلة استيفاء البيانات. لاستكمال الخطوات التالية، افتحه من
            {" "}
            <button
              type="button"
              onClick={() => navigate(`/ga/required/${id}`)}
              className="text-primary font-semibold hover:underline"
            >
              البيانات المطلوبة
            </button>
            .
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#D8D8D8]">
          <div
            className="grid border-b border-[#D8D8D8] px-6 pt-[14px]"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`h-[47px] w-full font-[Cairo] font-medium text-[18px] sm:text-[20px] leading-none whitespace-nowrap flex items-center justify-center border-b-[3px] transition-colors ${
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
            {tab === "info" && <InfoTab d={seed} variant={infoVariant} />}
            {tab === "form" && <FormDataTab d={seed} mode={formMode} />}
            {tab === "fulfillment" && showFulfillmentTab && (
              <FulfillmentTab d={seed} mode={fulfillmentMode} />
            )}
            {tab === "attachments" && (
              <AttachmentsTab d={seed} empty={isInProgressCreate} />
            )}
            {tab === "notes" && (
              <NotesTab
                requestId={id}
                author={name || live.officer}
                empty={isInProgressCreate}
              />
            )}
          </div>
        </div>

        {(actions.showEdit || actions.primaryLabel) && (
          <div className="flex gap-4 justify-end pb-4">
            {actions.showEdit && (
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="bg-primary text-white rounded-lg px-8 py-3 text-[15px] font-semibold cursor-pointer"
              >
                طلب تعديل
              </button>
            )}
            {actions.primaryLabel && (
              <button
                type="button"
                onClick={handlePrimary}
                className="bg-success text-white rounded-lg px-8 py-3 text-[15px] font-semibold cursor-pointer"
              >
                {actions.primaryLabel}
              </button>
            )}
          </div>
        )}

        <div className="flex justify-start pb-8">
          <button
            type="button"
            onClick={() => {
              resetRequestToStart(id, seed);
              navigate(`/ga/forms/${id}`);
              refresh();
              setTab("info");
            }}
            className="border border-[#D8D8D8] bg-white text-[#404040] rounded-lg px-6 py-2.5 text-[14px] font-medium hover:border-primary hover:text-primary cursor-pointer"
          >
            إعادة التجربة من البداية
          </button>
        </div>
      </div>

      <RequestEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <SuccessModal
        open={success}
        message={successMessage}
        onClose={closeSuccess}
      />

      <SuccessModal
        open={editSent}
        message="تم إرسال طلب التعديل"
        onClose={() => setEditSent(false)}
      />
    </Layout>
  );
}

