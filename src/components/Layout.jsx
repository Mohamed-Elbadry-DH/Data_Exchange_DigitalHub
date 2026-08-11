import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Table2, FileText, Users, Settings, LogOut, Bell, BookOpen,
} from "lucide-react";
import { user } from "../data/mock";

const NAV = [
  { to: "/", label: "لوحة التحكم", icon: LayoutGrid },
  { to: "/forms", label: "نماذج البيان", icon: Table2 },
  { to: "/required", label: "البيانات المطلوبة", icon: FileText },
  { to: "/users", label: "المستخدمين", icon: Users },
];

function SidebarItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between gap-3 mx-3 my-1 rounded-lg px-4 py-3 text-[15px] transition-colors ${
          isActive
            ? "bg-primary text-white font-semibold"
            : "text-white/80 hover:bg-white/10"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-3">
            <Icon size={19} strokeWidth={2} />
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default function Layout({ children, title, breadcrumb }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-page flex justify-center py-6 px-2" dir="rtl">
      <div className="w-full max-w-[1920px] bg-page rounded-sm shadow-2xl flex overflow-hidden" style={{ minHeight: 860 }}>
        {/* main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* topbar */}
          <div className="h-[74px] bg-white flex items-center justify-between px-7 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=e5e7eb"
                  className="w-11 h-11 rounded-full"
                  alt="avatar"
                />
                <div className="text-right leading-tight">
                  <div className="font-semibold text-[15px] text-[rgba(0,0,0,0.9)]">{user.name}</div>
                  <div className="text-[13px] text-primary">{user.role}</div>
                </div>
              </div>
              <button className="relative w-8 h-8 flex items-center justify-center text-[#404040]">
                <Bell size={22} />
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {user.notifications}
                  </span>
                )}
              </button>
            </div>
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
          </div>

          <div className="flex-1 overflow-auto">{children}</div>
        </div>

        {/* sidebar (right, RTL) */}
        <div className="w-[330px] bg-navy shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="text-right">
                <div className="text-white font-bold text-[16px]">منصة تبادل البيانات</div>
                <div className="text-white/50 text-[12px]">Data Exchange</div>
              </div>
              <div className="w-9 h-9 rounded bg-warning-2 flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
            </div>
            <nav className="mt-4">
              {NAV.map((n) => (
                <SidebarItem key={n.to} {...n} />
              ))}
            </nav>
          </div>
          <div className="pb-4">
            <button className="w-full flex items-center gap-3 px-9 py-3 text-white/70 hover:text-white text-[14px]">
              <Settings size={18} /> الإعدادات
            </button>
            <button className="w-full flex items-center gap-3 px-9 py-3 text-white/70 hover:text-white text-[14px]">
              <LogOut size={18} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
