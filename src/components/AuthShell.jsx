import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_NAME_AR, APP_NAME_EN } from "../constants/branding";

export const AUTH_SCALE = 0.8;

export const AUTH = {
  pageWidth: 1920,
  pageHeight: 1215,
  cardWidth: 826,
  cardMinHeight: 727,
  contentWidth: 598.67,
  radius: 26.667,
  shadow: 5.333,
  gap: 60,
  fieldGap: 40,
  padX: 113.67,
  padY: 75.93,
  logoW: 100,
  logoH: 96,
  titleSize: 30,
  subtitleSize: 20,
  inputH: 82.4,
  inputRadius: 15.55,
  buttonH: 65.607,
  buttonRadius: 11.716,
  otpBox: 58,
};

/** Figma card is 826×727 on a 1920×1215 artboard (~43% × 60%).
 *  On a live screen we keep that aspect and cap at 80% of Figma so it
 *  reads as a card, not a panel: ~36% of viewport width, ~56% of height. */
const CARD_VIEW_W = 0.36;
const CARD_VIEW_H = 0.56;

function cardFitScale() {
  if (typeof window === "undefined") return AUTH_SCALE;
  return Math.min(
    AUTH_SCALE,
    (window.innerWidth * CARD_VIEW_W) / AUTH.cardWidth,
    (window.innerHeight * CARD_VIEW_H) / AUTH.cardMinHeight,
  );
}

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
  const [scale, setScale] = useState(cardFitScale);

  useEffect(() => {
    const fit = () => setScale(cardFitScale());
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const backToLogin = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div dir="rtl" className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#F6F7F8] font-sans">
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
          width: width * scale,
          height: minHeight * scale,
        }}
        className="relative z-10 shrink-0"
      >
        <div
          style={{
            width,
            minHeight,
            borderRadius: `${AUTH.radius}px`,
            background: "#E9ECEF",
            boxShadow: `0px ${AUTH.shadow}px ${AUTH.shadow}px 0px rgba(0,0,0,0.25)`,
            padding: `${AUTH.padY}px ${AUTH.padX}px`,
            gap: `${AUTH.gap}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="absolute top-0 left-0 flex flex-col items-center justify-center"
        >
          <button
            type="button"
            onClick={backToLogin}
            title="العودة إلى صفحة تسجيل الدخول"
            className="flex w-[252px] shrink-0 flex-col items-center justify-center gap-[22px] transition-opacity hover:opacity-80"
          >
            <img
              src="/auth-logo.png"
              alt={APP_NAME_AR}
              width={AUTH.logoW}
              height={AUTH.logoH}
              className="select-none object-contain"
              style={{ width: AUTH.logoW, height: AUTH.logoH }}
              draggable={false}
            />
            <span className="flex w-[252px] flex-col items-center gap-[3px] text-center">
              <span className="flex h-[40px] w-[252px] items-center justify-center text-center text-[30px] font-bold leading-none text-[#052C65]">
                {APP_NAME_AR}
              </span>
              <span
                className="mt-[4px] flex h-[24px] w-[252px] items-center justify-center text-center text-[20px] font-normal leading-none text-[#ADB5BD]"
                dir="ltr"
              >
                {APP_NAME_EN}
              </span>
            </span>
          </button>

          <div style={{ width: contentWidth, maxWidth: "100%" }} className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
