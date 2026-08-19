import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, UserRound, Link2, ShieldCheck } from "lucide-react";
import Layout from "../../components/it/ItLayout";
import SearchableMultiSelect from "../../components/it/SearchableMultiSelect";
import {
  Field, TextInput, SelectInput, PhoneInput, PasswordInput, FormActions,
} from "../../components/it/ItForm";
import {
  tenancies, jobRoles, generalAdmins, externalEntities, bulletins, entityPermissions,
} from "../../data/mockIt";

const PERMISSION_OPTIONS = entityPermissions.map((p) => ({ id: p, name: p }));

/** Nested block inside the Figma 1054:1144 white card. */
function NestedSection({ title, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-[11px] w-full">
      <div className="flex items-center gap-[19px]" dir="rtl">
        <Icon size={25} className="text-[#052c65] shrink-0" />
        <h2 className="text-[22px] font-bold text-[#052c65] text-right">{title}</h2>
      </div>
      <div className="border border-[rgba(9,134,237,0.24)] rounded-[20px] p-5">
        {children}
      </div>
    </div>
  );
}

const FIELDS = "grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-[120px]";

/**
 * إنشاء مستخدم جديد — Figma 1054:1144.
 * Variants 1060:2621 / 1060:3042 only change «تبعية المستخدم» visibility of later sections.
 */
export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "", name: "", tenancy: tenancies[0], status: "",
    password: "", email: "", jobRole: "", jobTitle: "",
  });
  const [adminIds, setAdminIds] = useState([]);
  const [entityIds, setEntityIds] = useState([]);
  const [bulletinIds, setBulletinIds] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const back = () => navigate("/it/users");

  const isDecisionMaker = form.tenancy === "صانع القرار";
  const isEntity = form.tenancy === "الجهة الخارجية";
  const adminName = generalAdmins.find((a) => a.id === adminIds[0])?.name;

  const entityOptions = useMemo(
    () => (adminName ? externalEntities.filter((e) => e.admin === adminName) : []),
    [adminName],
  );
  const bulletinOptions = useMemo(
    () => (entityIds.length ? bulletins : []),
    [entityIds],
  );

  const onAdminChange = (ids) => {
    setAdminIds(ids);
    setEntityIds([]);
    setBulletinIds([]);
  };
  const onEntityChange = (ids) => {
    setEntityIds(ids);
    setBulletinIds([]);
  };

  const adminField = (
    <SearchableMultiSelect
      label="الإدارة"
      required
      multiple={false}
      options={generalAdmins}
      selected={adminIds}
      onChange={onAdminChange}
      placeholder="اختر الإدارة"
    />
  );
  const entityField = (
    <SearchableMultiSelect
      label="الجهة"
      required
      options={entityOptions}
      selected={entityIds}
      onChange={onEntityChange}
      placeholder="اختر الجهة او اكثر"
      hint="اختر الإدارة أولاً لعرض الجهات المرتبطة"
      hintIcon
      disabled={!adminIds.length}
    />
  );

  return (
    <Layout title="المستخدمين">
      <div className="flex min-h-full flex-col">
        <div className="px-8 pt-7 pb-8 space-y-6 max-w-[1535.5px] flex-1">
          <div className="flex items-center gap-1 text-[20px]" dir="rtl">
            <Link to="/it/users" className="text-[#adb5bd] font-medium hover:text-primary">المستخدمين</Link>
            <ChevronLeft size={30} className="text-[#052c65] shrink-0" />
            <span className="text-[#052c65] font-semibold">إنشاء مستخدم جديد</span>
          </div>

          <div className="bg-white rounded-[20px] p-8 flex flex-col gap-[33px]">
            <NestedSection title="البيانات الأساسية" icon={UserRound}>
              <div className={FIELDS} dir="rtl">
                <Field label="تبعية المستخدم" required>
                  <SelectInput
                    value={form.tenancy}
                    onChange={set("tenancy")}
                    options={tenancies}
                    placeholder={null}
                  />
                </Field>
                <Field label="الاسم بالكامل" required>
                  <TextInput value={form.name} onChange={set("name")} placeholder="ادخل الاسم" />
                </Field>
                <Field label="رقم الهاتف" required>
                  <PhoneInput value={form.phone} onChange={set("phone")} placeholder="ادخل رقم الهاتف" />
                </Field>
                <Field label="البريد الإلكترونى" required>
                  <TextInput
                    value={form.email}
                    onChange={set("email")}
                    placeholder="ادخل البريد الإلكترونى"
                    type="email"
                    dir="ltr"
                  />
                </Field>
                <Field label="كلمة المرور المؤقتة" required>
                  <PasswordInput value={form.password} onChange={set("password")} placeholder="••••••••" />
                </Field>
                <Field label="الحالة" required>
                  <SelectInput
                    value={form.status}
                    onChange={set("status")}
                    options={["نشط", "غير نشط"]}
                    placeholder="نشط"
                  />
                </Field>
              </div>
            </NestedSection>

            {!isDecisionMaker && (
              <NestedSection title="بيانات الربط" icon={Link2}>
                <div className={FIELDS} dir="rtl">
                  {isEntity ? (
                    <>
                      {entityField}
                      {adminField}
                    </>
                  ) : (
                    <>
                      {adminField}
                      {entityField}
                    </>
                  )}
                  <SearchableMultiSelect
                    label="النشرات"
                    required
                    options={bulletinOptions}
                    selected={bulletinIds}
                    onChange={setBulletinIds}
                    placeholder="اختر نشرة او اكثر"
                    hint="اختر الجهة أولاً لعرض النشرات المرتبطة"
                    hintIcon
                    disabled={!entityIds.length}
                  />
                </div>
              </NestedSection>
            )}

            {!isDecisionMaker && (
              <NestedSection title="المعلومات الوظفية و الصلاحيات" icon={ShieldCheck}>
                <div className={FIELDS} dir="rtl">
                  <Field label="المسمى الوظيفي" required>
                    <TextInput
                      value={form.jobTitle}
                      onChange={set("jobTitle")}
                      placeholder="ادخل المسمى الوظيفي"
                    />
                  </Field>
                  <Field label="الدور الوظيفي" required>
                    <SelectInput
                      value={form.jobRole}
                      onChange={set("jobRole")}
                      options={jobRoles}
                      placeholder="اختر الدور الوظيفي"
                    />
                  </Field>
                  <SearchableMultiSelect
                    label="الصلاحيات"
                    required
                    showSearch={false}
                    options={PERMISSION_OPTIONS}
                    selected={permissions}
                    onChange={setPermissions}
                    placeholder="اختر الصلاحيات"
                  />
                </div>
              </NestedSection>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 h-[87px] bg-[#f9f9f9] border-t border-[#eaeaeb] px-8">
          <div className="h-full max-w-[1535.5px] w-full flex items-center">
            <FormActions className="w-full" onCancel={back} onSubmit={back} submitLabel="إنشاء" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
