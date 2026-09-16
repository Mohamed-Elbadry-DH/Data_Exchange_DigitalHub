---
name: ux
description: Rearranges MPED form cards and fields from DOM Path + React Component selections without restyling. Use when the user says /ux, attaches DOM paths, or asks to move, swap, or replace FormSection/cards on IT or GA screens.
---

# UX layout (DOM-path rearranges)

Apply when the user points at elements (DOM Path, Position, React Component) and asks to move, stack, swap, or replace them.

## Grounding

This is the MPED Data Exchange admin UI (Cairo, RTL). Audience is ministry operators. The page's job is completing a form — keep existing `FormSection` chrome, tokens, and Arabic copy. Do not invent a new visual system. Do not use Adobe React Spectrum.

## Do

1. Identify the page from the React component tree and the Arabic titles in the HTML.
2. Treat each named `FormSection` / card as a unit. Move the whole section, not inner fields, unless the user names a field.
3. Honor RTL grids: with `dir="rtl"`, the **first** grid child is on the **right**. Match the user's on-screen left/right from Position `left`, not from DOM order alone.
4. Keep `FormSection`, `Field`, `CheckboxGroup`, and page padding as they are. Change only parent structure (`grid`, `flex flex-col gap-8`).
5. Edit IT screens in `src/pages/it/**` and `src/components/it/**`. Do not restyle supervisor/GA unless the user names those modules.

## Don't

- Don't restyle radius, shadow, type, or colors to "improve" the layout.
- Don't flatten two cards into one unless asked.
- Don't reverse checkbox/option arrays as a substitute for moving a card.

## Example

**Ask:** move «الجهات الخارجية المرتبطة» below «البيانات الأساسية», replace its slot with «الصلاحيات».

**Result** (`AdminCreate`, RTL 2-col grid):

```
[الصلاحيات]    [البيانات الأساسية]
               [الجهات الخارجية المرتبطة]
```
