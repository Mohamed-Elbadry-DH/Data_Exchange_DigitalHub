import { SHELL } from "../constants/shell";

/** Dashboard action row — same width/height as the first sidebar nav item. */
export default function PageToolbar({ children }) {
  return (
    <div
      className="flex w-full items-center justify-between gap-3"
      style={{ maxWidth: SHELL.contentMax, minHeight: SHELL.navItemH }}
    >
      {children}
    </div>
  );
}
