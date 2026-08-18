import { useState } from "react";
import { Search, SquareCheck, Square } from "lucide-react";
import ItModal from "./ItModal";
import { externalEntities } from "../../data/mockIt";

/** ربط جهة خارجية — search + multi-select list (Figma 916:4474 / 951:2689) */
export default function LinkEntitiesModal({ open, onClose, title = "ربط جهة خارجية", onSubmit }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const toggle = (name) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const rows = externalEntities.filter((e) => !search.trim() || e.name.includes(search.trim()));

  const submit = () => {
    onSubmit?.(selected);
    onClose();
  };

  return (
    <ItModal open={open} onClose={onClose} title={title} onSubmit={submit} submitLabel="ربط">
      <div className="relative">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1f254b]/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث"
          className="w-full h-[55px] rounded-[10px] border border-[rgba(5,44,101,0.16)] bg-white pr-12 pl-5 text-[18px] text-right text-[#1f254b] placeholder:text-[#1f254b]/30 outline-none focus:border-[#0986ed]"
        />
      </div>

      <ul className="flex flex-col gap-3">
        {rows.map((e) => {
          const on = selected.includes(e.name);
          const Icon = on ? SquareCheck : Square;
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => toggle(e.name)}
                aria-pressed={on}
                className="w-full bg-white rounded-[10px] border border-[rgba(5,44,101,0.16)] px-5 py-4 flex items-center gap-4 text-right cursor-pointer hover:border-[#0986ed] transition-colors"
              >
                <Icon size={25} className={on ? "text-[#0986ed]" : "text-[#1f254b]/40"} />
                <span className="flex-1">
                  <span className="block text-[18px] text-[#1f254b]">{e.name}</span>
                  <span className="block text-[14px] text-muted">{e.type}</span>
                </span>
              </button>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="text-center text-muted text-[16px] py-6">لا توجد جهات مطابقة</li>
        )}
      </ul>
    </ItModal>
  );
}
