import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Spinner({ size = 20 }) {
  return (
    <img
      src="/spinner.png"
      alt=""
      width={size}
      height={size}
      className="animate-spin select-none"
      draggable={false}
    />
  );
}

/** Dots pattern is 666.67px wide on the 1920px design canvas */
const DOTS_RATIO = 666.67 / 1920;

export default function AuthShell({ children, width = 660.8, minHeight = 581.6, contentWidth = 478.94 }) {
  const dotsWidth = `${(DOTS_RATIO * 100).toFixed(4)}%`;
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const backToLogin = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div dir="rtl" className="h-dvh w-full overflow-auto bg-[#1b1d22] font-sans">
      <div
        style={{ background: "#F6F7F8" }}
        className="relative mx-auto flex min-h-full min-w-[1100px] w-full max-w-[1920px] items-center justify-center overflow-hidden px-6 py-10 shadow-2xl"
      >
        <img
          src="/dots.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ width: dotsWidth, opacity: 0.6 }}
          className="pointer-events-none absolute top-0 right-0 h-auto select-none"
        />
        <img
          src="/dots.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ width: dotsWidth, opacity: 0.6 }}
          className="pointer-events-none absolute bottom-0 left-0 h-auto rotate-180 select-none"
        />

        <div
          style={{
            maxWidth: width,
            minHeight,
            borderRadius: "26.67px",
            background: "#E9ECEF",
            boxShadow: "0px 5.33px 5.33px 0px #00000040",
          }}
          className="relative z-10 flex w-full flex-col justify-center gap-[35px] px-10 py-10"
        >
          <button
            type="button"
            onClick={backToLogin}
            title="العودة إلى صفحة تسجيل الدخول"
            className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
          >
            <img
              src="/auth-logo.png"
              alt="منصة تبادل البيانات"
              width={56}
              height={56}
              className="w-14 h-auto select-none"
              draggable={false}
            />
            <span className="mt-3 text-[20px] font-bold text-navy-deep">منصة تبادل البيانات</span>
            <span className="text-[13px] text-muted" dir="ltr">Data Exchange</span>
          </button>

          <div style={{ maxWidth: contentWidth }} className="w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
