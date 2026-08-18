import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "../../components/it/ItLayout";
import {
  Field, TextInput, SelectInput, CheckboxGroup, FormSection, FormActions,
} from "../../components/it/ItForm";
import {
  tenancies, jobRoles, generalAdmins, externalEntities, bulletins, entityPermissions,
} from "../../data/mockIt";

/**
 * إنشاء مستخدم جديد — Figma 1054:1144 / 1060:2621 / 1060:3042.
 * The three Figma variants differ only by «تبعية المستخدم», which drives which
 * link fields appear, so they are one page with conditional sections.
 */
export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "", name: "", tenancy: tenancies[0], status: "نشط",
    password: "", email: "", admin: "", entity: "", bulletin: "",
    jobRole: "", jobTitle: "",
  });
  const [permissions, setPermissions] = useState([]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const back = () => navigate("/it/users");

  const isDecisionMaker = form.tenancy === "صانع القرار";
  const isEntity = form.tenancy === "الجهة الخارجية";

  return (
    <Layout title="المستخدمين">
      <div className="px-8 pt-7 pb-10 space-y-6 max-w-[1100px]">
        <div className="flex items-center gap-2 text-[15px] text-muted" dir="rtl">
          <Link to="/it/users" className="hover:text-primary">المستخدمين</Link>
          <ChevronLeft size={16} />
          <span className="text-[#052c65] font-semibold">إنشاء مستخدم جديد</span>
        </div>

        <h2 className="text-[27px] font-bold text-[#052c65]">إنشاء مستخدم جديد</h2>

        <FormSection title="البيانات الأساسية">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="الاسم بالكامل" required>
              <TextInput value={form.name} onChange={set("name")} placeholder="ادخل الاسم" />
            </Field>
            <Field label="رقم الهاتف" required>
              <TextInput value={form.phone} onChange={set("phone")} placeholder="ادخل رقم الهاتف" dir="ltr" />
            </Field>
            <Field label="البريد الإلكترونى" required>
              <TextInput value={form.email} onChange={set("email")} placeholder="ادخل البريد الإلكترونى" type="email" dir="ltr" />
            </Field>
            <Field label="كلمة المرور المؤقتة" required>
              <TextInput value={form.password} onChange={set("password")} placeholder="كلمة المرور المؤقتة" type="password" dir="ltr" />
            </Field>
            <Field label="تبعية المستخدم" required>
              <SelectInput value={form.tenancy} onChange={set("tenancy")} options={tenancies} />
            </Field>
            <Field label="الحالة" required>
              <SelectInput value={form.status} onChange={set("status")} options={["نشط", "غير نشط"]} />
            </Field>
          </div>
        </FormSection>

        {!isDecisionMaker && (
          <FormSection title="بيانات الربط">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="الإدارة" required>
                <SelectInput
                  value={form.admin}
                  onChange={set("admin")}
                  options={generalAdmins.map((a) => a.name)}
                  placeholder="اختر الإدارة"
                />
              </Field>
              <Field
                label="الجهة"
                required={isEntity}
                hint={form.admin ? undefined : "اختر الإدارة أولاً لعرض الجهات المرتبطة"}
              >
                <SelectInput
                  value={form.entity}
                  onChange={set("entity")}
                  options={form.admin ? externalEntities.map((e) => e.name) : []}
                  placeholder="اختر الجهة او اكثر"
                />
              </Field>
              <Field
                label="النشرات"
                hint={form.entity ? undefined : "اختر الجهة أولاً لعرض النشرات المرتبطة"}
              >
                <SelectInput
                  value={form.bulletin}
                  onChange={set("bulletin")}
                  options={form.entity ? bulletins.map((b) => b.name) : []}
                  placeholder="اختر نشرة او اكثر"
                />
              </Field>
            </div>
          </FormSection>
        )}

        <FormSection title="المعلومات الوظفية و الصلاحيات">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="الدور الوظيفي" required>
              <SelectInput
                value={form.jobRole}
                onChange={set("jobRole")}
                options={jobRoles}
                placeholder="اختر الدور الوظيفي"
              />
            </Field>
            <Field label="المسمى الوظيفي">
              <TextInput value={form.jobTitle} onChange={set("jobTitle")} placeholder="ادخل المسمى الوظيفي" />
            </Field>
          </div>
          <Field label="الصلاحيات" required>
            <CheckboxGroup
              options={entityPermissions}
              selected={permissions}
              onToggle={(p) =>
                setPermissions((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))
              }
            />
          </Field>
        </FormSection>

        <FormActions onCancel={back} onSubmit={back} submitLabel="إنشاء" />
      </div>
    </Layout>
  );
}
