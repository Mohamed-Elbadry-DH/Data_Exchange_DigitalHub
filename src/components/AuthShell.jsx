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

export default function AuthShell({ children, width = 826, minHeight = 727, contentWidth = 598.67 }) {
  return (
    <div
      dir="rtl"
      style={{ background: "#F6F7F8" }}
      className="relative h-full min-h-dvh w-full overflow-y-auto overflow-x-hidden font-sans"
    >
      <img
        src="/dots.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ width: "666.67px", height: "569.81px", opacity: 0.6 }}
        className="pointer-events-none absolute top-0 right-0 select-none"
      />
      <img
        src="/dots.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ width: "666.67px", height: "569.81px", opacity: 0.6 }}
        className="pointer-events-none absolute bottom-0 left-0 rotate-180 select-none"
      />

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-10">
        <div
          style={{
            maxWidth: width,
            minHeight,
            borderRadius: "26.67px",
            background: "#E9ECEF",
            boxShadow: "0px 5.33px 5.33px 0px #00000040",
          }}
          className="flex w-full flex-col justify-center gap-[35px] px-10 py-10"
        >
          <div className="flex flex-col items-center gap-1">
            <img
              src="/auth-logo.png"
              alt="منصة تبادل البيانات"
              width={56}
              height={56}
              className="w-14 h-auto select-none"
              draggable={false}
            />
            <div className="mt-3 text-[20px] font-bold text-navy-deep">منصة تبادل البيانات</div>
            <div className="text-[13px] text-muted" dir="ltr">Data Exchange</div>
          </div>

          <div style={{ maxWidth: contentWidth }} className="w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
