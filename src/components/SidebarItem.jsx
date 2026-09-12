import { NavLink, useLocation } from "react-router-dom";
import { SHELL } from "../constants/shell";

/**
 * Sidebar nav row — active chrome from Figma 1169:4749:
 * inset pill (Hide Bg) + 9px outer-edge bar (Hide Bg Copy).
 */
export default function SidebarItem({ to, label, icon: Icon, collapsed, end, extraActive = [] }) {
  const { pathname } = useLocation();
  if (!to || !label) return null;

  const extraOn = extraActive.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <NavLink
      to={to}
      end={Boolean(end)}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) => {
        const on = isActive || extraOn;
        if (collapsed) {
          return `relative flex items-center justify-center mx-auto rounded-[6px] text-[15px] transition-colors shrink-0 ${
            on ? "bg-primary text-white font-semibold" : "text-white/80 hover:bg-white/10"
          }`;
        }
        return `relative flex w-full items-center text-[15px] transition-colors shrink-0 ${
          on ? "text-white font-semibold" : "text-white/80"
        }`;
      }}
      style={
        collapsed
          ? { height: SHELL.navItemH, width: SHELL.navItemCollapsedW }
          : { height: SHELL.navItemH }
      }
    >
      {({ isActive }) => {
        const on = isActive || extraOn;
        return (
          <>
            {!collapsed && on && (
              <>
                {/* Hide Bg Copy — outer edge of sidebar (screen-right) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[9px] rounded-[4px] bg-primary"
                />
                {/* Hide Bg — inset pill */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-[33px] right-[33px] z-0 rounded-[6px] bg-primary"
                />
              </>
            )}
            <span
              className={`relative z-10 flex h-full items-center gap-3 ${
                collapsed
                  ? "justify-center"
                  : `mx-[33px] px-4 rounded-[6px] ${on ? "" : "hover:bg-white/10"}`
              }`}
              style={collapsed ? undefined : { width: SHELL.navItemW }}
            >
              {Icon ? <Icon size={25} strokeWidth={2} className="shrink-0" /> : null}
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}
