import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SHELL, avatarSeed, notificationCount } from "../constants/shell";
import NotificationsMenu from "./NotificationsMenu";
import { notifications as notificationItems } from "../data/notifications";

/** `onOpenMenu` is supplied only on mobile, where the sidebar is a drawer. */
export default function AppTopbar({ title, breadcrumb, notifications = SHELL.defaultNotifications, onOpenMenu }) {
  const navigate = useNavigate();
  const { name, role } = useAuth();
  const displayName = name || "";
  const displayRole = role || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);
  // العدد على الجرس يتبع غير المقروء، ويبدأ من العدد الممرّر للشريط.
  const unread = notificationItems.filter((n) => !readIds.includes(n.id)).length;
  const count = notificationCount(Math.min(unread, notifications));
  const seed = encodeURIComponent(avatarSeed(displayName));

  return (
    <div
      style={{ height: SHELL.headerHeight }}
      className="flex shrink-0 items-center justify-between gap-3 bg-white sticky top-0 z-10 px-4 sm:px-6 xl:px-7"
    >
      <div className="flex min-w-0 items-center gap-3 text-right">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="فتح القائمة"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#052c65] hover:bg-page cursor-pointer"
          >
            <Menu size={22} />
          </button>
        )}
        {breadcrumb ? (
          <div className="flex items-center gap-2 text-[15px] text-muted">
            <button type="button" onClick={() => navigate(-1)} className="hover:text-primary">
              {breadcrumb}
            </button>
            <span>‹</span>
            <span className="whitespace-nowrap font-semibold text-[rgba(0,0,0,0.9)]">{title}</span>
          </div>
        ) : (
          <h1 className="truncate py-1 font-bold leading-[1.4] text-[rgba(0,0,0,0.9)] text-[18px] sm:text-[22px] xl:text-[26px]">
            {title}
          </h1>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative flex h-8 w-8 items-center justify-center text-[#404040] hover:text-primary cursor-pointer"
            aria-label="الإشعارات"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <Bell size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <NotificationsMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={notificationItems}
            readIds={readIds}
            onMarkAll={() => setReadIds(notificationItems.map((n) => n.id))}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
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
