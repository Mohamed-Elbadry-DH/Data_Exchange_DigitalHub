import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const PREFS_KEY = "mped-settings-prefs-v1";

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { emailNotices: true, deadlineAlerts: true };
    return { emailNotices: true, deadlineAlerts: true, ...JSON.parse(raw) };
  } catch {
    return { emailNotices: true, deadlineAlerts: true };
  }
}

function Field({ label, value }) {
  return (
    <div className="text-right">
      <div className="text-[13px] text-muted mb-1">{label}</div>
      <div className="text-[15px] font-semibold text-[rgba(0,0,0,0.9)] break-all">{value || "—"}</div>
    </div>
  );
}

function PrefToggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3 border-b border-[#EAEAEB] last:border-0 cursor-pointer" dir="rtl">
      <span className="text-right min-w-0">
        <span className="block text-[15px] font-semibold text-[#052C65]">{label}</span>
        {hint && <span className="block text-[13px] text-muted mt-0.5">{hint}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-[#0986ed] shrink-0 cursor-pointer"
      />
    </label>
  );
}

/**
 * Shared settings body — profile read-only + local notification prefs.
 * Wrap with the role Layout in each module page.
 */
export default function SettingsView() {
  const { name, email, role } = useAuth();
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const setPref = (key) => (value) => setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <div className="page-shell space-y-6">
      <h2 className="text-[18px] font-bold text-[rgba(0,0,0,0.9)] text-right">الإعدادات</h2>

      <div className="bg-white rounded-2xl border border-[#D8D8D8] shadow-sm p-6 space-y-6">
        <h3 className="text-[16px] font-bold text-[#052C65] text-right">بيانات الحساب</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Field label="الاسم" value={name} />
          <Field label="البريد الإلكتروني" value={email} />
          <Field label="الدور" value={role} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8D8D8] shadow-sm p-6 text-right">
        <h3 className="text-[16px] font-bold text-[#052C65] mb-1">تفضيلات الإشعارات</h3>
        <p className="text-[13px] text-muted mb-2">تُحفظ محلياً على هذا الجهاز حتى ربط واجهة الإعدادات.</p>
        <PrefToggle
          label="إشعارات البريد"
          hint="تنبيهات عند وصول طلب أو اعتماد"
          checked={prefs.emailNotices}
          onChange={setPref("emailNotices")}
        />
        <PrefToggle
          label="تنبيهات المواعيد النهائية"
          hint="تذكير عند اقتراب أو تجاوز الموعد"
          checked={prefs.deadlineAlerts}
          onChange={setPref("deadlineAlerts")}
        />
      </div>
    </div>
  );
}
