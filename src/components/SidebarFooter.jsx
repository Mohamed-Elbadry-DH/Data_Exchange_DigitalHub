import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { settingsPathForRole } from "../auth/roleHome";
import { SHELL } from "../constants/shell";

export default function SidebarFooter({ collapsed }) {
  const navigate = useNavigate();
  const { signOut, role } = useAuth();

  const itemStyle = collapsed
    ? { height: SHELL.footerItemH, width: SHELL.navItemCollapsedW }
    : { height: SHELL.footerItemH };
  const itemClass = `flex items-center text-white/70 hover:text-white text-[14px] transition-colors ${
    collapsed ? "justify-center gap-0" : "w-full justify-start gap-3 px-9"
  }`;

  const openSettings = () => {
    navigate(settingsPathForRole(role));
  };

  const signOutAndLeave = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`flex flex-col pb-4 ${collapsed ? "items-center" : ""}`}>
      <button
        type="button"
        onClick={openSettings}
        style={itemStyle}
        className={itemClass}
        title={collapsed ? "الإعدادات" : undefined}
        aria-label="الإعدادات"
      >
        <Settings size={25} className="shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">الإعدادات</span>}
      </button>
      <button
        type="button"
        onClick={signOutAndLeave}
        style={itemStyle}
        className={itemClass}
        title={collapsed ? "تسجيل الخروج" : undefined}
        aria-label="تسجيل الخروج"
      >
        <LogOut size={25} className="shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">تسجيل الخروج</span>}
      </button>
    </div>
  );
}
