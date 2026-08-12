import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Table2, FileText, Users, Settings, LogOut, Bell,
} from "lucide-react";
import { user } from "../../data/mockGa";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/ga", label: "لوحة التحكم", icon: LayoutGrid, end: true },
  { to: "/ga/forms", label: "نماذج البيان", icon: Table2 },
  { to: "/ga/required", label: "البيانات المطلوبة", icon: FileText },
  { to: "/ga/users", label: "المستخدمين", icon: Users },
];

function SidebarItem({ to, label, icon: Icon, collapsed, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center my-1 rounded-[6px] text-[15px] transition-colors shrink-0 ${
          collapsed
            ? "justify-center mx-auto h-[50px] w-[97px] gap-0"
            : "justify-start mx-[33px] h-[50px] w-[264px] gap-3 px-4"
        } ${
          isActive
            ? "bg-primary text-white font-semibold"
            : "text-white/80 hover:bg-white/10"
        }`
      }
    >
      <Icon size={25} strokeWidth={2} className="shrink-0" />
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
}

export default function GaLayout({ children, title, breadcrumb }) {
  const navigate = useNavigate();
  const { role, name, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const signOutAndLeave = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-dvh w-full overflow-auto bg-[#1b1d22]" dir="rtl">
      <div className="min-h-full min-w-[1100px] w-full max-w-[1920px] mx-auto bg-page flex shadow-2xl">
        {/* sidebar (right, RTL) — declared first so it lands on the right in the RTL flex row */}
        <aside
          className={`sticky top-0 h-dvh bg-navy shrink-0 flex flex-col justify-between transition-[width] duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${
            collapsed ? "w-[121px]" : "w-[329px]"
          }`}
        >
          <div>
            <div className={`flex items-center border-b border-white/10 py-5 transition-all duration-300 ${collapsed ? "justify-center px-0" : "justify-between px-5 gap-3"}`}>
              {!collapsed ? (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src="/logo-mark.png" alt="" width={35} height={35} className="shrink-0" aria-hidden="true" />
                    <div className="text-right min-w-0">
                      <div className="text-white font-bold text-[16px] whitespace-nowrap">منصة تبادل البيانات</div>
                      <div className="text-white/50 text-[12px]">Data Exchange</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="w-9 h-9 rounded flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0"
                    aria-label="طي القائمة الجانبية"
                    title="طي القائمة الجانبية"
                  >
                    <img src="/panel-left.svg" alt="" width="25" height="25" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCollapsed(false)}
                  className="w-9 h-9 rounded flex items-center justify-center"
                  aria-label="توسيع القائمة الجانبية"
                  title="توسيع القائمة الجانبية"
                >
                  <img src="/logo-mark.png" alt="" width={35} height={35} aria-hidden="true" />
                </button>
              )}
            </div>
            <nav className={`mt-4 flex flex-col ${collapsed ? "items-center" : ""}`} aria-label="التنقل الرئيسي">
              {NAV.map((n) => (
                <SidebarItem key={n.to} {...n} collapsed={collapsed} />
              ))}
            </nav>
          </div>
          <div className={`pb-4 flex flex-col ${collapsed ? "items-center" : ""}`}>
            <button className={`flex items-center h-[50px] text-white/70 hover:text-white text-[14px] transition-all duration-300 ${collapsed ? "justify-center w-[97px] gap-0" : "w-full justify-start gap-3 px-9"}`} title={collapsed ? "الإعدادات" : undefined} aria-label="الإعدادات">
              <Settings size={25} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">الإعدادات</span>}
            </button>
            <button onClick={signOutAndLeave} className={`flex items-center h-[50px] text-white/70 hover:text-white text-[14px] transition-all duration-300 ${collapsed ? "justify-center w-[97px] gap-0" : "w-full justify-start gap-3 px-9"}`} title={collapsed ? "تسجيل الخروج" : undefined} aria-label="تسجيل الخروج">
              <LogOut size={25} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">تسجيل الخروج</span>}
            </button>
          </div>
        </aside>

        {/* main content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-dvh">
          {/* topbar */}
          <div className="h-[74px] bg-white flex items-center justify-between px-4 sm:px-7 shrink-0 sticky top-0 z-10">
            <div className="text-right min-w-0">
              {breadcrumb ? (
                <div className="flex items-center gap-2 text-[15px] text-muted">
                  <button onClick={() => navigate(-1)} className="hover:text-primary">{breadcrumb}</button>
                  <span>‹</span>
                  <span className="text-[rgba(0,0,0,0.9)] font-semibold truncate">{title}</span>
                </div>
              ) : (
                <h1 className="text-[22px] sm:text-[26px] font-bold text-[rgba(0,0,0,0.9)] truncate">{title}</h1>
              )}
            </div>
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <button className="relative w-8 h-8 flex items-center justify-center text-[#404040]">
                <Bell size={22} />
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {user.notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right leading-tight hidden sm:block">
                  <div className="font-semibold text-[15px] text-[rgba(0,0,0,0.9)]">{name || user.name}</div>
                  <div className="text-[13px] text-primary">{role || user.role}</div>
                </div>
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=e5e7eb"
                  className="w-11 h-11 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
