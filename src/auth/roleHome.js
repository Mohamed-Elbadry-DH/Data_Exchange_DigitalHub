import { demoUsers } from "../data/mock";

export const DEFAULT_HOME = "/";

/** Landing route of the module built for a role */
export function homePathForRole(role) {
  return demoUsers.find((u) => u.role === role)?.home ?? DEFAULT_HOME;
}

/** Settings route for the signed-in role's module */
export function settingsPathForRole(role) {
  const home = homePathForRole(role);
  if (!home || home === "/") return "/settings";
  return `${home.replace(/\/$/, "")}/settings`;
}
