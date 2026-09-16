/** Shared app chrome sizes — used by every role layout. */
export const SHELL = {
  frameMin: 1100,
  frameMax: 1920,
  sidebarExpanded: 329,
  sidebarCollapsed: 121,
  headerHeight: 88,
  topbarPadX: 28,
  titleSize: 26,
  avatarSize: 44,
  logoW: 44,
  logoH: 42,
  collapseSize: 42,
  panelIcon: 25,
  navItemH: 50,
  navItemW: 264,
  navItemCollapsedW: 97,
  footerItemH: 50,
  pagePad: 32,
  navGap: 8,
  contentMax: 1535.5,
  defaultNotifications: 6,
};

export function avatarSeed(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function notificationCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(99, Math.floor(n));
}
