import { useState } from "react";
import { Plus, X } from "lucide-react";
import ItModal from "./ItModal";
import LinkEntitiesModal from "./LinkEntitiesModal";
import { Field, TextInput, SelectInput } from "./ItForm";
import { yearTypes, periodicities, generalAdmins } from "../../data/mockIt";

/** إنشاء نشرة — Figma 951:2388 (+ ربط الجهات 951:2689) */
export default function BulletinCreateModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [yearType, setYearType] = useState("ميلادية");
  const [periodicity, setPeriodicity] = useState("سنوي");
  const [admin, setAdmin] = useState("");
  const [entities, setEntities] = useState([]);
  const [linkOpen, setLinkOpen] = useState(false);

  return (
    <>
      <ItModal open={open} onClose={onClose} title="إنشاء نشرة" onSubmit={onClose}>
        <Field label="اسم النشرة" required>
          <TextInput value={name} onChange={setName} placeholder="اسم النشرة" />
        </Field>
        <Field label="نوع السنة" required>
          <SelectInput value={yearType} onChange={setYearType} options={yearTypes} />
        </Field>
        <Field label="الدورية" required>
          <SelectInput value={periodicity} onChange={setPeriodicity} options={periodicities} />
        </Field>
        <Field label="الإدارة التابعة" required>
          <SelectInput
            value={admin}
            onChange={setAdmin}
            options={generalAdmins.map((a) => a.name)}
            placeholder="اختر الإدارة"
          />
        </Field>
        <Field label="ربط الجهات">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setLinkOpen(true)}
              className="flex items-center gap-2 bg-[#052C65] text-white text-[14px] font-bold rounded-[12px] py-2.5 px-4 cursor-pointer self-end"
            >
              <Plus size={16} strokeWidth={2.5} />
              ربط الجهات
            </button>
            {entities.length > 0 && (
              <ul className="flex flex-wrap gap-2 justify-end">
                {entities.map((e) => (
                  <li key={e} className="flex items-center gap-2 bg-[#E3EEFF] text-[#1B75FF] rounded-full ps-4 pe-2 py-1.5 text-[14px]">
                    {e}
                    <button
                      type="button"
                      onClick={() => setEntities((s) => s.filter((x) => x !== e))}
                      aria-label={`إزالة ${e}`}
                      className="cursor-pointer hover:text-danger"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>
      </ItModal>

      <LinkEntitiesModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="ربط الجهات"
        onSubmit={(picked) => setEntities((s) => [...new Set([...s, ...picked])])}
      />
    </>
  );
}
