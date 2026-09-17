import { LayoutGrid, Table2, FileText } from "lucide-react";
import AppShell from "../AppShell";

const NAV = [
  { to: "/ga", label: "لوحة التحكم", icon: LayoutGrid, end: true },
  { to: "/ga/forms", label: "نماذج البيان", icon: Table2 },
  { to: "/ga/required", label: "البيانات المطلوبة", icon: FileText },
];

export default function GaLayout({ children, title, breadcrumb }) {
  return (
    <AppShell nav={NAV} title={title} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
}
