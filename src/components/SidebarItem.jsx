import { NavLink, useLocation } from "react-router-dom";
import { SHELL } from "../constants/shell";

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
      className={({ isActive }) =>
        `flex items-center rounded-[6px] text-[15px] transition-colors shrink-0 ${
          collapsed
            ? "justify-center mx-auto gap-0"
            : "justify-start mx-[33px] gap-3 px-4"
        } ${
          isActive || extraOn
            ? "bg-primary text-white font-semibold"
            : "text-white/80 hover:bg-white/10"
        }`
      }
      style={
        collapsed
          ? { height: SHELL.navItemH, width: SHELL.navItemCollapsedW }
          : { height: SHELL.navItemH, width: SHELL.navItemW }
      }
    >
      {Icon ? <Icon size={25} strokeWidth={2} className="shrink-0" /> : null}
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
}
