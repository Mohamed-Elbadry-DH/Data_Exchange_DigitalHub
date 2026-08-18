import { useState } from "react";
import { SHELL } from "../constants/shell";
import SidebarBrand from "./SidebarBrand";
import SidebarFooter from "./SidebarFooter";
import SidebarItem from "./SidebarItem";
import AppTopbar from "./AppTopbar";

export default function AppShell({ nav = [], title, breadcrumb, children, notifications }) {
  const [collapsed, setCollapsed] = useState(false);
  const items = Array.isArray(nav) ? nav.filter((item) => item?.to && item?.label) : [];

  return (
    <div className="h-dvh w-full overflow-auto bg-[#1b1d22]" dir="rtl">
      <div
        style={{ minWidth: SHELL.frameMin, maxWidth: SHELL.frameMax }}
        className="mx-auto flex min-h-full w-full bg-page shadow-2xl"
      >
        <aside
          style={{ width: collapsed ? SHELL.sidebarCollapsed : SHELL.sidebarExpanded }}
          className="sticky top-0 flex h-dvh shrink-0 flex-col justify-between overflow-x-hidden overflow-y-auto bg-navy transition-[width] duration-300 ease-in-out"
        >
          <div>
            <SidebarBrand
              collapsed={collapsed}
              onCollapse={() => setCollapsed(true)}
              onExpand={() => setCollapsed(false)}
            />
            <nav
              style={{ marginTop: SHELL.pagePad, gap: SHELL.navGap }}
              className={`flex flex-col ${collapsed ? "items-center" : ""}`}
              aria-label="التنقل الرئيسي"
            >
              {items.map((item) => (
                <SidebarItem key={item.to} {...item} collapsed={collapsed} />
              ))}
            </nav>
          </div>
          <SidebarFooter collapsed={collapsed} />
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <AppTopbar title={title} breadcrumb={breadcrumb} notifications={notifications} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
