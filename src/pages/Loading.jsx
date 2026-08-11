import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell, { Spinner } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { homePathForRole } from "../auth/roleHome";

const DURATION = 3000;

export default function Loading() {
  const { finishLoading, name, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      finishLoading();
      navigate(homePathForRole(role), { replace: true });
    }, DURATION);
    return () => clearTimeout(t);
  }, [finishLoading, navigate, role]);

  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-6">
        <Spinner size={72} />
        <div className="text-center">
          <div className="text-[18px] font-bold text-navy-deep">جارٍ تحضير لوحة التحكم…</div>
          <div className="mt-2 text-[14px] text-muted">
            {name} — {role}
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
