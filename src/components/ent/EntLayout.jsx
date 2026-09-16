import { LayoutDashboard, FileText } from "lucide-react";
import AppShell from "../AppShell";

/**
 * موظف الجهة الخارجية — Figma 1702:7443.
 * «المستخدمين» appears in the Figma sidebar but is intentionally out of this
 * product flow — never add a /ent/users route or nav item.
 */
const NAV = [
  { to: "/ent", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { to: "/ent/required", label: "البيانات المطلوبة", icon: FileText },
];

export default function EntLayout({ children, title, breadcrumb }) {
  return (
    <AppShell nav={NAV} title={title} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
}
