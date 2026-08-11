import { useEffect, useState } from "react";
import { X } from "lucide-react";

const ROLES = ["مشرف إدارة", "موظف إدارة", "مشرف الإدارة العامة"];

const emptyForm = { name: "", email: "", phone: "", role: ROLES[0] };

export default function UserFormModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
  }, [open, initial]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && form.email.trim() && form.phone.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-[420px]"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-[#404040] hover:text-primary"><X size={20} /></button>
          <h3 className="text-primary font-bold text-[18px]">{initial ? "تعديل مستخدم" : "إضافة مستخدم"}</h3>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">الاسم</div>
            <input value={form.name} onChange={set("name")} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">البريد الإلكتروني</div>
            <input value={form.email} onChange={set("email")} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right" dir="ltr" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">رقم الهاتف</div>
            <input value={form.phone} onChange={set("phone")} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right" dir="ltr" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[rgba(0,0,0,0.9)] mb-2 text-right">الدور الوظيفي</div>
            <select value={form.role} onChange={set("role")} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[14px] text-right appearance-none">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => onSubmit(form)}
          disabled={!valid}
          className="bg-primary text-white rounded-lg px-6 py-2.5 text-[14px] font-medium disabled:opacity-40"
        >
          {initial ? "حفظ التعديلات" : "إضافة"}
        </button>
      </div>
    </div>
  );
}
