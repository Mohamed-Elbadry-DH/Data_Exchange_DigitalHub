import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STAGE_ROUTE = { otp: "/verify", loading: "/loading" };

export default function RequireAuth() {
  const { stage } = useAuth();
  if (stage !== "ready") return <Navigate to={STAGE_ROUTE[stage] ?? "/login"} replace />;
  return <Outlet />;
}

/** Wraps the auth screens so a signed-in user cannot revisit them */
export function RequireStage({ stage: expected, children }) {
  const { stage } = useAuth();
  if (stage === "ready") return <Navigate to="/" replace />;
  if (stage !== expected) return <Navigate to={STAGE_ROUTE[stage] ?? "/login"} replace />;
  return children;
}
