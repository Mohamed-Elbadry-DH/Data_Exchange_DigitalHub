import { useState } from "react";
import { Search } from "lucide-react";
import ItModal from "./ItModal";
import { externalEntities } from "../../data/mockIt";

/** ربط جهة خارجية — Figma 916:4474 */
export default function LinkEntitiesModal({ open, onClose, title = "ربط جهة خارجية", onSubmit }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const rows = externalEntities.filter((e) => !search.trim() || e.name.includes(search.trim()) || e.type.includes(search.trim()));

  const submit = () => {
    onSubmit?.(selected);
    setSelected([]);
    onClose();
  };

  const close = () => {
    setSelected([]);
    onClose();
  };

  return (
    <ItModal
      open={open}
      onClose={close}
      title={title}
      width={588}
      splitFooter
      onSubmit={submit}
      submitLabel={`ربط المختار (${selected.length})`}
    >
      <div className="relative">
        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث"
          className="w-full h-[46px] rounded-[10px] bg-white pr-11 pl-5 text-[16px] text-right text-[#1f254b] placeholder:text-black/30 outline-none"
        />
      </div>

      <ul className="flex flex-col gap-[35px]">
        {rows.map((e) => {
          const on = selected.includes(e.id);
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => toggle(e.id)}
                aria-pressed={on}
                className="w-full h-[79px] bg-transparent rounded-[20px] border border-[#3498db] px-5 flex items-center gap-4 text-right cursor-pointer"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-[17px] font-bold text-[#052c65] truncate">{e.name}</span>
                  <span className="block text-[17px] font-normal text-[#052c65]/40">{e.type}</span>
                </span>
                <span className="size-[25px] shrink-0 overflow-clip">
                  <img src={on ? "/it/icon-square-check.svg" : "/it/icon-square.svg"} alt="" className="size-full" />
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
