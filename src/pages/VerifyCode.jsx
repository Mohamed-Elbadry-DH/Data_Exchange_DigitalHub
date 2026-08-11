import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell, { Spinner } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const LENGTH = 4;
const RESEND_SECONDS = 60;
const TYPE_DELAY = 450;

export default function VerifyCode() {
  const { code, issueCode, verifyCode, role } = useAuth();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [typing, setTyping] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [pending, setPending] = useState(code);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!pending) return;
    setDigits(Array(LENGTH).fill(""));
    setTyping(true);
    timers.current.forEach(clearTimeout);
    timers.current = pending.split("").map((digit, i) =>
      setTimeout(() => {
        setDigits((prev) => {
          const next = [...prev];
          next[i] = digit;
          return next;
        });
        if (i === LENGTH - 1) setTyping(false);
      }, TYPE_DELAY * (i + 1))
    );
  }, [pending]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const submit = (e) => {
    e.preventDefault();
    const entered = digits.join("");
    if (entered.length < LENGTH) {
      setError("من فضلك أدخل رمز التحقق كاملاً");
      return;
    }
    setError("");
    setNotice("");
    setLoading(true);
    setTimeout(() => {
      const result = verifyCode(entered);
      if (result === "invalid") {
        setLoading(false);
        setError("رمز التحقق غير صحيح، من فضلك حاول مرة أخرى");
        return;
      }
      if (result === "blocked") {
        setLoading(false);
        setNotice(`صلاحيات «${role}» قيد التطوير حالياً، وستكون متاحة قريباً. هذه النسخة متاحة لمشرف الإدارة العامة فقط.`);
        return;
      }
      navigate("/loading", { replace: true });
    }, 600);
  };

  const resend = () => {
    setError("");
    setNotice("");
    setCountdown(RESEND_SECONDS);
    setPending(issueCode());
  };

  return (
    <AuthShell>
      <form onSubmit={submit} className="flex flex-col items-center gap-6">
        <p className="text-[15px] text-ink text-center">من فضلك أدخل رمز التحقق المرسل إليك</p>

        <div dir="ltr" className="flex items-center justify-center gap-4">
          {digits.map((digit, i) => (
            <div
              key={i}
              aria-label={`رمز التحقق - الخانة ${i + 1}`}
              className={`flex h-[58px] w-[58px] items-center justify-center rounded-lg border bg-white text-[22px] font-semibold text-navy-deep transition-colors ${
                digit ? "border-primary" : "border-[#D8D8D8]"
              }`}
            >
              {digit}
            </div>
          ))}
        </div>

        {error && <div className="text-[13px] text-danger text-center">{error}</div>}
        {notice && (
          <div className="rounded-lg bg-[#FFF4E5] px-4 py-3 text-[13px] font-semibold text-warning text-center">
            {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || typing}
          style={{ height: "65.61px", borderRadius: "11.72px", background: "#0747A5" }}
          className="flex w-full items-center justify-center gap-3 text-[16px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-70"
        >
          {loading && <Spinner size={18} />}
          تأكيد الرمز
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={countdown > 0 || typing}
          className="text-[14px] font-semibold text-primary hover:underline disabled:text-muted disabled:no-underline"
        >
          {countdown > 0 ? `إعادة إرسال الرمز بعد ${countdown} ثانية` : "إعادة إرسال الرمز"}
        </button>
      </form>
    </AuthShell>
  );
}
