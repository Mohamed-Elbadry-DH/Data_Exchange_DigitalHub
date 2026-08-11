import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Table2, FileText, Users, Settings, LogOut, Bell,
} from "lucide-react";
import { user } from "../data/mock";

const NAV = [
  { to: "/", label: "لوحة التحكم", icon: LayoutGrid },
  { to: "/forms", label: "نماذج البيان", icon: Table2 },
  { to: "/required", label: "البيانات المطلوبة", icon: FileText },
  { to: "/users", label: "المستخدمين", icon: Users },
];

function SidebarItem({ to, label, icon: Icon, collapsed }) {
  return (
    <NavLink
      to={to}
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

export default function Layout({ children, title, breadcrumb }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" dir="rtl">
      <div className="bg-page rounded-sm shadow-2xl flex overflow-hidden" style={{ width: "1920px", height: "1215px" }}>
        {/* sidebar (right, RTL) — declared first so it lands on the right in the RTL flex row */}
        <aside
          className={`sticky top-0 self-stretch min-h-full bg-navy shrink-0 flex flex-col justify-between transition-[width] duration-300 ease-in-out overflow-hidden ${
            collapsed ? "w-[121px]" : "w-[329px]"
          }`}
        >
          <div>
            <div className={`flex items-center border-b border-white/10 py-5 transition-all duration-300 ${collapsed ? "justify-center px-0" : "justify-between px-5"}`}>
              {!collapsed && (
                <div className="text-right">
                  <div className="text-white font-bold text-[16px] whitespace-nowrap">منصة تبادل البيانات</div>
                  <div className="text-white/50 text-[12px]">Data Exchange</div>
                </div>
              )}
              <button
                onClick={() => setCollapsed((value) => !value)}
                className="w-9 h-9 rounded flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0"
                aria-label={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
                title={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
              >
                <img src="/panel-left.svg" alt="" width="25" height="25" aria-hidden="true" />
              </button>
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
            <button className={`flex items-center h-[50px] text-white/70 hover:text-white text-[14px] transition-all duration-300 ${collapsed ? "justify-center w-[97px] gap-0" : "w-full justify-start gap-3 px-9"}`} title={collapsed ? "تسجيل الخروج" : undefined} aria-label="تسجيل الخروج">
              <LogOut size={25} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">تسجيل الخروج</span>}
            </button>
          </div>
        </aside>

        {/* main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* topbar */}
          <div className="h-[74px] bg-white flex items-center justify-between px-7 shrink-0">
            <div className="text-right">
              {breadcrumb ? (
                <div className="flex items-center gap-2 text-[15px] text-muted">
                  <button onClick={() => navigate(-1)} className="hover:text-primary">{breadcrumb}</button>
                  <span>‹</span>
                  <span className="text-[rgba(0,0,0,0.9)] font-semibold">{title}</span>
                </div>
              ) : (
                <h1 className="text-[26px] font-bold text-[rgba(0,0,0,0.9)]">{title}</h1>
              )}
            </div>
            <div className="flex items-center gap-6">
              <button className="relative w-8 h-8 flex items-center justify-center text-[#404040]">
                <Bell size={22} />
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {user.notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right leading-tight">
                  <div className="font-semibold text-[15px] text-[rgba(0,0,0,0.9)]">{user.name}</div>
                  <div className="text-[13px] text-primary">{user.role}</div>
                </div>
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=e5e7eb"
                  className="w-11 h-11 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
