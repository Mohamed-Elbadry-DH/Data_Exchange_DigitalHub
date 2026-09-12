import {
  Field, TextInput, SelectInput, TextArea, FormSection, NumberInput, DateInput,
} from "../../../components/it/ItForm";
import {
  generalAdmins, bulletins, externalEntities, periodicities, yearTypes,
} from "../../../data/mockIt";

const SCOPES = ["جمهورية مصر العربية", "محافظة", "إقليم", "مدينة"];
const PERIOD_DETAILS = ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع", "النصف الأول", "النصف الثاني"];
const YEARS = ["2020/2021", "2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026", "2026/2027"];

/** Section titles aligned to IT detail (~18) — inputs stay compact 14px. */
const TITLE = "text-[18px] font-semibold leading-normal text-[#052c65] text-right";
const CARD = "border border-[#d8d8d8] shadow-none px-5 sm:px-6 pt-5 pb-6";
const GOLD = "text-[14px] font-bold leading-normal text-[#c89637] text-right";

function MetaField({ label, required, children }) {
  return (
    <Field label={label} required={required} compact>
      {children}
    </Field>
  );
}

function MetaSelect({ value, onChange, options, placeholder }) {
  return (
    <SelectInput
      compact
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
    />
  );
}

/** Step 1 — البيانات الوصفية لنموذج البيان (Figma 279:77) */
export default function StepMetadata({ meta, onChange }) {
  const set = (k) => (v) => onChange({ ...meta, [k]: v });

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h2 className="text-[18px] font-bold leading-normal text-[#052c65]">البيانات الوصفية لنموذج البيان</h2>
        <p className="text-[14px] font-medium leading-normal text-[#adb5bd] mt-1">أدخل المعلومات الأساسية للقالب الجديد</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start" dir="rtl">
        <div className="flex flex-col gap-5 min-w-0">
          <FormSection
            title="البيانات الوصفية لنموذج البيان"
            className={`${CARD} !gap-4`}
            titleClassName={TITLE}
          >
            <MetaField label="عنوان نموذج البيان" required>
              <TextInput
                compact
                value={meta.title}
                onChange={set("title")}
                placeholder="مثال: استمارة رقم 306"
              />
            </MetaField>
            <MetaField label="الإدارة المسؤولة" required>
              <MetaSelect
                value={meta.admin}
                onChange={set("admin")}
                options={generalAdmins.map((a) => a.name)}
                placeholder="اختر الإدارة"
              />
            </MetaField>
            <MetaField label="النشرة" required>
              <MetaSelect
                value={meta.bulletin}
                onChange={set("bulletin")}
                options={bulletins.map((b) => b.name)}
                placeholder="النشرة المرتبطة"
              />
            </MetaField>
            <MetaField label="الجهة المسؤولة" required>
              <MetaSelect
                value={meta.entity}
                onChange={set("entity")}
                options={externalEntities.map((e) => e.name)}
                placeholder="اختر جهة مسؤولة"
              />
            </MetaField>
            <MetaField label="النطاق الجغرافي" required>
              <MetaSelect
                value={meta.scope}
                onChange={set("scope")}
                options={SCOPES}
                placeholder="اختر النطاق الجغرافي"
              />
            </MetaField>
            <MetaField label="المنهجية">
              <TextArea
                compact
                value={meta.methodology}
                onChange={set("methodology")}
                placeholder="يرجى توضيح المنهجية المستخدمة لإعداد البيانات"
                className="h-[88px]"
              />
            </MetaField>
            <MetaField label="وصف البيان">
              <TextArea
                compact
                value={meta.description}
                onChange={set("description")}
                placeholder="وصف تفصيلى للبيان و الغرض منة...."
                className="h-[63px]"
              />
            </MetaField>
          </FormSection>

          <FormSection
            title="متطلبات الهيكل"
            className={`${CARD} !gap-[25px]`}
            titleClassName={TITLE}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-[25px]" dir="rtl">
              <MetaField label="عدد المجموعات الرئيسية المطلوبة" required>
                <NumberInput compact value={meta.groupsRequired} onChange={set("groupsRequired")} />
              </MetaField>
              <MetaField label="عدد الأقسام الفرعية المطلوبة" required>
                <NumberInput compact value={meta.subsectionsRequired} onChange={set("subsectionsRequired")} />
              </MetaField>
              <MetaField label="عدد الأعمدة المطلوبة" required>
                <NumberInput compact value={meta.columnsRequired} onChange={set("columnsRequired")} />
              </MetaField>
              <MetaField label="عدد الصفوف المطلوبة" required>
                <NumberInput compact value={meta.rowsRequired} onChange={set("rowsRequired")} />
              </MetaField>
            </div>
          </FormSection>
        </div>

        <FormSection
          title="الدورية والمواعيد"
          className={`${CARD} !gap-[25px]`}
          titleClassName={TITLE}
        >
          <MetaField label="نوع السنة" required>
            <MetaSelect value={meta.yearType} onChange={set("yearType")} options={yearTypes} placeholder="مالية" />
          </MetaField>
          <MetaField label="السنة" required>
            <MetaSelect value={meta.year} onChange={set("year")} options={YEARS} placeholder="2021/2022" />
          </MetaField>
          <MetaField label="الدورية" required>
            <MetaSelect value={meta.periodicity} onChange={set("periodicity")} options={periodicities} placeholder="ربع سنوي" />
          </MetaField>
          <MetaField label="تفصيل الدورية" required>
            <MetaSelect
              value={meta.periodicityDetail}
              onChange={set("periodicityDetail")}
              options={PERIOD_DETAILS}
              placeholder="الربع الأول"
            />
          </MetaField>

          <div className="flex flex-col gap-[22px] w-full">
            <label className="text-[16.634px] font-bold leading-normal text-[#1f254b] text-right">
              فترة تجميع البيان<span className="text-[#dc2626]"> *</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
              <div className="flex flex-col gap-[10px]">
                <span className={GOLD}>من</span>
                <DateInput compact value={meta.collectFrom} onChange={set("collectFrom")} />
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className={GOLD}>إلى</span>
                <DateInput compact value={meta.collectTo} onChange={set("collectTo")} />
              </div>
            </div>
          </div>

          <MetaField label="تاريخ الاستحقاق" required>
            <DateInput compact value={meta.dueDate} onChange={set("dueDate")} />
          </MetaField>
          <MetaField label="فترة السماح (أيام)" required>
            <NumberInput compact value={meta.graceDays} onChange={set("graceDays")} />
          </MetaField>
        </FormSection>
      </div>
    </div>
  );
}
