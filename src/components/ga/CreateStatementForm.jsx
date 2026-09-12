import { useState } from "react";
import { ChevronDown, Calendar, Upload, TriangleAlert } from "lucide-react";

export const emptyCreateForm = {
  assignTo: "",
  title: "",
  department: "",
  bulletin: "",
  methodology: "",
  entity: "",
  geoScope: "",
  description: "",
  yearType: "ميلادية",
  year: "",
  periodicity: "ربع سنوي",
  periodicityDetail: "",
  collectFrom: "",
  collectTo: "",
  dueDate: "",
  graceDays: "0",
};

export const CREATE_STATEMENT_OPTIONS = {
  assignTo: ["أحمد محمد", "سارة حسن", "محمود إبراهيم", "نورا عبد الله"],
  department: ["إدارة الإحصاءات السكانية", "إدارة الإحصاءات الاقتصادية", "إدارة نظم المعلومات"],
  bulletin: ["النشرة الشهرية", "النشرة الربع سنوية", "النشرة السنوية"],
  entity: [
    "الجهاز المركزي للتعبئة العامة والإحصاء",
    "وزارة التربية والتعليم والتعليم الفني",
    "وزارة الصحة والسكان",
    "وزارة المالية",
    "وزارة الداخلية",
  ],
  geoScope: ["على مستوى الجمهورية", "على مستوى المحافظة", "على مستوى المركز"],
  yearType: ["ميلادية", "هجرية"],
  year: ["2024", "2025", "2026", "2027"],
  periodicity: ["سنوي", "نصف سنوي", "ربع سنوي", "شهري"],
  periodicityDetail: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"],
};

const fieldClass =
  "w-full h-[48px] bg-white border border-[#D8D8D8] rounded-lg px-3 text-[14px] text-[#404040] text-right placeholder:text-[#ADB5BD] outline-none focus:border-primary";
const areaClass =
  "w-full min-h-[96px] bg-white border border-[#D8D8D8] rounded-lg px-3 py-2.5 text-[14px] text-[#404040] text-right placeholder:text-[#ADB5BD] outline-none focus:border-primary resize-none";

function Label({ children, required }) {
  return (
    <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">
      {children}
      {required && <span className="text-danger ms-0.5">*</span>}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${fieldClass} appearance-none pe-3 ps-9`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f8999] pointer-events-none" />
    </div>
  );
}

function DateField({ value, onChange }) {
  return (
    <div className="relative" dir="ltr">
      <input
        type="date"
        value={value}
        onChange={onChange}
        className={`${fieldClass} ga-date-input ${value ? "ga-date-filled" : ""}`}
      />
      <Calendar
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export function DiscardWarning({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay z-[60]" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-[400px] flex flex-col items-center gap-5 shadow-lg"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <TriangleAlert size={48} className="text-warning" strokeWidth={1.5} />
        <div className="text-[15px] font-semibold text-[rgba(0,0,0,0.9)] text-center leading-7">
          لم يتم حفظ الطلب هل ترغب في الالغاء
        </div>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-danger text-white rounded-lg py-2.5 text-[14px] font-medium cursor-pointer"
          >
            نعم، إلغاء
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-[#D8D8D8] text-[#404040] rounded-lg py-2.5 text-[14px] font-medium cursor-pointer"
          >
            العودة
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared create-statement fields (PDF / docs §10).
 * Used by `/ga/forms/new` page; former modal re-exports this body.
 */
export default function CreateStatementForm({
  form,
  onChange,
  uploadName,
  onUpload,
  onSubmit,
  onCancel,
  showActions = true,
}) {
  const OPTIONS = CREATE_STATEMENT_OPTIONS;
  const set = (key) => (e) => onChange({ ...form, [key]: e.target.value });

  return (
    <div dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5">
        <div className="space-y-5">
          <div>
            <Label required>توجيه الطلب إلى</Label>
            <SelectField
              value={form.assignTo}
              onChange={set("assignTo")}
              options={OPTIONS.assignTo}
              placeholder="أحمد محمد"
            />
          </div>
          <div>
            <Label required>عنوان نموذج البيان</Label>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="مثال: استمارة رقم 306"
              className={fieldClass}
            />
          </div>
          <div>
            <Label required>الإدارة المسؤولة</Label>
            <SelectField
              value={form.department}
              onChange={set("department")}
              options={OPTIONS.department}
              placeholder="اختر إدارة مسؤولة"
            />
          </div>
          <div>
            <Label required>النشرة</Label>
            <SelectField
              value={form.bulletin}
              onChange={set("bulletin")}
              options={OPTIONS.bulletin}
              placeholder="النشرة المرتبطة"
            />
          </div>
          <div>
            <Label>المنهجية</Label>
            <textarea
              value={form.methodology}
              onChange={set("methodology")}
              placeholder="يرجى توضيح المنهجية المستخدمة لإعداد البيانات"
              className={areaClass}
              rows={3}
            />
          </div>
          <div>
            <Label required>الجهة المسؤولة</Label>
            <SelectField
              value={form.entity}
              onChange={set("entity")}
              options={OPTIONS.entity}
              placeholder="اختر جهة مسؤولة"
            />
          </div>
          <div>
            <Label required>النطاق الجغرافي</Label>
            <SelectField
              value={form.geoScope}
              onChange={set("geoScope")}
              options={OPTIONS.geoScope}
              placeholder="اختر نطاق جغرافي"
            />
          </div>
          <div>
            <Label>وصف البيان</Label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="وصف تفصيلي للبيان و الغرض منه...."
              className={areaClass}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label required>نوع السنة</Label>
            <SelectField
              value={form.yearType}
              onChange={set("yearType")}
              options={OPTIONS.yearType}
              placeholder="ميلادية"
            />
          </div>
          <div>
            <Label required>السنة</Label>
            <SelectField
              value={form.year}
              onChange={set("year")}
              options={OPTIONS.year}
              placeholder="اختر السنة"
            />
          </div>
          <div>
            <Label required>الدورية</Label>
            <SelectField
              value={form.periodicity}
              onChange={set("periodicity")}
              options={OPTIONS.periodicity}
              placeholder="ربع سنوي"
            />
          </div>
          <div>
            <Label required>تفصيل الدورية</Label>
            <SelectField
              value={form.periodicityDetail}
              onChange={set("periodicityDetail")}
              options={OPTIONS.periodicityDetail}
              placeholder="الربع الأول"
            />
          </div>
          <div>
            <Label required>فترة تجميع البيان</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[12px] text-[#7f8999] mb-1.5 text-right">من</div>
                <DateField value={form.collectFrom} onChange={set("collectFrom")} />
              </div>
              <div>
                <div className="text-[12px] text-[#7f8999] mb-1.5 text-right">إلى</div>
                <DateField value={form.collectTo} onChange={set("collectTo")} />
              </div>
            </div>
          </div>
          <div>
            <Label required>تاريخ الاستحقاق</Label>
            <DateField value={form.dueDate} onChange={set("dueDate")} />
          </div>
          <div>
            <Label required>فترة السماح (أيام)</Label>
            <input
              type="number"
              min={0}
              value={form.graceDays}
              onChange={set("graceDays")}
              placeholder="0"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-start gap-3 mt-10 flex-wrap" dir="ltr">
          <button
            type="button"
            onClick={onUpload}
            className="h-[48px] px-6 rounded-lg bg-[#1B75FF] text-white text-[15px] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Upload size={18} />
            رفع الملف
          </button>
          {uploadName && (
            <span className="text-[13px] text-[#052c65] max-w-[220px] truncate" dir="rtl" title={uploadName}>
              {uploadName}
            </span>
          )}
          <button
            type="button"
            onClick={onSubmit}
            className="h-[48px] px-8 rounded-lg bg-[#16A34A] text-white text-[15px] font-semibold cursor-pointer"
          >
            إرسال
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-[48px] px-8 rounded-lg bg-[#CED4DA] text-[#404040] text-[15px] font-semibold cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      )}
    </div>
  );
}

/** Hook-friendly helpers for page / modal wrappers */
export function useCreateStatementState() {
  const [form, setForm] = useState(emptyCreateForm);
  const [uploadName, setUploadName] = useState("");
  const reset = () => {
    setForm(emptyCreateForm);
    setUploadName("");
  };
  const mockUpload = () => {
    setUploadName(`مرفق_${form.title || "طلب"}_${Date.now().toString().slice(-4)}.xlsx`);
  };
  return { form, setForm, uploadName, setUploadName, reset, mockUpload };
}
