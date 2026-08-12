import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Auth chrome scaled to 80% of the accepted baseline */
export const AUTH_SCALE = 0.8;

export const AUTH = {
  cardWidth: 660.8 * AUTH_SCALE,
  cardMinHeight: 581.6 * AUTH_SCALE,
  contentWidth: 478.94 * AUTH_SCALE,
  radius: 26.67 * AUTH_SCALE,
  shadow: 5.33 * AUTH_SCALE,
  gap: 35 * AUTH_SCALE,
  pad: 40 * AUTH_SCALE,
  logo: 56 * AUTH_SCALE,
  titleSize: 20 * AUTH_SCALE,
  subtitleSize: 13 * AUTH_SCALE,
  inputH: 52 * AUTH_SCALE,
  buttonH: 65.61 * AUTH_SCALE,
  buttonRadius: 11.72 * AUTH_SCALE,
  otpBox: 58 * AUTH_SCALE,
};

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

export default function AuthShell({
  children,
  width = AUTH.cardWidth,
  minHeight = AUTH.cardMinHeight,
  contentWidth = AUTH.contentWidth,
}) {
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
            borderRadius: `${AUTH.radius}px`,
            background: "#E9ECEF",
            boxShadow: `0px ${AUTH.shadow}px ${AUTH.shadow}px 0px #00000040`,
            padding: `${AUTH.pad}px`,
            gap: `${AUTH.gap}px`,
          }}
          className="relative z-10 flex w-full flex-col justify-center"
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
              width={AUTH.logo}
              height={AUTH.logo}
              className="h-auto select-none"
              style={{ width: AUTH.logo, height: AUTH.logo }}
              draggable={false}
            />
            <span
              className="mt-2.5 font-bold text-navy-deep"
              style={{ fontSize: `${AUTH.titleSize}px` }}
            >
              منصة تبادل البيانات
            </span>
            <span className="text-muted" dir="ltr" style={{ fontSize: `${AUTH.subtitleSize}px` }}>
              Data Exchange
            </span>
          </button>

          <div style={{ maxWidth: contentWidth }} className="w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
