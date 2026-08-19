import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SHELL, avatarSeed, notificationCount } from "../constants/shell";

export default function AppTopbar({ title, breadcrumb, notifications = SHELL.defaultNotifications }) {
  const navigate = useNavigate();
  const { name, role } = useAuth();
  const displayName = name || "";
  const displayRole = role || "";
  const count = notificationCount(notifications);
  const seed = encodeURIComponent(avatarSeed(displayName));

  return (
    <div
      style={{ height: SHELL.headerHeight, paddingInline: SHELL.topbarPadX }}
      className="flex shrink-0 items-center justify-between bg-white sticky top-0 z-10"
    >
      <div className="shrink-0 text-right">
        {breadcrumb ? (
          <div className="flex items-center gap-2 text-[15px] text-muted">
            <button type="button" onClick={() => navigate(-1)} className="hover:text-primary">
              {breadcrumb}
            </button>
            <span>‹</span>
            <span className="whitespace-nowrap font-semibold text-[rgba(0,0,0,0.9)]">{title}</span>
          </div>
        ) : (
          <h1
            style={{ fontSize: SHELL.titleSize }}
            className="whitespace-nowrap font-bold leading-none text-[rgba(0,0,0,0.9)]"
          >
            {title}
          </h1>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center text-[#404040]"
          aria-label="الإشعارات"
        >
          <Bell size={22} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-[15px] font-semibold text-[rgba(0,0,0,0.9)]">{displayName}</div>
            <div className="text-[13px] text-primary">{displayRole}</div>
          </div>
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=e5e7eb`}
            style={{ width: SHELL.avatarSize, height: SHELL.avatarSize }}
            className="rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
