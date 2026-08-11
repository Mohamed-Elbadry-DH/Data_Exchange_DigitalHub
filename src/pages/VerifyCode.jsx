import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell, { Spinner } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const LENGTH = 4;
const RESEND_SECONDS = 60;

export default function VerifyCode() {
  const { verifyCode, resendCode } = useAuth();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const setDigitAt = (index, value) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index, raw) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigitAt(index, "");
      return;
    }
    if (value.length > 1) {
      const chars = value.slice(0, LENGTH - index).split("");
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => (next[index + i] = c));
        return next;
      });
      inputs.current[Math.min(index + chars.length, LENGTH - 1)]?.focus();
      return;
    }
    setDigitAt(index, value);
    if (index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      setDigitAt(index - 1, "");
      inputs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index < LENGTH - 1) inputs.current[index + 1]?.focus();
    if (e.key === "ArrowRight" && index > 0) inputs.current[index - 1]?.focus();
  };

  const submit = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < LENGTH) {
      setError("من فضلك أدخل رمز التحقق كاملاً");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (verifyCode(code)) {
        navigate("/select-role");
      } else {
        setLoading(false);
        setError("رمز التحقق غير صحيح، من فضلك حاول مرة أخرى");
      }
    }, 600);
  };

  const resend = () => {
    resendCode();
    setDigits(Array(LENGTH).fill(""));
    setError("");
    setCountdown(RESEND_SECONDS);
    inputs.current[0]?.focus();
  };

  return (
    <AuthShell>
      <form onSubmit={submit} className="flex flex-col items-center gap-6">
        <p className="text-[15px] text-ink text-center">من فضلك أدخل رمز التحقق المرسل إليك</p>

        <div dir="ltr" className="flex items-center justify-center gap-4">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LENGTH}
              aria-label={`رمز التحقق - الخانة ${i + 1}`}
              className="h-[58px] w-[58px] rounded-lg border border-[#D8D8D8] bg-white text-center text-[22px] font-semibold text-navy-deep focus:border-primary focus:outline-none"
            />
          ))}
        </div>

        {error && <div className="text-[13px] text-danger text-center">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ height: "65.61px", borderRadius: "11.72px", background: "#0747A5" }}
          className="flex w-full items-center justify-center gap-3 text-[16px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-70"
        >
          {loading && <Spinner size={18} />}
          تأكيد الرمز
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={countdown > 0}
          className="text-[14px] font-semibold text-primary hover:underline disabled:text-muted disabled:no-underline"
        >
          {countdown > 0 ? `إعادة إرسال الرمز بعد ${countdown} ثانية` : "إعادة إرسال الرمز"}
        </button>
      </form>
    </AuthShell>
  );
}
