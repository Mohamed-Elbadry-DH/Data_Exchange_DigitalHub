import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import ItModal from "./ItModal";
import { Field } from "./ItForm";

const BOX =
  "w-full h-[55px] rounded-[9.785px] border border-[rgba(5,44,101,0.16)] bg-[#f0f0f0] pr-12 pl-11 text-[14px] text-right text-[#1f254b] placeholder:text-[#b0b6b7] outline-none focus:border-[#0986ed]";

/** Searchable combobox matching Figma 645:842 inputs. */
function ComboField({
  label,
  required,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  allowCustom = true,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const q = value.trim();
  const filtered = options.filter((o) => !q || o.includes(q));

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <Field label={label} required={required} compact>
      <div className={`relative ${disabled ? "opacity-40 pointer-events-none" : ""}`} ref={wrapRef}>
        <Search size={20} className="absolute right-[19px] top-1/2 -translate-y-1/2 text-[#b0b6b7] pointer-events-none" />
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={BOX}
        />
        <ChevronDown size={20} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#1f254b]/50 pointer-events-none" />
        {open && (filtered.length > 0 || (allowCustom && q)) && (
          <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-20 max-h-48 overflow-y-auto rounded-[12px] bg-white shadow-lg border border-[#D8D8D8] py-1">
            {filtered.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className="w-full text-right px-4 py-2 text-[14px] text-[#1f254b] hover:bg-[#f8f9fa] cursor-pointer"
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}

const KIND_OPTIONS = ["مجموعة رئيسية", "قسم فرعي"];
const COL_TYPES = ["رقم", "نص", "تاريخ"];
const COL_FORMATS = ["General/Number", "Percentage", "Text"];

export function AddGroupModal({ open, onClose, groups, onAdd, seed = null }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("");
  const [parentId, setParentId] = useState("");
  const editing = seed?.mode === "edit";

  const reset = () => {
    setName("");
    setKind("");
    setParentId("");
  };

  useEffect(() => {
    if (!open) return;
    if (seed) {
      setName(seed.label || "");
      setKind(seed.kind === "subsection" ? "قسم فرعي" : "مجموعة رئيسية");
      setParentId(seed.parentId || "");
    } else {
      reset();
    }
  }, [open, seed]);

  const isSub = kind === "قسم فرعي";

  const submit = () => {
    const label = name.trim();
    if (!label) return;
    if (isSub) {
      const parent = groups.find((g) => g.id === parentId) || groups[0];
      if (!parent) return;
      onAdd({
        kind: "subsection",
        parentId: parent.id,
        label,
        id: seed?.id,
      });
    } else {
      onAdd({ kind: "group", label, id: seed?.id });
    }
    reset();
    onClose();
  };

  return (
    <ItModal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={editing ? (isSub ? "تعديل القسم الفرعي" : "تعديل المجموعة") : "إضافة مجموعة جديدة"}
      subtitle="المجموعات تحتوي على أعمدة فرعية"
      submitLabel={editing ? "حفظ" : "إضافة"}
      width={588}
      onSubmit={submit}
    >
      <ComboField
        label="اسم المجموعة"
        required
        value={name}
        onChange={setName}
        options={[...new Set(["مصرى", "وافد", ...groups.map((g) => g.label)])]}
        placeholder="مصرى"
      />
      <ComboField
        label="تتبع لأى مجموعة"
        required
        value={kind}
        onChange={setKind}
        options={KIND_OPTIONS}
        placeholder="مجموعة رئيسية او قسم فرعي"
        allowCustom={false}
        disabled={editing}
      />
      <ComboField
        label="تتبع لأى مجموعة رئيسية"
        required
        value={groups.find((g) => g.id === parentId)?.label || ""}
        onChange={(v) => setParentId(groups.find((g) => g.label === v)?.id || "")}
        options={groups.filter((g) => g.id !== seed?.id).map((g) => g.label)}
        placeholder="مصرى"
        disabled={!isSub}
        allowCustom={false}
      />
    </ItModal>
  );
}

export function AddColumnModal({ open, onClose, groups, onAdd, seed = null }) {
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [subsectionId, setSubsectionId] = useState("");
  const [type, setType] = useState("");
  const [format, setFormat] = useState("");
  const editing = seed?.mode === "edit";

  const group = groups.find((g) => g.id === groupId);
  const subs = group?.subsections || [];

  const reset = () => {
    setName("");
    setGroupId("");
    setSubsectionId("");
    setType("");
    setFormat("");
  };

  useEffect(() => {
    if (!open) return;
    if (seed) {
      setName(seed.label || "");
      setGroupId(seed.groupId || "");
      setSubsectionId(seed.subsectionId || "");
      setType(seed.colType || "");
      setFormat(seed.format || "");
    } else {
      reset();
    }
  }, [open, seed]);

  const submit = () => {
    const label = name.trim();
    if (!label) return;
    onAdd({
      id: seed?.id,
      label,
      groupId: groupId || null,
      subsectionId: subsectionId || null,
      type: type || "رقم",
      format: format || "General/Number",
    });
    reset();
    onClose();
  };

  return (
    <ItModal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={editing ? "تعديل العمود" : "إضافة عمود جديد"}
      subtitle="أدخل بيانات العمود الجديد"
      submitLabel={editing ? "حفظ" : "إضافة"}
      width={588}
      onSubmit={submit}
    >
      <ComboField
        label="اسم العمود"
        required
        value={name}
        onChange={setName}
        options={["ذكور", "اناث"]}
        placeholder="ذكور"
      />
      <ComboField
        label="تتبع لأى مجموعة"
        required
        value={group?.label || ""}
        onChange={(v) => {
          const g = groups.find((x) => x.label === v);
          setGroupId(g?.id || "");
          setSubsectionId("");
        }}
        options={groups.map((g) => g.label)}
        placeholder="مجموعة رئيسية"
        allowCustom={false}
      />
      <ComboField
        label="تتبع لأى قسم فرعي"
        required
        value={subs.find((s) => s.id === subsectionId)?.label || ""}
        onChange={(v) => setSubsectionId(subs.find((s) => s.label === v)?.id || "")}
        options={subs.map((s) => s.label)}
        placeholder="ماجيستير"
        allowCustom={false}
      />
      <div className="grid grid-cols-2 gap-[72px]" dir="rtl">
        <ComboField
          label="نوع العمود"
          required
          value={type}
          onChange={setType}
          options={COL_TYPES}
          placeholder="رقم"
          allowCustom={false}
        />
        <ComboField
          label="التنسيق"
          required
          value={format}
          onChange={setFormat}
          options={COL_FORMATS}
          placeholder="General/Number"
          allowCustom={false}
        />
      </div>
    </ItModal>
  );
}

export function AddRowModal({ open, onClose, onAdd, seed = null }) {
  const [name, setName] = useState("");
  const editing = seed?.mode === "edit";

  useEffect(() => {
    if (!open) return;
    setName(seed?.label || "");
  }, [open, seed]);

  const submit = () => {
    const label = name.trim();
    if (!label) return;
    onAdd({ id: seed?.id, label });
    setName("");
    onClose();
  };

  return (
    <ItModal
      open={open}
      onClose={() => {
        setName("");
        onClose();
      }}
      title={editing ? "تعديل الصف" : "إضافة صف جديد"}
      subtitle="أدخل بيانات الصف بناءً على هيكل الجدول الحالي"
      submitLabel={editing ? "حفظ" : "إضافة"}
      width={588}
      onSubmit={submit}
    >
      <ComboField
        label="اسم صف / التخصص"
        required
        value={name}
        onChange={setName}
        options={["التخصص", "الطب", "الهندسة", "التربية"]}
        placeholder="التخصص"
      />
    </ItModal>
  );
}
