import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthShell, { Spinner, AUTH } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { demoUsers } from "../data/mock";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picked, setPicked] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailFieldRef = useRef(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const onPointerDown = (e) => {
      if (!emailFieldRef.current?.contains(e.target)) setPickerOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setPickerOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pickerOpen]);

  const pick = (u) => {
    setPicked(u);
    setEmail(u.email);
    setPassword(u.password);
    setError("");
    setPickerOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("من فضلك أدخل بريد إلكتروني صحيح");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    const account = picked ?? demoUsers.find((u) => u.email === email.trim());
    if (!account) {
      setError("هذا الحساب غير موجود، من فضلك اختر مستخدماً من القائمة");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      signIn({
        email: account.email,
        name: account.name,
        role: account.role,
        allowed: account.enabled,
        home: account.home,
      });
      navigate("/verify");
    }, 600);
  };

  const fieldClass =
    "w-full border border-[rgba(5,44,101,0.2)] bg-white pl-[84px] pr-4 text-left text-[21.77px] font-normal text-black placeholder:text-black/30 focus:border-[rgba(5,44,101,0.45)] focus:outline-none";

  return (
    <AuthShell>
      <form onSubmit={submit} className="flex flex-col" style={{ gap: AUTH.gap }}>
        <div className="flex flex-col" style={{ gap: AUTH.fieldGap }}>
          <div className="relative" ref={emailFieldRef}>
            <Mail
              size={24}
              strokeWidth={1.75}
              className="pointer-events-none absolute top-1/2 left-[33px] -translate-y-1/2 text-black/30"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setPicked(null);
              }}
              onFocus={() => setPickerOpen(true)}
              onClick={() => setPickerOpen(true)}
              placeholder="Email Address"
              autoComplete="off"
              dir="ltr"
              aria-expanded={pickerOpen}
              style={{ height: AUTH.inputH, borderRadius: `${AUTH.inputRadius}px` }}
              className={fieldClass}
            />

            {pickerOpen && (
              <ul className="absolute z-20 mt-2 max-h-[320px] w-full overflow-y-auto rounded-lg border border-[#D8D8D8] bg-white py-1 shadow-[0_8px_24px_rgba(5,44,101,0.12)]">
                {demoUsers.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => pick(u)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right hover:bg-[#F1F5FB]"
                    >
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-navy-deep">{u.role}</span>
                        <span className="block text-[13px] text-muted">{u.name}</span>
                        <span className="block text-[12px] text-[#ADB5BD]" dir="ltr">{u.email}</span>
                      </span>
                      {!u.enabled && (
                        <span className="shrink-0 rounded-full bg-[#FFF4E5] px-2 py-1 text-[11px] font-semibold text-warning">
                          قيد التطوير
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
            <img
              src="/icon-lock.png"
              alt=""
              width={24}
              height={24}
              draggable={false}
              className="pointer-events-none absolute top-1/2 left-[30px] h-6 w-6 -translate-y-1/2 select-none opacity-30"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              dir="ltr"
              style={{ height: AUTH.inputH, borderRadius: `${AUTH.inputRadius}px` }}
              className={fieldClass}
            />
          </div>
        </div>

        {error && <div className="-mb-6 text-[13px] text-danger text-right">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ height: AUTH.buttonH, borderRadius: `${AUTH.buttonRadius}px` }}
          className="flex w-full items-center justify-center gap-2 bg-[#0747A5] text-[20px] font-bold text-[#F8F9FA] transition-[background-color,transform] duration-[400ms] ease-out hover:bg-[#052C65] hover:translate-y-[0.543px] disabled:opacity-70"
        >
          {loading && <Spinner size={14} />}
          تسجيل دخول
        </button>
      </form>
    </AuthShell>
  );
}
