import { APP_NAME_AR, APP_NAME_EN } from "../constants/branding";
import { SHELL } from "../constants/shell";

export default function SidebarBrand({ collapsed, onCollapse, onExpand }) {
  return (
    <div
      style={{ height: SHELL.headerHeight }}
      className={`flex items-center border-b border-white/10 transition-all duration-300 ${
        collapsed ? "justify-center px-0" : "justify-between px-5"
      }`}
    >
      {!collapsed ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <img
              src="/logo-mark.png"
              alt=""
              width={SHELL.logoW}
              height={SHELL.logoH}
              style={{ width: SHELL.logoW, height: SHELL.logoH }}
              className="shrink-0 object-contain"
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-col items-start justify-center" dir="ltr">
              <span dir="rtl" className="whitespace-nowrap text-[20px] font-bold leading-none text-[#F8F9FA]">
                {APP_NAME_AR}
              </span>
              <span className="mt-[5px] whitespace-nowrap text-[15px] font-light leading-none text-[#E9ECEF]">
                {APP_NAME_EN}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={typeof onCollapse === "function" ? onCollapse : undefined}
            style={{ width: SHELL.collapseSize, height: SHELL.collapseSize }}
            className="flex shrink-0 items-center justify-center rounded text-white/70 transition-colors hover:text-white"
            aria-label="طي القائمة الجانبية"
            title="طي القائمة الجانبية"
          >
            <img
              src="/panel-left.svg"
              alt=""
              width={SHELL.panelIcon}
              height={SHELL.panelIcon}
              style={{ width: SHELL.panelIcon, height: SHELL.panelIcon }}
              aria-hidden="true"
            />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={typeof onExpand === "function" ? onExpand : undefined}
          style={{ width: SHELL.logoW, height: SHELL.collapseSize }}
          className="flex items-center justify-center"
          aria-label="توسيع القائمة الجانبية"
          title="توسيع القائمة الجانبية"
        >
          <img
            src="/logo-mark.png"
            alt=""
            width={SHELL.logoW}
            height={SHELL.logoH}
            style={{ width: SHELL.logoW, height: SHELL.logoH }}
            className="object-contain"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
