# MPED Data Exchange — Accepted Baseline

**Status:** Accepted reference (as of 2026-08-12).  
**Purpose:** Lock the current look, interaction patterns, and structure so future pages stay consistent.  
**Do not** regress these screens for stylistic experiments unless explicitly requested.

> ## Supervisor module is FROZEN (2026-08-12)
> The supervisor module is shipped and stable. Every edit from now on lands in the general admin module.
>
> - Off-limits: `src/pages/*.jsx` (non-`ga`), `src/components/Layout.jsx`, `src/data/mock.js`.
> - Editable: `src/pages/ga/**`, `src/components/ga/**`, `src/data/mockGa.js`.
> - Need a shared component changed? Copy it into `src/components/ga/` and change the copy.
> - `src/domain/**` and `src/index.css` may only grow (additive), never in a way that changes what the supervisor renders.
> - If a task appears to require a supervisor edit, ask first.

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
| `/login` | Login | Demo user picker fills email + password → `/verify` |
| `/verify` | Verification code | Random 4-digit code typed in automatically → `/loading` |
| `/loading` | Loading | 3s spinner → role home |
| `/ga`, `/ga/forms`, `/ga/forms/:id`, `/ga/required`, `/ga/required/:id`, `/ga/users` | General admin module | Isolated clone — see section 10 |

Supervisor routes are wrapped in `RequireAuth allow={["مشرف الإدارة العامة"]}`, general admin routes in `RequireAuth allow={["الإدارة العامة"]}`; the three auth routes are wrapped in `RequireStage`. A role landing outside its module is redirected to `homePathForRole(role)`.

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

Simulated demo flow: `/login` → `/verify` → `/loading` (3s) → protected app.

- State in `src/context/AuthContext.jsx` (`AuthProvider` / `useAuth`), persisted in `localStorage` key **`mped-auth`** as `{ email, name, role, allowed, code, stage }` with `stage: "otp" | "loading" | "ready"`.
- `signIn({ email, name, role, allowed })` also generates a random 4-digit `code`. `issueCode()` regenerates it on resend. `verifyCode(code)` compares against the generated code and moves to `stage:"loading"`. `finishLoading()` sets `stage:"ready"`. `signOut()` clears the key.
- **Only مشرف الإدارة العامة (`enabled: true`) reaches the dashboard.** The other five demo users pass verification and then show «تدفق ... قيد التطوير حالياً» instead of navigating.
- Guards in `src/components/RequireAuth.jsx`: `RequireAuth` (outlet for app routes) redirects by stage via `STAGE_ROUTE = { otp: "/verify", loading: "/loading" }`; `RequireStage` keeps a ready user out of the auth screens.
- Shared chrome `src/components/AuthShell.jsx`: frame `min-w-[1100px]` / `max-w-[1920px]` on `#1b1d22`, page bg `#F6F7F8`, `/dots.png` halftone top-right + rotated bottom-left sized at 34.72% of frame width (666.67 of the 1920 canvas) at 0.6 opacity. Card **660.8 × 561.6** min, radius `26.67px`, bg `#E9ECEF`, shadow `0 5.33px 5.33px #00000040`, uniform `gap-[35px]`, content column capped at `contentWidth` (478.94). Logo `/auth-logo.png`. `Spinner` uses `/spinner.png`.
- Fields: 52px high, white, border `#D8D8D8`, icon on the **left**, value `dir="ltr"`, placeholder `#ADB5BD`. Primary buttons: height `65.61px`, radius `11.72px`, bg `#0747A5`.
- Login email field opens a picker of `demoUsers` (order: صانع القرار، أخصائي تقنية النظم والمعلومات، مشرف الإدارة العامة، الإدارة العامة، مشرف الجهة الخارجية، الجهة الخارجية) and auto-fills email + password; unavailable roles carry a «قيد التطوير» badge.
- OTP: four read-only 58×58 boxes in `dir="ltr"`; the generated code types itself in one digit every 450ms, the confirm and resend buttons stay disabled while typing, and a filled box turns its border `primary`.
- `roles` in `src/data/mock.js` keeps the 6 role definitions with responsibilities for the future role screens; the signed-in name and role feed the topbar in `Layout`.

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

## 10. General admin module (`/ga`)

Built as an **isolated clone** so the accepted supervisor screens can never regress while the general admin flow is shaped from `الإدارة العامة.pdf`.

```
src/components/ga/GaLayout.jsx   copy of Layout, NAV prefixed with /ga (+ end on /ga)
src/pages/ga/Dashboard.jsx       copies of the supervisor pages; only imports,
src/pages/ga/RequestList.jsx     detailPath and the notes storage key differ
src/pages/ga/FormsList.jsx       detailPath="/ga/forms"
src/pages/ga/RequiredList.jsx    detailPath="/ga/required"
src/pages/ga/RequestDetail.jsx   backTo "/ga/..."; notes come from src/domain/notes
src/pages/ga/UsersList.jsx
src/data/mockGa.js               `export * from "./mock"` — declare an export locally to diverge
src/auth/roleHome.js             homePathForRole(role) reads `home` from `demoUsers`
```

Rules while working here:
- Edit only `src/pages/ga/**`, `src/components/ga/**` and `src/data/mockGa.js`. Never change the supervisor pages to serve the general admin.
- Shared chrome (`StatusBadge`, `FilterModal`, `UserFormModal`, `ConfirmModal`, `SuccessModal`, `RequestEditModal`, `ChartTypeIcons`) is reused as-is; if a general-admin variant is needed, add it under `src/components/ga/`.
- Landing route per role comes from `demoUsers[].home` (`/` supervisor, `/ga` general admin).

## 10.1 Cross-module integration (`src/domain/`)

The modules are isolated in **UI only**. They are one product, and a request travels between roles, so anything both modules act on lives in `src/domain/` and is never forked per module:

```
src/domain/roles.js      ROLES — the six role labels, matching demoUsers[].role
src/domain/workflow.js   STAGES (7) with the owner role per stage + stageIndex /
                         stageById / ownsStage / nextStage
src/domain/notes.js      loadNotes / saveNotes on one key `mped-notes-${id}`
```

- **Notes are shared.** Both `RequestDetail` pages read and write the same key, so a note added in `/ga` shows up for the supervisor. The author is the signed-in user (`useAuth().name`), falling back to the request officer.
- **Stage ownership is shared.** Stage-driven buttons in either module must derive from `STAGES` / `ownsStage(role, stageId)` instead of hard-coding role checks per page.
- **`mockGa.js` overrides presentation only** (KPI labels, chart series, column sets). Overriding requests, notes or users there would let the two modules disagree about the same record.
- When a new flow needs writes (create request, advance stage), add the mutation to `src/domain/` and call it from both modules rather than storing it under a module-scoped key.

Still to build from the PDF (design differs from the supervisor clone):
1. Dashboard: three indicator groups (مؤشرات عامة / مؤشرات تبادل نماذج البيان / مؤشرات استيفاء البيانات) and an «إنشاء طلب بيان» action.
2. New page: طلب إنشاء نموذج البيان (توجيه الطلب إلى، العنوان، الإدارة المسؤولة، النشرة، الجهة المسؤولة، النطاق الجغرافي، وصف البيان، المنهجية، نوع/السنة، الدورية وتفصيلها، فترة التجميع، تاريخ الاستحقاق، فترة السماح، رفع الملف).
3. Request detail: 7-stage stepper (إنشاء → مراجعة → اعتماد نموذج البيان → استيفاء البيانات → مراجعة البيانات → اعتماد نهائي → غلق الطلب) with header tiles الحالة / المسؤول الحالي / الجهة الحالية / المرحلة الحالية, and stage-driven actions (طلب تعديل، اعتماد و إرساله لمشرف الإدارة، إرسال للجهة، غلق الطلب).
4. Attachments tab as a real table (اسم الملف، نوع الملف، تاريخ الرفع، الحجم، رفع بواسطة، إجراءات) plus the empty state «لا يوجد نموذج بيان للعرض».
5. استيفاء البيانات matrix for الدرجات العلمية (دبلوم/ماجستير/دكتوراه × ذكور/إناث × مصري/وافد، rows محافظات + التخصص).
6. List columns and filters per the PDF (المرحلة، الحالة، موجه إلى، تاريخ الإنشاء، مسح الكل).

---

## 11. IT specialist module (`/it`)

Third isolated module, built from Figma section `146:14` («أخصائي تقنية النظم والمعلومات») in file `zZTaMqB2BxBGru5HxlYSWZ`. Same isolation contract as `/ga` (§10): it never edits the supervisor or general-admin surfaces.

```
src/components/it/ItLayout.jsx      copy of GaLayout; NAV = 7 items prefixed /it
src/components/it/StatusBadge.jsx   driven by statusBadge in mockIt
src/components/it/ItListPage.jsx    shared shell for the 6 list screens
src/components/it/ItFilterModal.jsx field-driven filter (adds «ترتيب حسب»)
src/components/it/ItDetailPage.jsx  breadcrumb + tiles + status chips + tabs
                                    (also exports StatusChips/InfoTile/DetailTable)
src/components/it/ItForm.jsx        Field/TextInput/SelectInput/TextArea/
                                    CheckboxGroup/FormSection/FormActions
src/components/it/ItModal.jsx       760px create-dialog shell
src/components/it/{Entity,Bulletin}CreateModal.jsx, LinkEntitiesModal.jsx
src/components/it/BuilderStepper.jsx         3-step wizard header
src/components/it/StructureValidationModal.jsx
src/pages/it/Dashboard.jsx          KPIs, 2 chart cards, alerts, pending tasks
src/pages/it/{Admins,Entities,Bulletins,Users,Requests}List.jsx, ActivityLog.jsx
src/pages/it/{Admin,Entity,Request}Detail.jsx, {Admin,User}Create.jsx
src/pages/it/listUtils.js           date parsing + «الأحدث/الأقدم» sorting
src/pages/it/builder/FormBuilder.jsx         wizard container + sticky action bar
src/pages/it/builder/Step{Metadata,Structure,Review}.jsx
src/pages/it/builder/formBuilderState.js     counts, validation rows, % complete
src/data/mockIt.js                  `export * from "./mock"` + local overrides
```

Routes (all wrapped in `RequireAuth allow={[ROLES.IT_SPECIALIST]}`):
`/it` · `/it/admins` · `/it/admins/new` · `/it/admins/:id` · `/it/entities` · `/it/entities/:id` · `/it/bulletins` · `/it/users` · `/it/users/new` · `/it/forms/new` · `/it/requests` · `/it/requests/:id` · `/it/activity`

Form/modal sizing comes from Figma node `1049:911` and is shared by every create surface: label 20px bold `#1f254b` with a red asterisk, control 55px tall / radius 10 / border `rgba(5,44,101,0.16)`, placeholder 18px at 30% opacity, modal 760px wide / radius 26.667 / bg `#e9ecef` with a 69px header, buttons 142×41 (`#adb5bd` cancel, `#0986ed` submit).

The three Figma «إنشاء مستخدم» variants (`1054:1144` / `1060:2621` / `1060:3042`) differ only by «تبعية المستخدم», so they are one page (`UserCreate.jsx`) whose «بيانات الربط» section is conditional — hidden for صانع القرار.

Rules while working here:
- Edit only `src/pages/it/**`, `src/components/it/**` and `src/data/mockIt.js`.
- The shared `FilterModal` is fixed to status + one select + a date. These screens vary their fields per list and add a «ترتيب حسب» sort, so the module uses its own field-driven `ItFilterModal` rather than changing the shared one.
- New status vocabulary lives in `mockIt.statusBadge`: منتظم `#16A34A` · متأخر/متأخرة `#DC2626` · لا يوجد `#7F8999` · قيد المراجعة `#9747FF` · قيد تنفيذ `#5C5C5C` · لم يبدأ بعد `#1B75FF` · معتمد/معتمدة `#16A34A`.
- `src/data/mock.js` was touched once, by explicit approval: the `it-specialist` demoUsers row is now `enabled: true` with `home: "/it"`. That row is the single source of truth for login and role-routing; nothing the supervisor renders changed.
- `vite.config.js` now reads `process.env.PORT` (falling back to 5173) so the preview can pick a free port when 5174 is taken.

### 11.1 نموذج البيان builder (`/it/forms/new`)

Three-step wizard (Figma `279:77` → `282:185` → `645:3331`), reached from the dashboard «إجراءات سريعة» button and the الطلبات list «إنشاء البيان جديد».

1. **البيانات الوصفية** — metadata, the four «متطلبات الهيكل» counts, and الدورية والمواعيد.
2. **بناء نموذج البيان** — tool panel (إضافة مجموعة / عمود / صف) on a `#dbe9f9` rail beside a live table preview; columns can be nested under a group, producing the two-tier header. Both empty states come from the design.
3. **مراجعة و إرسال** — ملخص التحقق (unset fields read «غير محدد»), هيكل الجدول counts, خيارات التصدير, and مسار الاعتماد.

The design carries **two distinct stepper concepts**, and `src/domain/workflow.js` now names both as additive exports — `STAGES` was not touched:
- `FORM_WIZARD_STEPS` — the 3 authoring steps above.
- `FORM_BUILD_STEPS` + `FORM_BUILD_STATUS` — the 4-stage «مسار الاعتماد» (إنشاء القالب → بناء الهيكل → اعتماد المشرف → إرسال للجهة الخارجية) rendered inside step 3. **This is not the 7-stage `STAGES` request lifecycle**, which begins only once a template exists; never merge the two.

Moving from step 2 to step 3 is gated: if any «متطلبات الهيكل» count is unmet, `StructureValidationModal` (Figma `916:4407`) opens instead, listing المطلوب vs الحالى per item (red when short, green when met) with a completion percentage.

All structure mutations in `StepStructure` use the **updater form** of `onChange`, because several add-clicks can land in a single render pass and reading state from the closure would silently drop all but the last.

Still not built: real Excel/PDF export (the buttons are present but inert) and the standalone structure canvas variant `916:4005`.

### 11.2 Figma node map

Node ids for every screen in section `146:14` (file `zZTaMqB2BxBGru5HxlYSWZ`), preserved here so the designs can be re-opened without re-crawling the file. Implemented unless noted in §11.1.

| # | Node | Screen | Key content |
|---|------|--------|-------------|
| — | `895:2509` | **Dashboard** | KPIs: نماذج البيان النشطة (43), المستخدمين, النشرات, الجهات المرتبطة, الإدارات. Alerts: "3 جهات لم ترفع بياناتها فى الموعد المحدد", "7 بيانات تجاوزت الموعد النهائى". Entity-type distribution: وزارات 30% / جامعات 60% / هيئات حكومية 20% / مؤسسات عامة 10%. Per-إدارة bar chart. Recent-requests table. CTA «إنشاء طلب بيان». Period selector "النصف الأول من عام 2026". |
| 10 | `645:3671` | الإدارات العامة — list | cols: اسم الإدارة، تاريخ الإنشاء، عدد المستخدمين، الحالة، عدد النشرات، عدد الجهات المرتبطة، عدد نماذج البيان، إجراءات. + «إنشاء إدارة», search |
| 10- | `1057:2271` | " — filter modal | اسم الإدارة، تاريخ الإنشاء، ترتيب حسب (الأحدث) |
| 3 | `315:1170` | " — create page | اسم الإدارة العامة*, وصف الإدارة, ربط الجهات خارجية*(الجهة الخارجية) |
| 11 | `645:5076` | " — detail tab: نماذج البيان | tabs المستخدمين/النشرات/الجهات المرتبطة/نماذج البيان; cols رقم الطلب، عنوان نموذج البيان، الجهة الخارجية، الدورية، الحالة، تاريخ التسليم، التأخير، إجراءات |
| 12 | `645:4221` | " — detail tab: الجهات المرتبطة | cols الجهة الخارجية، نوع الجهة، عدد النشرات، عدد نماذج البيان، الحالة، الإجراءات |
| 12- | `916:4474` | " — ربط جهة خارجية modal | search + list (مصلحة الجمارك المصرية/جهات حكومية، الهيئة العامة للرقابة المالية/هيئات رقابية, اتحاد الغرف التجارية/منظمات أعمال) |
| 14 | `1060:3607` | " — detail tab: النشرات | cols اسم نشرة، الدورية، عدد الجهات المرتبطة، عدد نماذج البيان، تاريخ الإنشاء، إجراءات |
| 13 | `645:4699` | " — admin→entity drilldown | status chips: متأخر/معتمد/تعديل/قيد المراجعة/قيد تنفيذ/لم يبدأ بعد/إجمالي; cols عنوان نموذج البيان، الدورية، الحالة، تاريخ التسليم، التأخير، إجراءات |
| 15 | `645:5488` | " — detail tab: المستخدمين | cols المستخدم، رقم الهاتف، الدور الوظيفي، الجهة المرتبطة، الدورية، تاريخ الانضمام، تاريخ الإيقاف، الحالة، إجراءات |
| 8 | `649:5944` | الجهات الخارجية — list | cols اسم الجهة، النوع (جهة حكومية/مؤسسات مالية), الإدارة المرتبطة، الحالة (منتظم/متأخر), عدد نماذج البيان، إجراءات |
| 8- | `889:1883` | " — filter | نوع الجهة، الحالة، تاريخ الإنشاء، ترتيب حسب |
| 2 | `1049:911` | " — create modal | اسم الجهة*, نوع الجهة*, وصف الجهة, الصلاحيات*(اعتماد بيانات/تعديل بيانات/إدخال بيانات) |
| 9 | `1060:4073` | " — detail | tabs المستخدمين/الإدارات المرتبطة/نماذج البيان; cols رقم الطلب، عنوان نموذج البيان، الإداراة المسؤلة، الدورية، الحالة، تاريخ التسليم، التأخير |
| 16 | `940:3160` | النشرات — list | cols اسم نشرة، الإدارة التابعة، الدورية (شهري/ربع سنوي/سنوي), عدد الجهات المرتبطة، عدد نماذج البيان، تاريخ الإنشاء، إجراءات. + «إنشاء نشرة», «إنشاء البيان جديد», «تصدير Excel» |
| 16- | `1060:4482` | " — filter | الإدارة، الدورية، تاريخ الإنشاء، ترتيب حسب |
| 4 | `951:2388` | " — create modal | اسم النشرة*, نوع السنة*(ميلادية), الدورية*(سنوي), الإدارة التابعة*, ربط الجهات |
| 16-- | `951:2689` | " — ربط الجهات modal | search + entity list |
| 17 | `649:6456` | المستخدمين — list | cols المستخدم، رقم الهاتف، تبعية المستخدم، الدور الوظيفي، الإدارة/الجهة، تاريخ الانضمام، تاريخ الإيقاف، الحالة، إجراءات |
| 17- | `1060:4573` | " — filter | الإدارة/الجهة، الدور الوظيفي، تاريخ الانضمام، ترتيب حسب |
| 5 | `1054:1144` | " — create (tenancy: الإدارة العامة) | رقم الهاتف*, الاسم بالكامل*, تبعية المستخدم*(الإدارة العامة), الحالة*(نشط), كلمة المرور المؤقتة*, البريد الإلكترونى*, النشرات*(اختر نشرة أو أكثر) |
| 6 | `1060:2621` | " — create (tenancy: الجهة الخارجية) | same fields, تبعية المستخدم = الجهة الخارجية |
| 7 | `1060:3042` | " — create (tenancy: صانع القرار) | same fields, تبعية المستخدم = صانع القرار (no النشرات field) |
| 18 | `649:6968` | سجل النشاط — list | cols التاريخ والوقت، المستخدم (+ their sub-role e.g. Super Admin/Sector Admin)، نوع الإجراء (ربط/اعتماد/إنشاء)، الجهة/الإدارة المرتبطة، التفاصيل |
| 18- | `1060:5077` | " — filter | الإدارة/الجهة، نوع الإجراء، التاريخ والوقت |
| 19 | `649:7406` | الطلبات — list | cols رقم الطلب، عنوان نموذج البيان، الإدارة، نوع الطلب (بناء نموذج بيان), تاريخ تقديم الطلب، الموعد النهائي، الحالة (قيد تنفيذ/متأخرة), الإجرائات. + «إنشاء البيان جديد», «تصدير Excel» |
| 19- | `1060:5174` | " — filter | الإدارة/الجهة، نوع الإجراء، التاريخ والوقت |
| 20 | `649:7905` | " — request detail | رقم الطلب (REQ-2024-085), نوع الطلب, الإدارة, المرسل بواسطة, تاريخ تقديم الطلب, الموعد النهائي; metadata card: عنوان نموذج البيان، الإدارة المسؤولة، النشرة، الجهة المسؤولة، النطاق الجغرافي، وصف البيان; year info: نوع السنة، السنة، الدورية، تفصيل الدورية، فترة تجميع البيان، تاريخ الاستحقاق، فترة السماح; attachments: بيانات_الحاصلين_...xlsx، دليل تعبئة البيان.pdf; activity timeline (تم إرسال/إنشاء الطلب بواسطة ... تاريخ/وقت); search box |
| 21 | `279:77` | **Builder step 1/4** — المعلومات الأساسية + البيانات الوصفية | عنوان نموذج البيان* (placeholder "مثال: استمارة رقم 306"), الإدارة المسؤولة*, النشرة المرتبطة/النشرة*, الجهة المسؤولة*, النطاق الجغرافي*, المنهجية (helper "يرجى توضيح المنهجية المستخدمة لإعداد البيانات"), وصف البيان (helper "وصف تفصيلى للبيان و الغرض منة...."), عدد المجموعات الرئيسية المطلوبة*, عدد الأقسام الفرعية المطلوبة*, عدد الأعمدة المطلوبة*, عدد الصفوف المطلوبة*, نوع السنة* (مالية/٢٠٢١-٢٠٢٢ example), السنة*, الدورية* (ربع سنوي), تفصيل الدورية* (الربع الأول), فترة تجميع البيان* (من/إلى mm/dd/yyyy), تاريخ الاستحقاق*, فترة السماح (أيام)*. Stepper: 1 البيانات الوصفية لنموذج البيان (active) → 2 بناء نموذج البيان (الأعمدة و المجموعات) → 3 مراجعة و إرسال (التحقق من الصحة و الإرسال). |
| 22 | `282:185` | **Builder step 2/4** — الأعمدة و المجموعات | «إضافة مجموعة», «إضافة عمود», «إضافة صف» — same 3-step stepper, step 2 active |
| 23 | `916:4005` | **Builder step 3/4** — بناء نموذج البيان (structure) | same header/stepper as step 2 — this appears to be a sub-state of step 2 or a distinct structure-building canvas; needs visual confirmation |
| 23- | `916:4407` | " — validation modal | «لم يتم استكمال بناء الهيكل» — table: العنصر / المطلوب / الحالى for عدد المجموعات الرئيسية، عدد الأقسام الفرعية، عدد الأعمدة، عدد الصفوف؛ نسبة اكتمال الهيكل |
| 24 | `645:3331` | **Builder step 4/4** — مراجعة و إرسال / التحقق من الصحة | workflow stepper (NOT the same as the 3-step builder stepper): إنشاء القالب (مرسل الطلب - الإدارة, مكتمل) → بناء الهيكل (مدير النظام, جاري العمل) → اعتماد المشرف (مشرف الإدارة, في الانتظار) → إرسال للجهة الخارجية (مرسل الطلب - الجهة, في الانتظار). + «تصدير Excel», «تصدير PDF» |
| — | `642:1416`, `645:842`, `645:1513` | **Unidentified popups** | no text layers extracted; need `get_design_context` or screenshot to identify |

Two entries are worth a note: `916:4005` turned out to be a sub-state of builder step 2 rather than a separate screen, so it is folded into `StepStructure`; and `642:1416` / `645:842` / `645:1513` are popups with no extractable text layers, never identified and never built.

---

*When in doubt: match Dashboard + RequestDetail + Layout as the visual source of truth.*
