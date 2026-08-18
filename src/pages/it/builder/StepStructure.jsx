import {
  FolderPlus, Columns2, Rows2, FolderOpen, TableCellsMerge, X, Plus,
} from "lucide-react";
import { structureCounts } from "./formBuilderState";

let seq = 0;
const uid = (p) => `${p}-${(seq += 1)}`;

function ToolButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[47px] bg-[#f8f9fa] border border-[#d8d8d8] rounded-[15px] flex items-center justify-between px-5 text-[16px] text-[#052c65] cursor-pointer hover:border-[#0986ed] transition-colors"
    >
      <Icon size={24} />
      {label}
    </button>
  );
}

/** Live preview of the table being assembled from groups / columns / rows. */
function TablePreview({ structure }) {
  const { groups, columns, rows } = structure;
  const ungrouped = columns.filter((c) => !c.groupId);
  const groupCols = (gid) => columns.filter((c) => c.groupId === gid);

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-center text-[14px] w-full min-w-[600px]">
        <thead>
          <tr>
            <th rowSpan={2} className="border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] px-4 py-3 font-semibold align-middle">
              البند
            </th>
            {groups.map((g) => {
              const span = groupCols(g.id).length || g.subsections.length || 1;
              return (
                <th key={g.id} colSpan={span} className="border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] px-4 py-3 font-semibold">
                  {g.label}
                </th>
              );
            })}
            {ungrouped.map((c) => (
              <th key={c.id} rowSpan={2} className="border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] px-4 py-3 font-semibold align-middle">
                {c.label}
              </th>
            ))}
          </tr>
          <tr>
            {groups.map((g) => {
              const cols = groupCols(g.id);
              const cells = cols.length ? cols.map((c) => c.label) : g.subsections.map((s) => s.label);
              if (cells.length === 0) return <th key={g.id} className="border border-[#D8D8D8] bg-[#DDEBF4] px-4 py-2" />;
              return cells.map((label, i) => (
                <th key={`${g.id}-${i}`} className="border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] px-4 py-2 font-medium">
                  {label}
                </th>
              ));
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const cellCount =
              groups.reduce((s, g) => s + (groupCols(g.id).length || g.subsections.length || 1), 0)
              + ungrouped.length;
            return (
              <tr key={r.id}>
                <td className="border border-[#D8D8D8] bg-[#DDEBF4] text-[#052c65] px-4 py-3 font-medium text-right">
                  {r.label}
                </td>
                {Array.from({ length: cellCount }).map((_, i) => (
                  <td key={i} className="border border-[#D8D8D8] px-4 py-3 text-muted">-</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Step 2 — الأعمدة و المجموعات (Figma 282:185 / 916:4005) */
export default function StepStructure({ structure, onChange }) {
  const counts = structureCounts(structure);
  const hasAnything = counts.groups + counts.columns + counts.rows > 0;

  // All mutations go through the updater form: several clicks can land in one
  // render pass, and reading `structure` from the closure would drop all but
  // the last of them.
  const addGroup = () =>
    onChange((s) => ({
      ...s,
      groups: [...s.groups, { id: uid("g"), label: `مجموعة ${s.groups.length + 1}`, subsections: [] }],
    }));

  const addColumn = () =>
    onChange((s) => ({
      ...s,
      columns: [...s.columns, { id: uid("c"), label: `عمود ${s.columns.length + 1}`, groupId: null }],
    }));

  const addRow = () =>
    onChange((s) => ({ ...s, rows: [...s.rows, { id: uid("r"), label: `صف ${s.rows.length + 1}` }] }));

  const addSubsection = (gid) =>
    onChange((s) => ({
      ...s,
      groups: s.groups.map((g) =>
        g.id === gid
          ? { ...g, subsections: [...g.subsections, { id: uid("s"), label: `قسم ${g.subsections.length + 1}` }] }
          : g,
      ),
    }));

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

  const nameInput =
    "flex-1 min-w-0 bg-transparent text-[15px] text-[#052c65] outline-none focus:bg-white rounded px-2 py-1";

  return (
    <div className="flex gap-0 min-h-[620px]" dir="rtl">
      {/* tool panel */}
      <aside className="w-[320px] shrink-0 bg-[#dbe9f9] border border-[#d8d8d8] rounded-tr-[10px] flex flex-col">
        <div className="px-8 py-6 border-b border-[#eaeaeb]">
          <h3 className="text-[22px] font-semibold text-[#052c65] text-right mb-6">أدوات بناء الهيكل</h3>
          <div className="flex flex-col gap-6">
            <ToolButton icon={FolderPlus} label="إضافة مجموعة" onClick={addGroup} />
            <ToolButton icon={Columns2} label="إضافة عمود" onClick={addColumn} />
            <ToolButton icon={Rows2} label="إضافة صف" onClick={addRow} />
          </div>
        </div>

        <div className="px-6 py-6 flex-1 overflow-y-auto">
          <h3 className="text-[22px] font-semibold text-[#052c65] text-right mb-5">هيكل الأعمدة والمجموعات</h3>

          {!hasAnything ? (
            <div className="flex flex-col items-center gap-5 text-center pt-8">
              <span className="w-[77px] h-[73px] rounded-[20px] bg-[#f0f0f0] flex items-center justify-center">
                <FolderOpen size={50} className="text-[#052c65]" />
              </span>
              <span className="text-[18px] font-bold text-[#052c65]">لا توجد عناصر</span>
              <span className="text-[16px] text-[#adb5bd] leading-7">
                ابدأ بإضافة مجموعة أو عمود لبناء هيكل الجدول
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {structure.groups.map((g) => (
                <div key={g.id} className="bg-white rounded-[10px] border border-[#d8d8d8] p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={g.label}
                      onChange={(e) => renameIn("groups")(g.id, e.target.value)}
                      className={`${nameInput} font-semibold`}
                      aria-label="اسم المجموعة"
                    />
                    <button type="button" onClick={() => addSubsection(g.id)} aria-label="إضافة قسم فرعي" className="text-[#0986ed] cursor-pointer">
                      <Plus size={16} />
                    </button>
                    <button type="button" onClick={() => removeGroup(g.id)} aria-label="حذف المجموعة" className="text-muted hover:text-danger cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  {g.subsections.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 mt-2 pr-4">
                      <span className="text-muted text-[12px]">└</span>
                      <input
                        value={s.label}
                        onChange={(e) => renameSubsection(g.id, s.id, e.target.value)}
                        className={nameInput}
                        aria-label="اسم القسم الفرعي"
                      />
                      <button type="button" onClick={() => removeSubsection(g.id, s.id)} aria-label="حذف القسم" className="text-muted hover:text-danger cursor-pointer">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              {structure.columns.map((c) => (
                <div key={c.id} className="bg-white rounded-[10px] border border-[#d8d8d8] p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Columns2 size={16} className="text-[#0986ed] shrink-0" />
                    <input
                      value={c.label}
                      onChange={(e) => renameIn("columns")(c.id, e.target.value)}
                      className={nameInput}
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

              {structure.rows.map((r) => (
                <div key={r.id} className="bg-white rounded-[10px] border border-[#d8d8d8] p-3 flex items-center gap-2">
                  <Rows2 size={16} className="text-[#16A34A] shrink-0" />
                  <input
                    value={r.label}
                    onChange={(e) => renameIn("rows")(r.id, e.target.value)}
                    className={nameInput}
                    aria-label="اسم الصف"
                  />
                  <button type="button" onClick={() => removeFrom("rows")(r.id)} aria-label="حذف الصف" className="text-muted hover:text-danger cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* canvas */}
      <div className="flex-1 min-w-0 bg-white border border-r-0 border-[#d8d8d8] p-6">
        {hasAnything ? (
          <TablePreview structure={structure} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
            <span className="w-[100px] h-[100px] rounded-[13.33px] bg-[#e9ecef] flex items-center justify-center">
              <TableCellsMerge size={66} className="text-[#052c65]" />
            </span>
            <span className="text-[22px] font-bold text-[#052c65]">معاينة الجدول</span>
            <span className="text-[16px] text-[#adb5bd] max-w-[280px] leading-6">
              أضف أعمدة ومجموعات من اللوحة الجانبية لرؤية معاينة الجدول
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
