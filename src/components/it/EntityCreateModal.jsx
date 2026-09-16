import { useState } from "react";
import ItModal from "./ItModal";
import { Field, TextInput, SelectInput, TextArea, CheckboxGroup } from "./ItForm";
import { entityTypes, entityPermissions } from "../../data/mockIt";

/** إنشاء جهة خارجية — Figma 1049:911 */
export default function EntityCreateModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);

  return (
    <ItModal open={open} onClose={onClose} title="إنشاء جهة خارجية" onSubmit={onClose}>
      <Field label="اسم الجهة" required>
        <TextInput value={name} onChange={setName} placeholder="اسم الجهة" />
      </Field>
      <Field label="نوع الجهة" required>
        <SelectInput value={type} onChange={setType} options={entityTypes} placeholder="النوع" />
      </Field>
      <Field label="وصف الجهة">
        <TextArea value={description} onChange={setDescription} placeholder="اكتب وصف مختصر عن الجهة" rows={5} />
      </Field>
      <Field label="الصلاحيات" required>
        <CheckboxGroup
          options={entityPermissions}
          selected={permissions}
          onToggle={(p) =>
            setPermissions((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))
          }
        />
      </Field>
    </ItModal>
  );
}
