import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Field, CONTROL } from "./ItForm";

/**
 * Inline searchable multi-select with removable chips — Figma node 631:6731.
 * `options` is an array of `{ id, name }`; `selected`/`onChange` work with ids.
 */
export default function SearchableMultiSelect({
  label,
  required,
  options,
  selected,
  onChange,
  placeholder = "بحث",
  hint,
  hintIcon = false,
  multiple = true,
  disabled = false,
  showSearch = true,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selectedItems = options.filter((o) => selected.includes(o.id));
  const filtered = options.filter(
    (o) => !selected.includes(o.id) && o.name.includes(search.trim())
  );

  const pick = (id) => {
    onChange(multiple ? [...selected, id] : [id]);
    setSearch("");
    if (!multiple) setOpen(false);
  };

  const remove = (id) => onChange(selected.filter((x) => x !== id));

  const inputValue =
    !open && !multiple && selectedItems[0] && !search ? selectedItems[0].name : search;

  return (
    <Field label={label} required={required} hint={hint} hintIcon={hintIcon}>
      <div className={`relative ${disabled ? "pointer-events-none opacity-60" : ""}`} ref={wrapRef}>
        {showSearch && (
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1f254b]/40 pointer-events-none" />
        )}
        <input
          value={inputValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`${CONTROL} pl-11 ${showSearch ? "pr-12" : ""}`}
        />
        <ChevronDown
          size={20}
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#1f254b]/50 pointer-events-none transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
        {open && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+8px)] right-0 left-0 z-20 max-h-64 overflow-y-auto rounded-[12px] bg-white shadow-lg border border-[#D8D8D8] py-1"
          >
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="option"
                  onClick={() => pick(o.id)}
                  className="w-full text-right px-4 py-2.5 text-[15px] text-[#052c65] hover:bg-[rgba(9,134,237,0.09)] cursor-pointer"
                >
                  {o.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-2.5 text-[14px] text-muted text-right">لا توجد نتائج</p>
            )}
          </div>
        )}
      </div>

      {multiple && selectedItems.length > 0 && (
        <ul className="flex flex-wrap gap-3" dir="rtl">
          {selectedItems.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between gap-3 bg-[#e9ecef] rounded-[20px] h-[43px] px-[17px] text-[#052c65] text-[14px] font-semibold"
            >
              {o.name}
              <button
                type="button"
                onClick={() => remove(o.id)}
                aria-label={`إزالة ${o.name}`}
                className="cursor-pointer hover:text-danger shrink-0"
              >
                <X size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
