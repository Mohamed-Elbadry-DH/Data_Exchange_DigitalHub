import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthShell, { Spinner } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setError("");
    setLoading(true);
    setTimeout(() => {
      signIn(email.trim());
      navigate("/verify");
    }, 600);
  };

  return (
    <AuthShell>
      <form onSubmit={submit} className="flex flex-col gap-[35px]">
        <div className="relative">
          <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            autoComplete="username"
            dir="ltr"
            className="h-[52px] w-full rounded-lg border border-[#D8D8D8] bg-white pl-12 pr-4 text-[15px] text-ink text-left placeholder:text-[#ADB5BD] focus:border-primary focus:outline-none"
          />
        </div>

        <div className="relative">
          <img
            src="/icon-lock.png"
            alt=""
            width={20}
            height={20}
            draggable={false}
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 select-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            dir="ltr"
            className="h-[52px] w-full rounded-lg border border-[#D8D8D8] bg-white pl-12 pr-4 text-[15px] text-ink text-left placeholder:text-[#ADB5BD] focus:border-primary focus:outline-none"
          />
        </div>

        {error && <div className="-mb-8 text-[13px] text-danger text-right">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ height: "65.61px", borderRadius: "11.72px", background: "#0747A5" }}
          className="flex w-full items-center justify-center gap-3 text-[16px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-70"
        >
          {loading && <Spinner size={18} />}
          تسجيل دخول
        </button>
      </form>
    </AuthShell>
  );
}
