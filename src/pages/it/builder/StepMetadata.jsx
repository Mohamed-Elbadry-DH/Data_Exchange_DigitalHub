import { Field, TextInput, SelectInput, TextArea, FormSection } from "../../../components/it/ItForm";
import {
  generalAdmins, bulletins, externalEntities, periodicities, yearTypes,
} from "../../../data/mockIt";

const SCOPES = ["جمهورية مصر العربية", "محافظة", "إقليم", "مدينة"];
const PERIOD_DETAILS = ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع", "النصف الأول", "النصف الثاني"];

/** Step 1 — البيانات الوصفية لنموذج البيان (Figma 279:77) */
export default function StepMetadata({ meta, onChange }) {
  const set = (k) => (v) => onChange({ ...meta, [k]: v });

  return (
    <div className="space-y-6">
      <FormSection title="البيانات الوصفية لنموذج البيان">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field label="عنوان نموذج البيان" required>
            <TextInput value={meta.title} onChange={set("title")} placeholder="مثال: استمارة رقم 306" />
          </Field>
          <Field label="الإدارة المسؤولة" required>
            <SelectInput
              value={meta.admin}
              onChange={set("admin")}
              options={generalAdmins.map((a) => a.name)}
              placeholder="اختر الإدارة"
            />
          </Field>
          <Field label="النشرة المرتبطة" required>
            <SelectInput
              value={meta.bulletin}
              onChange={set("bulletin")}
              options={bulletins.map((b) => b.name)}
              placeholder="النشرة"
            />
          </Field>
          <Field label="الجهة المسؤولة" required>
            <SelectInput
              value={meta.entity}
              onChange={set("entity")}
              options={externalEntities.map((e) => e.name)}
              placeholder="اختر جهة مسؤولة"
            />
          </Field>
          <Field label="النطاق الجغرافي" required>
            <SelectInput value={meta.scope} onChange={set("scope")} options={SCOPES} placeholder="اختر النطاق الجغرافي" />
          </Field>
        </div>
        <Field label="المنهجية">
          <TextArea
            value={meta.methodology}
            onChange={set("methodology")}
            placeholder="يرجى توضيح المنهجية المستخدمة لإعداد البيانات"
            rows={4}
          />
        </Field>
        <Field label="وصف البيان">
          <TextArea
            value={meta.description}
            onChange={set("description")}
            placeholder="وصف تفصيلى للبيان و الغرض منة...."
            rows={4}
          />
        </Field>
      </FormSection>

      <FormSection title="متطلبات الهيكل">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Field label="عدد المجموعات الرئيسية المطلوبة" required>
            <TextInput value={meta.groupsRequired} onChange={set("groupsRequired")} placeholder="0" type="number" dir="ltr" />
          </Field>
          <Field label="عدد الأقسام الفرعية المطلوبة" required>
            <TextInput value={meta.subsectionsRequired} onChange={set("subsectionsRequired")} placeholder="0" type="number" dir="ltr" />
          </Field>
          <Field label="عدد الأعمدة المطلوبة" required>
            <TextInput value={meta.columnsRequired} onChange={set("columnsRequired")} placeholder="0" type="number" dir="ltr" />
          </Field>
          <Field label="عدد الصفوف المطلوبة" required>
            <TextInput value={meta.rowsRequired} onChange={set("rowsRequired")} placeholder="0" type="number" dir="ltr" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="الدورية والمواعيد">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field label="نوع السنة" required>
            <SelectInput value={meta.yearType} onChange={set("yearType")} options={yearTypes} />
          </Field>
          <Field label="السنة" required>
            <TextInput value={meta.year} onChange={set("year")} placeholder="2021/2022" dir="ltr" />
          </Field>
          <Field label="الدورية" required>
            <SelectInput value={meta.periodicity} onChange={set("periodicity")} options={periodicities} placeholder="ربع سنوي" />
          </Field>
          <Field label="تفصيل الدورية" required>
            <SelectInput value={meta.periodicityDetail} onChange={set("periodicityDetail")} options={PERIOD_DETAILS} placeholder="الربع الأول" />
          </Field>
        </div>

        <Field label="فترة تجميع البيان" required>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[16px] text-[#1f254b]/70 text-right">من</span>
              <TextInput value={meta.collectFrom} onChange={set("collectFrom")} type="date" dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[16px] text-[#1f254b]/70 text-right">إلى</span>
              <TextInput value={meta.collectTo} onChange={set("collectTo")} type="date" dir="ltr" />
            </div>
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field label="تاريخ الاستحقاق" required>
            <TextInput value={meta.dueDate} onChange={set("dueDate")} type="date" dir="ltr" />
          </Field>
          <Field label="فترة السماح (أيام)" required>
            <TextInput value={meta.graceDays} onChange={set("graceDays")} placeholder="0" type="number" dir="ltr" />
          </Field>
        </div>
      </FormSection>
    </div>
  );
}
