import { LayoutDashboard, FileText } from "lucide-react";
import AppShell from "../AppShell";

/**
 * موظف الجهة الخارجية — Figma 1702:7443.
 * The design's sidebar also lists «المستخدمين», but no screen was supplied for
 * it in this batch, so it is left out rather than shipped as a dead link.
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
