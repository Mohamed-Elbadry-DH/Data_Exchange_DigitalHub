import {
  LayoutDashboard, Building2, Building, ScrollText, Users, Clock, NotepadText,
} from "lucide-react";
import AppShell from "../AppShell";

const NAV = [
  { to: "/it", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { to: "/it/entities", label: "الجهات الخارجية", icon: Building2 },
  { to: "/it/admins", label: "الإدارات العامة", icon: Building },
  { to: "/it/bulletins", label: "النشرات", icon: ScrollText },
  { to: "/it/users", label: "المستخدمين", icon: Users },
  { to: "/it/activity", label: "سجل النشاط", icon: Clock },
  { to: "/it/requests", label: "الطلبات", icon: NotepadText },
];

export default function ItLayout({ children, title, breadcrumb }) {
  return (
    <AppShell nav={NAV} title={title} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
}
