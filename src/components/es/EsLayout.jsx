import { LayoutDashboard, FileText, Users } from "lucide-react";
import AppShell from "../AppShell";

/**
 * مشرف الجهة الخارجية — Figma 504:2748 / 1689:1984.
 */
const NAV = [
  { to: "/es", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { to: "/es/required", label: "البيانات المطلوبة", icon: FileText },
  { to: "/es/users", label: "المستخدمين", icon: Users },
];

export default function EsLayout({ children, title, breadcrumb }) {
  return (
    <AppShell nav={NAV} title={title} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
}
