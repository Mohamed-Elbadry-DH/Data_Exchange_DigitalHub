import { useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";
import { NOTIFICATION_TONES } from "../data/notifications";

/**
 * قائمة الإشعارات المنسدلة من جرس الشريط العلوي.
 * تُغلق بالنقر خارجها أو بمفتاح Escape.
 * على الشاشات الكبيرة تنسدل من الجرس مباشرة، وعلى الهاتف تُثبّت أسفل
 * الشريط العلوي بعرض الشاشة حتى لا تخرج من حافتها.
 */
export default function NotificationsMenu({ open, onClose, items = [], readIds = [], onMarkAll }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const unread = items.filter((n) => !readIds.includes(n.id)).length;

  return (
    <div
      ref={ref}
      dir="rtl"
      role="menu"
      aria-label="الإشعارات"
      className="fixed inset-x-4 top-[76px] z-50 max-w-[380px] sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:mt-2 sm:w-[380px] overflow-hidden rounded-[20px] border border-[rgba(18,36,67,0.1)] bg-white shadow-[0_12px_32px_rgba(5,44,101,0.18)]"
    >
      <div className="flex items-center justify-between border-b border-[rgba(18,36,67,0.1)] px-5 py-4">
        <h3 className="text-[17px] font-bold text-[#052c65]">
          الإشعارات {unread > 0 && <span className="text-[14px] font-semibold text-primary">({unread})</span>}
        </h3>
        <button
          type="button"
          onClick={onMarkAll}
          disabled={unread === 0}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0986ed] disabled:text-[#adb5bd] cursor-pointer disabled:cursor-default"
        >
          <CheckCheck size={16} />
          تعليم الكل كمقروء
        </button>
      </div>

      <ul className="max-h-[340px] overflow-y-auto">
        {items.map((n) => {
          const isRead = readIds.includes(n.id);
          return (
            <li
              key={n.id}
              className={`flex gap-3 border-b border-[rgba(18,36,67,0.08)] px-5 py-3.5 last:border-b-0 ${
                isRead ? "bg-white" : "bg-[rgba(9,134,237,0.04)]"
              }`}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: isRead ? "#CED4DA" : NOTIFICATION_TONES[n.tone] || NOTIFICATION_TONES.info }}
              />
              <div className="min-w-0 flex-1 text-right">
                <p className={`text-[14px] leading-snug ${isRead ? "font-medium text-[#495057]" : "font-semibold text-[#052c65]"}`}>
                  {n.title}
                </p>
                {n.body && <p className="mt-0.5 text-[12.5px] text-muted">{n.body}</p>}
                <p className="mt-1 text-[11.5px] text-[#adb5bd]">{n.time}</p>
              </div>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="px-5 py-8 text-center text-[14px] text-muted">لا توجد إشعارات</li>
        )}
      </ul>

      <div className="border-t border-[rgba(18,36,67,0.1)] px-5 py-3 text-center">
        <button type="button" className="text-[14px] font-bold text-[#0986ed] cursor-pointer">
          عرض كل الإشعارات
        </button>
      </div>
    </div>
  );
}
