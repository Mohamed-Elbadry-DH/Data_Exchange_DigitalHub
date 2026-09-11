import { useEffect, useState } from "react";
import { SHELL } from "../constants/shell";
import useMediaQuery from "../hooks/useMediaQuery";
import SidebarBrand from "./SidebarBrand";
import SidebarFooter from "./SidebarFooter";
import SidebarItem from "./SidebarItem";
import AppTopbar from "./AppTopbar";

/**
 * App frame for every role module.
 *
 * Responsive contract:
 * - ≥1280px  full sidebar (329) — the Figma width
 * - 768–1279 sidebar auto-collapses to the icon rail (121)
 * - <768px   sidebar becomes an overlay drawer, closed by default
 *
 * The frame deliberately has NO min-width: it reflows instead of forcing the
 * whole page to scroll sideways.
 */
export default function AppShell({ nav = [], title, breadcrumb, children, notifications }) {
  const isRail = useMediaQuery("(max-width: 1279px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  // `null` = follow the viewport; a boolean means the user overrode it.
  const [override, setOverride] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const collapsed = isMobile ? false : (override ?? isRail);
  const items = Array.isArray(nav) ? nav.filter((item) => item?.to && item?.label) : [];

  // Viewport changes win over a stale manual toggle.
  useEffect(() => { setOverride(null); }, [isRail]);
  useEffect(() => { if (!isMobile) setDrawerOpen(false); }, [isMobile]);

  const sidebarWidth = collapsed ? SHELL.sidebarCollapsed : SHELL.sidebarExpanded;

  /**
   * Dialogs centre on the content area rather than the window, so the sidebar
   * is never covered. `.modal-overlay` reads this; on mobile the sidebar is an
   * overlay itself, so the dialog gets the whole width back.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-sidebar-w", `${isMobile ? 0 : sidebarWidth}px`);
    return () => root.style.removeProperty("--app-sidebar-w");
  }, [isMobile, sidebarWidth]);

  const sidebar = (
    <aside
      style={{ width: sidebarWidth }}
      className={`flex h-dvh shrink-0 flex-col justify-between overflow-x-hidden overflow-y-auto bg-navy transition-[width] duration-300 ease-in-out ${
        isMobile ? "fixed inset-y-0 right-0 z-50 shadow-2xl" : "sticky top-0"
      }`}
    >
      <div>
        <SidebarBrand
          collapsed={collapsed}
          onCollapse={() => (isMobile ? setDrawerOpen(false) : setOverride(true))}
          onExpand={() => (isMobile ? setDrawerOpen(false) : setOverride(false))}
        />
        <nav
          style={{ marginTop: SHELL.pagePad, gap: SHELL.navGap }}
          className={`flex flex-col ${collapsed ? "items-center" : ""}`}
          aria-label="التنقل الرئيسي"
          onClick={() => isMobile && setDrawerOpen(false)}
        >
          {items.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>
      </div>
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );

  return (
    <div className="h-dvh w-full overflow-x-hidden overflow-y-auto bg-page" dir="rtl">
      <div className="mx-auto flex min-h-full w-full bg-page">
        {isMobile ? (
          <>
            {drawerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/45"
                  onClick={() => setDrawerOpen(false)}
                  aria-hidden="true"
                />
                {sidebar}
              </>
            )}
          </>
        ) : (
          sidebar
        )}

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <AppTopbar
            title={title}
            breadcrumb={breadcrumb}
            notifications={notifications}
            onOpenMenu={isMobile ? () => setDrawerOpen(true) : undefined}
          />
          <div className="flex-1 min-h-0 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
