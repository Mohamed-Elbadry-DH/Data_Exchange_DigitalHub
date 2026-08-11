import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "mped-auth";

/** Mock verification code from the design spec */
export const DEMO_CODE = "2239";

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.stage) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const value = useMemo(() => {
    const update = (next) => {
      setSession(next);
      writeSession(next);
    };

    return {
      session,
      stage: session?.stage ?? null,
      email: session?.email ?? "",
      role: session?.role ?? "",
      signIn(email) {
        update({ email, stage: "otp", role: "" });
      },
      verifyCode(code) {
        if (code !== DEMO_CODE) return false;
        update({ ...session, stage: "role" });
        return true;
      },
      resendCode() {
        return DEMO_CODE;
      },
      chooseRole(role) {
        update({ ...session, role, stage: "ready" });
      },
      signOut() {
        update(null);
      },
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
