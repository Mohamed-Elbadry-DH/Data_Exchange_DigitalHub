import { useNavigate } from "react-router-dom";
import {
  Building2, ClipboardCheck, Send, UserCheck, Target, Settings,
} from "lucide-react";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { roles } from "../data/mock";

const ICONS = { Building2, ClipboardCheck, Send, UserCheck, Target, Settings };

function RoleCard({ role, onChoose }) {
  const Icon = ICONS[role.icon] ?? Building2;
  return (
    <div className="flex flex-col rounded-2xl border border-[#D8D8D8] bg-white p-6 text-right">
      <div className="flex items-center gap-3">
        <span
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px]"
          style={{ background: "#2563EB4D" }}
        >
          <Icon size={26} className="text-navy-deep" />
        </span>
        <h2 className="text-[17px] font-bold text-navy-deep">{role.name}</h2>
      </div>

      <div className="mt-5 text-[14px] font-semibold text-ink">المسؤوليات الرئيسية:</div>
      <ul className="mt-2 flex flex-1 flex-col gap-2">
        {role.responsibilities.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[14px] text-muted">
            <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onChoose(role)}
        className="mt-6 h-[46px] w-full rounded-lg bg-navy-deep text-[15px] font-semibold text-white transition-opacity hover:opacity-95"
      >
        اختر هذا الدور
      </button>
    </div>
  );
}

export default function SelectRole() {
  const { chooseRole } = useAuth();
  const navigate = useNavigate();

  const choose = (role) => {
    chooseRole(role.name);
    navigate("/");
  };

  return (
    <AuthShell width={980} contentWidth="100%">
      <p className="text-center text-[15px] text-ink">اختر الدور الذي تريد الدخول به</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} onChoose={choose} />
        ))}
      </div>
    </AuthShell>
  );
}
