import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "mped-auth";
const CODE_LENGTH = 4;

const AuthContext = createContext(null);

function randomCode() {
  return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * 10)).join("");
}

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
      name: session?.name ?? "",
      allowed: session?.allowed ?? false,
      code: session?.code ?? "",
      signIn({ email, name, role, allowed }) {
        update({ email, name, role, allowed, stage: "otp", code: randomCode() });
      },
      issueCode() {
        const code = randomCode();
        update({ ...session, code });
        return code;
      },
      /** "invalid" | "blocked" (role flow not built yet) | "ok" */
      verifyCode(code) {
        if (!session?.code || code !== session.code) return "invalid";
        if (!session.allowed) return "blocked";
        update({ ...session, stage: "loading" });
        return "ok";
      },
      finishLoading() {
        update({ ...session, stage: "ready" });
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
