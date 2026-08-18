import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";
import Layout from "../../components/it/ItLayout";
import LinkEntitiesModal from "../../components/it/LinkEntitiesModal";
import {
  Field, TextInput, TextArea, CheckboxGroup, FormSection, FormActions,
} from "../../components/it/ItForm";
import { adminPermissions } from "../../data/mockIt";

/** إنشاء إدارة جديدة — Figma 315:1170 */
export default function AdminCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [entities, setEntities] = useState([]);
  const [linkOpen, setLinkOpen] = useState(false);

  const togglePermission = (p) =>
    setPermissions((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  const back = () => navigate("/it/admins");

  return (
    <Layout title="الإدارات العامة">
      <div className="px-8 pt-7 pb-10 space-y-6 max-w-[1100px]">
        <div className="flex items-center gap-2 text-[15px] text-muted" dir="rtl">
          <Link to="/it/admins" className="hover:text-primary">الإدارات العامة</Link>
          <ChevronLeft size={16} />
          <span className="text-[#052c65] font-semibold">إنشاء إدارة جديدة</span>
        </div>

        <h2 className="text-[27px] font-bold text-[#052c65]">إنشاء إدارة جديدة</h2>

        <FormSection title="البيانات الأساسية">
          <Field label="اسم الإدارة العامة" required>
            <TextInput value={name} onChange={setName} placeholder="اسم الإدارة العامة" />
          </Field>
          <Field label="وصف الإدارة">
            <TextArea
              value={description}
              onChange={setDescription}
              placeholder="أدخل وصف الإدارة العامة و أهدافها و اختصاصتها"
            />
          </Field>
        </FormSection>

        <FormSection title="الصلاحيات">
          <CheckboxGroup options={adminPermissions} selected={permissions} onToggle={togglePermission} />
        </FormSection>

        <FormSection title="الجهات الخارجية المرتبطة">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLinkOpen(true)}
              className="flex items-center gap-2 bg-[#052C65] text-white text-[14px] font-bold rounded-[12px] py-2.5 px-4 cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              ربط الجهات خارجية
            </button>
          </div>
          {entities.length > 0 ? (
            <ul className="flex flex-wrap gap-3 justify-end" dir="rtl">
              {entities.map((e) => (
                <li
                  key={e}
                  className="flex items-center gap-2 bg-[#E3EEFF] text-[#1B75FF] rounded-full ps-4 pe-2 py-2 text-[15px]"
                >
                  {e}
                  <button
                    type="button"
                    onClick={() => setEntities((s) => s.filter((x) => x !== e))}
                    aria-label={`إزالة ${e}`}
                    className="cursor-pointer hover:text-danger"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-[15px] text-right">لم يتم ربط أي جهة خارجية بعد</p>
          )}
        </FormSection>

        <FormActions onCancel={back} onSubmit={back} submitLabel="إنشاء" />
      </div>

      <LinkEntitiesModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="ربط الجهات خارجية"
        onSubmit={(picked) => setEntities((s) => [...new Set([...s, ...picked])])}
      />
    </Layout>
  );
}
