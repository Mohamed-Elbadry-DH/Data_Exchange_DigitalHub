import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homePathForRole } from "../auth/roleHome";

const STAGE_ROUTE = { otp: "/verify", loading: "/loading" };

/** `allow` limits a route group to specific roles; others land on their own module */
export default function RequireAuth({ allow }) {
  const { stage, role } = useAuth();
  if (stage !== "ready") return <Navigate to={STAGE_ROUTE[stage] ?? "/login"} replace />;
  if (allow && !allow.includes(role)) return <Navigate to={homePathForRole(role)} replace />;
  return <Outlet />;
}

/** Wraps the auth screens so a signed-in user cannot revisit them */
export function RequireStage({ stage: expected, children }) {
  const { stage, role } = useAuth();
  if (stage === "ready") return <Navigate to={homePathForRole(role)} replace />;
  if (stage !== expected) return <Navigate to={STAGE_ROUTE[stage] ?? "/login"} replace />;
  return children;
}
