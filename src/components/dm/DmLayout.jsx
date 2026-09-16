import { LayoutDashboard } from "lucide-react";
import AppShell from "../AppShell";

const NAV = [
  { to: "/dm", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
];

export default function DmLayout({ children, title, breadcrumb }) {
  return (
    <AppShell nav={NAV} title={title} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
}
