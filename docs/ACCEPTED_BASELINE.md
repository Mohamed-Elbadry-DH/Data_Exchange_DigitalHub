# MPED Data Exchange — Accepted Baseline

**Status:** Accepted reference (as of 2026-08-12).  
**Purpose:** Lock the current look, interaction patterns, and structure so future pages stay consistent.  
**Do not** regress these screens for stylistic experiments unless explicitly requested.

---

## 1. Product & stack

Arabic RTL admin for **منصة تبادل البيانات (Data Exchange)**.

| Layer | Choice |
|-------|--------|
| UI | React 19 + Vite 8 |
| Routing | react-router-dom 7 |
| Style | Tailwind 4 (`src/index.css` `@theme`) |
| Charts | Recharts 3 |
| Icons | lucide-react + `ChartTypeIcons.jsx` |
| Font | Cairo |
| Data | `src/data/mock.js` (no backend yet) |

---

## 2. Routes (current)

| Path | Page | Notes |
|------|------|--------|
| `/` | Dashboard | KPIs + 4 switchable chart cards |
| `/forms` | Forms list | Shared `RequestList` |
| `/forms/:id` | Request detail | `mode="forms"` — 4 tabs |
| `/required` | Required list | Shared `RequestList` |
| `/required/:id` | Request detail | `mode="required"` — 5 tabs |
| `/users` | Users | Add / edit / pause / delete modals |
| `/login` | Login | Email + password → `/verify` |
| `/verify` | Verification code | 4 digits + resend → `/select-role` |
| `/select-role` | Role selection | 6 role cards → `/` |

All app routes above are wrapped in `RequireAuth`; the three auth routes are wrapped in `RequireStage`.

Sidebar **الإعدادات** is still unrouted; **تسجيل الخروج** now signs out and returns to `/login`.

---

## 3. Design tokens

From `src/index.css`:

| Token | Value |
|-------|-------|
| navy | `#1f254b` |
| navy-light | `#34609a` |
| navy-deep | `#052c65` |
| primary | `#1b75ff` |
| primary-2 | `#0986ed` |
| success | `#16a34a` |
| danger | `#dc2626` |
| warning | `#ff8c08` |
| warning-2 | `#c89637` |
| purple | `#9747ff` |
| page | `#f5f6fa` |
| ink | `#404040` |
| muted | `#7f8999` |

Common non-token values: outer `#1b1d22`, borders `#D8D8D8`, matrix accent `#DDEBF4`, hbar track `#E8F1FF`, info tile `#2563EB4D`.

Status chart/badge colors: اعتماد `#1B75FF` · تعديل `#FF8C08` · متأخرة `#DC2626` · معتمدة `#16A34A`.

---

## 4. Shell (`Layout.jsx`) — accepted sizes

- Frame: `min-w-[1100px]` · `max-w-[1920px]` · `bg-page` · RTL
- Sidebar: **329px** expanded / **121px** collapsed · `bg-navy`
- Nav pill: height **50px**; expanded width **264px** inset; active `bg-primary`
- Logo mark: **35×35** (`/logo-mark.png`)
- Topbar: **74px** white sticky
- Content: lists/dashboard `p-8`; detail `px-8 pt-7`

---

## 5. Dashboard charts — accepted behavior

**Card:** height **345**, radius **20**, padding `p-5`, title 17px bold.

**Type selector** (`dir="ltr"`, frame **217×39**):

| Icon | Type |
|------|------|
| Pie | pie |
| Life buoy | donut |
| Line | line |
| Column | vertical bar (column) |
| Horizontal bars | horizontal bar |

- Active: `rgba(9,134,237,0.09)` + `#0986ED`
- Inactive: `#052C65`
- Icons are **functional controls**, not decoration
- Pie/donut hover tooltip: **`الاسم : القيمة %`** (both name and value)
- Chart area `dir="ltr"`; page stays RTL
- Row layout: `max-w-[1535.5px]` · gap **63px** · `flex-row-reverse`

**Defaults:** approval → pie · monthly → line · status → donut · top orgs → hbar  
Org Y-labels: **single line**; Y-axis width ~230; hbar domain may exceed 100 to shorten bars slightly.

---

## 6. Request detail — accepted behavior

- In-page breadcrumb (not Layout prop): parent list → `/navigate-next.svg` rotated 180° → «تفاصيل الطلب»
- Title under breadcrumb: 27px `#052C65`
- Info tiles: icon well **60×60**, radius 15, bg `#2563EB4D`
- Tabs: Cairo; active text `#052C65`, underline `#0986ED`
- KV tables: `#D8D8D8` borders + full-height center divider; min-height ~385
- **نموذج البيان:** `DataMatrixTable` headers/row labels `#DDEBF4` — **empty cells (`-`)**, structure only (no numbers)
- **استيفاء البيانات** (required mode only): same schema **with filled mock data** + totals row
- Notes: add / save / cancel / list / delete; seed from `notesByRequestId` when `localStorage` empty; persist `mped-notes-${requestId}`
- Action buttons by status:
  - `تعديل` → hide both «طلب تعديل» and «اعتماد و إرسال»
  - `معتمدة` → hide approve only; keep «طلب تعديل»
  - other statuses → show both
- Approve / request-edit → existing success/edit modals

---

## 6b. Authentication (mock)

Flow: `/login` → `/verify` → `/select-role` → protected app.

- State in `src/context/AuthContext.jsx` (`AuthProvider` / `useAuth`), persisted in `localStorage` key **`mped-auth`** as `{ email, stage, role }` with `stage: "otp" | "role" | "ready"`.
- `signIn(email)` accepts any valid email + password ≥ 6 chars. `verifyCode` only accepts **`2239`** (from the design). `resendCode` restarts a 60s countdown. `chooseRole(name)` sets `stage:"ready"`.
- Guards in `src/components/RequireAuth.jsx`: `RequireAuth` (outlet for app routes) redirects by stage; `RequireStage` keeps a ready user out of the auth screens.
- Shared chrome `src/components/AuthShell.jsx`: page bg `#f5f6fa`, `/dots.png` halftone top-left + rotated bottom-right, centered card `rounded-2xl` bg `#E9EDF1` (`width` prop — **440** for login/verify, **980** for roles), logo `/logo-mark.png` + «منصة تبادل البيانات» navy-deep bold 20 + `Data Exchange` muted 13 LTR. `Spinner` uses `/spinner.png`.
- Fields: 52px high, white, border `#D8D8D8`, leading icon on the right (RTL), value `dir="ltr"`. Primary buttons 52px `bg-navy-deep`.
- OTP: four 58×58 boxes in `dir="ltr"` with auto-advance, Backspace step-back, and paste support.
- Roles come from `roles` in `src/data/mock.js` (6 roles, 4 responsibilities each, lucide icon name); the chosen role name feeds the topbar role line in `Layout`.

---

## 7. Shared components to reuse

`Layout` · `StatusBadge` · `FilterModal` · `UserFormModal` · `RequestEditModal` · `ConfirmModal` · `SuccessModal` · `ChartTypeIcons` · `RequestList` (forms + required)

Page-local patterns to copy (not extract unless needed): Dashboard `ChartCard` / chart renderers; RequestDetail `InfoTile` / `KVTable` / `DataMatrixTable` / `NotesTab`.

---

## 8. How we work on next pages

1. **Freeze baseline** — don’t restyle Dashboard / shell / detail chrome while adding new work.
2. **Clone nearest peer** — same card radius, borders, button styles, typography scale.
3. **Data first in mock.js** — realistic Arabic labels; statement-specific tables when showing forms.
4. **Route + nav only when asked** — Settings is the obvious next nav target.
5. **Charts** — if a new page needs charts, reuse the 5-type selector contract.
6. **RTL** — Arabic `text-right`; LTR only for charts and email/phone fields.
7. **Fix known data gaps when touching required flow** — align `requiredRows` ids 6–10 with `requestDetailById`.

### Likely next surfaces

1. Settings page (+ wire sidebar)
2. Notifications panel
4. Dashboard period filter (interactive)
5. Completing required-detail mock coverage / new statement types
6. Create / edit request or editable matrix cells (product-driven)

---

## 9. Explicit non-goals (for now)

- Mobile-first redesign of the 1100px shell
- Replacing Cairo / inventing a new palette
- Backend/API without a separate decision
- Changing chart card height (345) or selector frame (217×39) without a design ask

---

*When in doubt: match Dashboard + RequestDetail + Layout as the visual source of truth.*
