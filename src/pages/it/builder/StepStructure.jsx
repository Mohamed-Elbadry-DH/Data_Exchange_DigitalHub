import { useState } from "react";
import { GripVertical, Plus, Trash2, ChevronDown, X, SquarePen } from "lucide-react";
import { structureCounts } from "./formBuilderState";
import { AddGroupModal, AddColumnModal, AddRowModal } from "../../../components/it/StructureAddModals";

let seq = 0;
const uid = (p) => `${p}-${(seq += 1)}`;

function ToolButton({ src, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[47px] bg-[#f8f9fa] border border-[#d8d8d8] rounded-[15px] flex items-center justify-start gap-[18px] px-5 text-[16px] font-medium text-[#052c65] cursor-pointer hover:border-[#0986ed] transition-colors"
      dir="rtl"
    >
      <img src={src} alt="" className="size-6 shrink-0 object-contain" />
      {label}
    </button>
  );
}

const TH = "border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] text-[14px] px-4 py-3 font-semibold align-middle";
const THM = "border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] px-4 py-2 font-medium align-middle";

function subColsOf(columns, s) {
  return columns.filter((c) => c.subsectionId === s.id);
}
function directColsOf(columns, g) {
  return columns.filter((c) => c.groupId === g.id && !c.subsectionId);
}
function groupLeafCount(g, columns) {
  const fromSubs = g.subsections.reduce((n, s) => n + Math.max(subColsOf(columns, s).length, 1), 0);
  const direct = directColsOf(columns, g).length;
  return fromSubs + direct || 1;
}

/** Live preview: group → subsection → column (Figma 916:4005). */
function TablePreview({ structure }) {
  const { groups, columns, rows } = structure;
  const ungrouped = columns.filter((c) => !c.groupId && !c.subsectionId);
  const hasRows = rows.length > 0;
  const hasSubs = groups.some((g) => g.subsections.length > 0);
  const hasCols = columns.length > 0;
  const depth = hasSubs && hasCols ? 3 : hasSubs || hasCols ? 2 : 1;
  const cellCount = groups.reduce((n, g) => n + groupLeafCount(g, columns), 0) + ungrouped.length;

  return (
    <div className="overflow-x-auto p-6">
      <table className="border-collapse text-center text-[14px] w-full min-w-[600px]">
        <thead>
          <tr>
            {hasRows && (
              <th rowSpan={depth} className={TH}>التخصص</th>
            )}
            {groups.map((g) => (
              <th
                key={g.id}
                colSpan={groupLeafCount(g, columns)}
                rowSpan={g.subsections.length === 0 && directColsOf(columns, g).length === 0 ? depth : 1}
                className={TH}
              >
                {g.label}
              </th>
            ))}
            {ungrouped.map((c) => (
              <th key={c.id} rowSpan={depth} className={TH}>{c.label}</th>
            ))}
          </tr>

          {depth >= 2 && (
            <tr>
              {groups.map((g) => {
                const direct = directColsOf(columns, g);
                if (g.subsections.length === 0 && direct.length === 0) return null;
                return [
                  ...g.subsections.map((s) => {
                    const cols = subColsOf(columns, s);
                    return (
                      <th
                        key={s.id}
                        colSpan={Math.max(cols.length, 1)}
                        rowSpan={cols.length === 0 && depth === 3 ? 2 : 1}
                        className={THM}
                      >
                        {s.label}
                      </th>
                    );
                  }),
                  ...direct.map((c) => (
                    <th key={c.id} rowSpan={hasSubs && depth === 3 ? 2 : 1} className={THM}>
                      {c.label}
                    </th>
                  )),
                ];
              })}
            </tr>
          )}

          {depth === 3 && (
            <tr>
              {groups.flatMap((g) =>
                g.subsections.flatMap((s) => {
                  const cols = subColsOf(columns, s);
                  if (cols.length === 0) return [];
                  return cols.map((c) => (
                    <th key={c.id} className={THM}>{c.label}</th>
                  ));
                }),
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={`${THM} text-right`}>{r.label}</td>
              {Array.from({ length: cellCount }).map((_, i) => (
                <td key={i} className="border border-[#D8D8D8] px-4 py-3 text-muted">-</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const nameInput = "flex-1 min-w-0 bg-transparent text-right outline-none";

function CollapseChevron({ open, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className="text-[#052c65] cursor-pointer shrink-0"
    >
      <ChevronDown size={20} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
    </button>
  );
}

/** Step 2 — الأعمدة و المجموعات (Figma 282:185 / 916:4005) */
export default function StepStructure({ structure, onChange }) {
  const [modal, setModal] = useState(null);
  const [seed, setSeed] = useState(null);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const counts = structureCounts(structure);
  const hasAnything = counts.groups + counts.columns + counts.rows > 0;
  const isOpen = (id) => !collapsed.has(id);
  const toggle = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const expand = (id) =>
    setCollapsed((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const closeModal = () => {
    setModal(null);
    setSeed(null);
  };

  const openAdd = (type) => {
    setSeed(null);
    setModal(type);
  };

  const saveGroupFromModal = ({ kind, label, parentId, id }) => {
    if (kind === "subsection") {
      if (id) {
        onChange((s) => {
          const current = s.groups.find((g) => g.subsections.some((x) => x.id === id));
          if (current?.id === parentId) {
            return {
              ...s,
              groups: s.groups.map((g) =>
                g.id === parentId
                  ? { ...g, subsections: g.subsections.map((x) => (x.id === id ? { ...x, label } : x)) }
                  : g,
              ),
            };
          }
          return {
            ...s,
            groups: s.groups.map((g) => {
              const without = { ...g, subsections: g.subsections.filter((x) => x.id !== id) };
              if (g.id === parentId) {
                return { ...without, subsections: [...without.subsections, { id, label }] };
              }
              return without;
            }),
            columns: s.columns.map((c) => (c.subsectionId === id ? { ...c, groupId: parentId } : c)),
          };
        });
        return;
      }
      onChange((s) => ({
        ...s,
        groups: s.groups.map((g) =>
          g.id === parentId
            ? { ...g, subsections: [...g.subsections, { id: uid("s"), label }] }
            : g,
        ),
      }));
      return;
    }
    if (id) {
      onChange((s) => ({
        ...s,
        groups: s.groups.map((g) => (g.id === id ? { ...g, label } : g)),
      }));
      return;
    }
    onChange((s) => ({
      ...s,
      groups: [...s.groups, { id: uid("g"), label, subsections: [] }],
    }));
  };

  const saveColumnFromModal = (col) => {
    if (col.id) {
      onChange((s) => ({
        ...s,
        columns: s.columns.map((c) => (c.id === col.id ? { ...c, ...col } : c)),
      }));
      return;
    }
    onChange((s) => ({
      ...s,
      columns: [...s.columns, { id: uid("c"), ...col }],
    }));
  };

  const saveRowFromModal = ({ id, label }) => {
    if (id) {
      onChange((s) => ({
        ...s,
        rows: s.rows.map((r) => (r.id === id ? { ...r, label } : r)),
      }));
      return;
    }
    expand("rows");
    onChange((s) => ({ ...s, rows: [...s.rows, { id: uid("r"), label }] }));
  };

  const addRowQuick = () => {
    expand("rows");
    const n = structure.rows.length;
    onChange((s) => ({
      ...s,
      rows: [...s.rows, { id: uid("r"), label: `صف ${n + 1}` }],
    }));
  };

  const addSubsection = (gid) => {
    expand(gid);
    onChange((s) => ({
      ...s,
      groups: s.groups.map((g) =>
        g.id === gid
          ? { ...g, subsections: [...g.subsections, { id: uid("s"), label: `قسم ${g.subsections.length + 1}` }] }
          : g,
      ),
    }));
  };

  const addColumnUnder = (gid, sid) => {
    expand(gid);
    expand(sid);
    const n = structure.columns.filter((c) => c.subsectionId === sid).length;
    onChange((s) => ({
      ...s,
      columns: [
        ...s.columns,
        {
          id: uid("c"),
          label: `عمود ${n + 1}`,
          groupId: gid,
          subsectionId: sid,
          type: "رقم",
          format: "General/Number",
        },
      ],
    }));
  };

  const removeGroup = (gid) =>
    onChange((s) => ({
      ...s,
      groups: s.groups.filter((g) => g.id !== gid),
      columns: s.columns.map((c) => (c.groupId === gid ? { ...c, groupId: null } : c)),
    }));

  const removeSubsection = (gid, sid) =>
    onChange((s) => ({
      ...s,
      groups: s.groups.map((g) =>
        g.id === gid ? { ...g, subsections: g.subsections.filter((x) => x.id !== sid) } : g,
      ),
      columns: s.columns.filter((c) => c.subsectionId !== sid),
    }));

  const renameIn = (key) => (id, label) =>
    onChange((s) => ({ ...s, [key]: s[key].map((x) => (x.id === id ? { ...x, label } : x)) }));

  const renameSubsection = (gid, sid, label) =>
    onChange((s) => ({
      ...s,
      groups: s.groups.map((g) =>
        g.id === gid ? { ...g, subsections: g.subsections.map((x) => (x.id === sid ? { ...x, label } : x)) } : g,
      ),
    }));

  const setColumnGroup = (cid, groupId) =>
    onChange((s) => ({
      ...s,
      columns: s.columns.map((c) => (c.id === cid ? { ...c, groupId: groupId || null } : c)),
    }));

  const removeFrom = (key) => (id) =>
    onChange((s) => ({ ...s, [key]: s[key].filter((x) => x.id !== id) }));

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden" dir="ltr">
      <aside className="w-[320px] shrink-0 bg-[#dbe9f9] border-x border-[#d8d8d8] rounded-tr-[10px] flex flex-col min-h-0 h-full overflow-hidden">
        <div className="px-8 pt-6 shrink-0">
          <h3 className="text-[18px] font-semibold text-[#052c65] text-right">أدوات بناء الهيكل</h3>
        </div>
        <div className="px-[29px] py-6 border-b border-[#eaeaeb] shrink-0">
          <div className="flex flex-col gap-[27px] w-[262px] mx-auto">
            <ToolButton src="/it/icon-folder-plus.svg" label="إضافة مجموعة" onClick={() => openAdd("group")} />
            <ToolButton src="/it/icon-columns.svg" label="إضافة عمود" onClick={() => openAdd("column")} />
            <ToolButton src="/it/icon-rows.svg" label="إضافة صف" onClick={() => openAdd("row")} />
          </div>
        </div>

        <div className="px-6 py-5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
          <h3 className="text-[18px] font-semibold text-[#052c65] text-right mb-4">هيكل الأعمدة والمجموعات</h3>

          {!hasAnything ? (
            <div className="flex flex-col items-center gap-4 text-center pt-6 w-[240px] mx-auto">
              <span className="size-14 rounded-[14px] bg-[#f0f0f0] flex items-center justify-center overflow-hidden">
                <img src="/it/icon-folder-open-lg.svg" alt="" className="size-8 object-contain" />
              </span>
              <span className="text-[15px] font-bold text-[#052c65]">لا توجد عناصر</span>
              <span className="text-[13px] font-medium text-[#adb5bd] leading-[22px]">
                ابدأ بإضافة مجموعة أو عمود لبناء هيكل الجدول
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3" dir="rtl">
              {structure.groups.map((g) => {
                const groupOpen = isOpen(g.id);
                const directCols = structure.columns.filter((c) => c.groupId === g.id && !c.subsectionId);
                return (
                <div key={g.id} className="flex flex-col gap-2">
                  <div className="h-12 bg-[rgba(9,134,237,0.09)] border border-[#0986ed] rounded-[15px] flex items-center gap-2.5 px-3">
                    <GripVertical size={24} className="text-[#0986ed] shrink-0" />
                    <img src="/it/icon-folder-open-lg.svg" alt="" className="size-5 shrink-0 object-contain" />
                    <input
                      value={g.label}
                      onChange={(e) => renameIn("groups")(g.id, e.target.value)}
                      className={`${nameInput} text-[14px] font-semibold text-[#052c65]`}
                      aria-label="اسم المجموعة"
                    />
                    <CollapseChevron open={groupOpen} onClick={() => toggle(g.id)} label={groupOpen ? "طي المجموعة" : "فتح المجموعة"} />
                    <button type="button" onClick={() => addSubsection(g.id)} aria-label="إضافة قسم فرعي" className="text-[#0986ed] cursor-pointer">
                      <Plus size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSeed({ mode: "edit", kind: "group", id: g.id, label: g.label });
                        setModal("group");
                      }}
                      aria-label="تعديل المجموعة"
                      className="text-[#052c65] hover:text-[#0986ed] cursor-pointer"
                    >
                      <SquarePen size={18} />
                    </button>
                    <button type="button" onClick={() => removeGroup(g.id)} aria-label="حذف المجموعة" className="text-[#052c65] hover:text-danger cursor-pointer">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {groupOpen && g.subsections.map((s) => {
                    const leafs = structure.columns.filter((c) => c.subsectionId === s.id);
                    const subOpen = isOpen(s.id);
                    return (
                      <div key={s.id} className="flex flex-col gap-2 pr-6">
                        <div className="flex items-center gap-2 min-h-5">
                          <CollapseChevron open={subOpen} onClick={() => toggle(s.id)} label={subOpen ? "طي القسم" : "فتح القسم"} />
                          <input
                            value={s.label}
                            onChange={(e) => renameSubsection(g.id, s.id, e.target.value)}
                            placeholder="قسم فرعي"
                            className={`${nameInput} text-[18px] font-semibold text-[#003c93] min-h-5`}
                            aria-label="اسم القسم الفرعي"
                          />
                          <button type="button" onClick={() => addColumnUnder(g.id, s.id)} aria-label="إضافة عمود" className="text-[#0986ed] cursor-pointer">
                            <Plus size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSeed({ mode: "edit", kind: "subsection", id: s.id, label: s.label, parentId: g.id });
                              setModal("group");
                            }}
                            aria-label="تعديل القسم الفرعي"
                            className="text-[#052c65] hover:text-[#0986ed] cursor-pointer"
                          >
                            <SquarePen size={18} />
                          </button>
                          <button type="button" onClick={() => removeSubsection(g.id, s.id)} aria-label="حذف القسم" className="text-[#052c65] hover:text-danger cursor-pointer">
                            <Trash2 size={20} />
                          </button>
                        </div>
                        {subOpen && leafs.map((c) => (
                          <div key={c.id} className="flex items-center gap-2 pr-8">
                            <input
                              value={c.label}
                              onChange={(e) => renameIn("columns")(c.id, e.target.value)}
                              className={`${nameInput} text-[16px] font-medium text-[#c89637]`}
                              aria-label="اسم العمود"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSeed({
                                  mode: "edit",
                                  id: c.id,
                                  label: c.label,
                                  groupId: c.groupId || "",
                                  subsectionId: c.subsectionId || "",
                                  colType: c.type || "",
                                  format: c.format || "",
                                });
                                setModal("column");
                              }}
                              aria-label="تعديل العمود"
                              className="text-[#052c65] hover:text-[#0986ed] cursor-pointer"
                            >
                              <SquarePen size={16} />
                            </button>
                            <button type="button" onClick={() => removeFrom("columns")(c.id)} aria-label="حذف العمود" className="text-[#052c65] hover:text-danger cursor-pointer">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {groupOpen && directCols.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 pr-10">
                      <input
                        value={c.label}
                        onChange={(e) => renameIn("columns")(c.id, e.target.value)}
                        className={`${nameInput} text-[16px] font-medium text-[#c89637]`}
                        aria-label="اسم العمود"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSeed({
                            mode: "edit",
                            id: c.id,
                            label: c.label,
                            groupId: c.groupId || "",
                            subsectionId: c.subsectionId || "",
                            colType: c.type || "",
                            format: c.format || "",
                          });
                          setModal("column");
                        }}
                        aria-label="تعديل العمود"
                        className="text-[#052c65] hover:text-[#0986ed] cursor-pointer"
                      >
                        <SquarePen size={16} />
                      </button>
                      <button type="button" onClick={() => removeFrom("columns")(c.id)} aria-label="حذف العمود" className="text-[#052c65] hover:text-danger cursor-pointer">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                );
              })}

              {structure.columns.filter((c) => !c.groupId).map((c) => (
                <div key={c.id} className="bg-white rounded-[10px] border border-[#d8d8d8] p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <img src="/it/icon-columns.svg" alt="" className="size-5 shrink-0" />
                    <input
                      value={c.label}
                      onChange={(e) => renameIn("columns")(c.id, e.target.value)}
                      className={`${nameInput} text-[15px] text-[#052c65]`}
                      aria-label="اسم العمود"
                    />
                    <button type="button" onClick={() => removeFrom("columns")(c.id)} aria-label="حذف العمود" className="text-muted hover:text-danger cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  {structure.groups.length > 0 && (
                    <select
                      value={c.groupId || ""}
                      onChange={(e) => setColumnGroup(c.id, e.target.value)}
                      className="text-[13px] border border-[#d8d8d8] rounded px-2 py-1 text-[#052c65] bg-white"
                      aria-label="المجموعة التابع لها"
                    >
                      <option value="">بدون مجموعة</option>
                      {structure.groups.map((g) => (
                        <option key={g.id} value={g.id}>{g.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              {structure.rows.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 min-h-5">
                    <CollapseChevron
                      open={isOpen("rows")}
                      onClick={() => toggle("rows")}
                      label={isOpen("rows") ? "طي الصفوف" : "فتح الصفوف"}
                    />
                    <img src="/it/icon-rows.svg" alt="" className="size-5 shrink-0" />
                    <span className="flex-1 text-[18px] font-semibold text-[#052c65] text-right">الصفوف</span>
                    <button type="button" onClick={addRowQuick} aria-label="إضافة صف" className="text-[#0986ed] cursor-pointer">
                      <Plus size={20} />
                    </button>
                  </div>
                  {isOpen("rows") && structure.rows.map((r) => (
                <div key={r.id} className="bg-white rounded-[10px] border border-[#d8d8d8] p-3 flex items-center gap-2">
                  <img src="/it/icon-rows.svg" alt="" className="size-5 shrink-0" />
                  <input
                    value={r.label}
                    onChange={(e) => renameIn("rows")(r.id, e.target.value)}
                    className={`${nameInput} text-[15px] text-[#052c65]`}
                    aria-label="اسم الصف"
                  />
                  <button type="button" onClick={addRowQuick} aria-label="إضافة صف" className="text-[#0986ed] cursor-pointer">
                    <Plus size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSeed({ mode: "edit", id: r.id, label: r.label });
                      setModal("row");
                    }}
                    aria-label="تعديل الصف"
                    className="text-[#052c65] hover:text-[#0986ed] cursor-pointer"
                  >
                    <SquarePen size={18} />
                  </button>
                  <button type="button" onClick={() => removeFrom("rows")(r.id)} aria-label="حذف الصف" className="text-[#052c65] hover:text-danger cursor-pointer">
                    <Trash2 size={20} />
                  </button>
                </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0 min-h-0 overflow-auto bg-page" dir="rtl">
        {hasAnything ? (
          <TablePreview structure={structure} />
        ) : (
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center gap-4 text-center">
            <span className="size-16 rounded-[12px] bg-[#e9ecef] flex items-center justify-center overflow-hidden">
              <img src="/it/icon-table.svg" alt="" className="size-10 object-contain" />
            </span>
            <span className="text-[18px] font-bold text-[#052c65]">معاينة الجدول</span>
            <span className="text-[13px] font-medium text-[#adb5bd] max-w-[260px] leading-[22px]">
              أضف أعمدة ومجموعات من اللوحة الجانبية لرؤية معاينة الجدول
            </span>
          </div>
        )}
      </div>

      <AddGroupModal
        open={modal === "group"}
        onClose={closeModal}
        groups={structure.groups}
        seed={modal === "group" ? seed : null}
        onAdd={saveGroupFromModal}
      />
      <AddColumnModal
        open={modal === "column"}
        onClose={closeModal}
        groups={structure.groups}
        seed={modal === "column" ? seed : null}
        onAdd={saveColumnFromModal}
      />
      <AddRowModal
        open={modal === "row"}
        onClose={closeModal}
        seed={modal === "row" ? seed : null}
        onAdd={saveRowFromModal}
      />
    </div>
  );
}
