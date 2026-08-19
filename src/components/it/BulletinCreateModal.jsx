import { useState } from "react";
import ItModal from "./ItModal";
import SearchableMultiSelect from "./SearchableMultiSelect";
import { Field, TextInput, SelectInput } from "./ItForm";
import { yearTypes, periodicities, generalAdmins, externalEntities } from "../../data/mockIt";

/** إنشاء نشرة — Figma 951:2388 (+ ربط الجهات 951:2689، inline combobox) */
export default function BulletinCreateModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [yearType, setYearType] = useState("ميلادية");
  const [periodicity, setPeriodicity] = useState("سنوي");
  const [admin, setAdmin] = useState("");
  const [entityIds, setEntityIds] = useState([]);

  return (
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
      <SearchableMultiSelect
        label="ربط الجهات"
        options={externalEntities}
        selected={entityIds}
        onChange={setEntityIds}
        placeholder="اختر الجهة"
      />
    </ItModal>
  );
}
