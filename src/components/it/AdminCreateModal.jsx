import { useState } from "react";
import ItModal from "./ItModal";
import SearchableMultiSelect from "./SearchableMultiSelect";
import { Field, TextInput, TextArea, CheckboxGroup } from "./ItForm";
import { adminPermissions, externalEntities } from "../../data/mockIt";

/** إنشاء إدارة جديدة — Figma 1955:7129 */
export default function AdminCreateModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [entityIds, setEntityIds] = useState([]);

  const togglePermission = (p) =>
    setPermissions((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <ItModal open={open} onClose={onClose} title="إنشاء إدارة جديدة" onSubmit={onClose}>
      <Field label="اسم الإدارة العامة" required>
        <TextInput value={name} onChange={setName} placeholder="اسم الجهة" />
      </Field>
      <SearchableMultiSelect
        label="ربط الجهات"
        options={externalEntities}
        selected={entityIds}
        onChange={setEntityIds}
        placeholder="اختر الجهة"
      />
      <Field label="وصف الإدارة">
        <TextArea
          value={description}
          onChange={setDescription}
          placeholder="أدخل وصف الإدارة العامة و أهدافها و اختصاصتها"
          className="h-[154px]"
        />
      </Field>
      <Field label="الصلاحيات" required>
        <CheckboxGroup
          columns={3}
          options={adminPermissions}
          selected={permissions}
          onToggle={togglePermission}
        />
      </Field>
    </ItModal>
  );
}
