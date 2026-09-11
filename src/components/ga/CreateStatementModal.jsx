import { useEffect, useState } from "react";
import { X, ChevronDown, Calendar, Upload, TriangleAlert } from "lucide-react";

const emptyForm = {
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

const OPTIONS = {
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

function DiscardWarning({ open, onConfirm, onCancel }) {
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

const GAP = 5;

export default function CreateStatementModal({ open, onClose, onSubmit, anchorRef, containerRef }) {
  const [form, setForm] = useState(emptyForm);
  const [confirmClose, setConfirmClose] = useState(false);
  const [box, setBox] = useState({ left: GAP, right: GAP, top: GAP, bottom: GAP });

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setConfirmClose(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const measure = () => {
      const container = containerRef?.current;
      const anchor = anchorRef?.current;
      if (!container) return;
      const c = container.getBoundingClientRect();
      const a = anchor?.getBoundingClientRect();
      // Create button is on the physical right (RTL inline-start). Open the
      // sheet in the remaining space to its left — using `anchor.right` here
      // leaves only the few pixels between the button and the sidebar.
      const right = a
        ? Math.max(GAP, Math.round(c.right - a.left + GAP))
        : GAP;
      const leftEdge = GAP;
      const available = Math.max(0, c.width - leftEdge - right);
      const width = Math.round(available * 0.8);
      const left = leftEdge + Math.max(0, available - width);
      if (c.width - left - right < 480) {
        setBox({ left: GAP, right: GAP, top: GAP, bottom: GAP });
        return;
      }
      setBox({ left, right, top: GAP, bottom: GAP });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, anchorRef, containerRef]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const requestClose = () => setConfirmClose(true);
  const confirmDiscard = () => {
    setConfirmClose(false);
    onClose?.();
  };

  return (
    <>
      <div
        className="absolute inset-0 z-50 bg-black/40"
        onClick={requestClose}
      >
        <div
          className="absolute overflow-auto"
          style={{
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
            background: "#E9ECEF",
            borderRadius: "26.67px",
            boxShadow: "0px 5.33px 5.33px 0px #00000040",
          }}
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[22px] font-bold text-[#052C65]">طلب إنشاء نموذج البيان</h3>
              <button
                type="button"
                onClick={requestClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#404040] hover:bg-black/5 cursor-pointer"
                aria-label="إغلاق"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              {/* Right column (first in RTL) */}
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

              {/* Left column */}
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

            <div className="flex items-center justify-start gap-3 mt-10" dir="ltr">
              <button
                type="button"
                className="h-[48px] px-6 rounded-lg bg-[#1B75FF] text-white text-[15px] font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload size={18} />
                رفع الملف
              </button>
              <button
                type="button"
                onClick={() => onSubmit?.(form)}
                className="h-[48px] px-8 rounded-lg bg-[#16A34A] text-white text-[15px] font-semibold cursor-pointer"
              >
                إرسال
              </button>
              <button
                type="button"
                onClick={requestClose}
                className="h-[48px] px-8 rounded-lg bg-[#CED4DA] text-[#404040] text-[15px] font-semibold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>

      <DiscardWarning
        open={confirmClose}
        onConfirm={confirmDiscard}
        onCancel={() => setConfirmClose(false)}
      />
    </>
  );
}
