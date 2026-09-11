import { LayoutGrid, Table2, FileText, Users } from "lucide-react";
import AppShell from "./AppShell";

const NAV = [
  { to: "/", label: "لوحة التحكم", icon: LayoutGrid, end: true },
  { to: "/forms", label: "نماذج البيان", icon: Table2 },
  { to: "/required", label: "البيانات المطلوبة", icon: FileText },
  { to: "/users", label: "المستخدمين", icon: Users },
];

export default function Layout({ children, title, breadcrumb }) {
  return (
    <AppShell nav={NAV} title={title} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
}
