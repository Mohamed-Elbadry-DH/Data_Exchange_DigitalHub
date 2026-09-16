import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItDetailPage, { DetailTable } from "../../components/it/ItDetailPage";
import StatusBadge from "../../components/it/StatusBadge";
import LinkEntitiesModal from "../../components/it/LinkEntitiesModal";
import {
  generalAdmins, externalEntities, bulletins, detailForms, detailStatusChips, detailUserChips,
} from "../../data/mockIt";
import {
  loadItUsers,
  removeItUser,
  toggleItUserActive,
} from "../../domain/itUsersStore";

const FORM_COLUMNS = [
  { key: "id", label: "رقم الطلب", dir: "ltr", className: "text-right" },
  { key: "title", label: "عنوان نموذج البيان", className: "text-right" },
  { key: "entity", label: "الجهة الخارجية", className: "text-right" },
  { key: "periodicity", label: "الدورية" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
  { key: "delivered", label: "تاريخ التسليم", dir: "ltr" },
  {
    key: "delay",
    label: "التأخير",
    render: (r) => (
      <span className={`text-[17px] font-semibold ${r.delay === "لا يوجد" ? "text-[#16a34a] opacity-60" : "text-[#dc2626]"}`}>
        {r.delay}
      </span>
    ),
  },
];

const ENTITY_COLUMNS = [
  { key: "name", label: "الجهة الخارجية", className: "text-right" },
  { key: "type", label: "نوع الجهة", className: "text-right" },
  {
    key: "bulletinsCount",
    label: "عدد النشرات",
    render: (r) => <span className="text-[20px] font-bold text-[#c89637]">{r.bulletinsCount}</span>,
  },
  {
    key: "formsCount",
    label: "عدد نماذج البيان",
    render: (r) => <span className="text-[20px] font-bold text-[#c89637]">{r.formsCount}</span>,
  },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

const BULLETIN_COLUMNS = [
  { key: "name", label: "اسم نشرة", className: "text-right" },
  { key: "periodicity", label: "الدورية" },
  { key: "entitiesCount", label: "عدد الجهات المرتبطة" },
  { key: "formsCount", label: "عدد نماذج البيان" },
  { key: "created", label: "تاريخ الإنشاء", dir: "ltr" },
];

const USER_COLUMNS = [
  {
    key: "name",
    label: "المستخدم",
    className: "text-right",
    render: (r) => (
      <div className="leading-[20px] text-right">
        <div className="text-[17px] font-medium text-[#052c65]">{r.name}</div>
        <div className="text-[14px] text-[rgba(5,44,101,0.3)]" dir="ltr">{r.email}</div>
      </div>
    ),
  },
  { key: "phone", label: "رقم الهاتف", dir: "ltr" },
  { key: "jobRole", label: "الدور الوظيفي" },
  { key: "org", label: "الجهة المرتبطة", className: "text-right" },
  { key: "joined", label: "تاريخ الانضمام", dir: "ltr" },
  { key: "stopped", label: "تاريخ الإيقاف", dir: "ltr" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

/** تفاصيل إدارة عامة — Figma 645:5076 / 645:4221 / 1060:3607 / 645:5488 */
export default function AdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [linkOpen, setLinkOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [entityStatus, setEntityStatus] = useState("");
  const [bullPeriod, setBullPeriod] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [users, setUsers] = useState(() => loadItUsers());
  const refreshUsers = (next) => setUsers(next);

  const admin = generalAdmins.find((a) => String(a.id) === String(id)) || generalAdmins[0];
  const linkedEntities = useMemo(
    () => {
      const owned = externalEntities.filter((e) => e.admin === admin.name);
      return owned.length ? owned : externalEntities.slice(5, 8);
    },
    [admin.name],
  );
  const linkedBulletins = useMemo(
    () => {
      const owned = bulletins.filter((b) => b.admin === admin.name);
      return owned.length ? owned : bulletins.slice(0, 3);
    },
    [admin.name],
  );
  const formRows = useMemo(
    () => (formStatus ? detailForms.filter((r) => r.status === formStatus) : detailForms),
    [formStatus],
  );
  const entityRows = useMemo(
    () => (entityStatus ? linkedEntities.filter((r) => r.status === entityStatus) : linkedEntities),
    [entityStatus, linkedEntities],
  );
  const bulletinRows = useMemo(
    () => (bullPeriod ? linkedBulletins.filter((r) => r.periodicity === bullPeriod) : linkedBulletins),
    [bullPeriod, linkedBulletins],
  );
  const userRows = useMemo(
    () => (userStatus ? users.filter((r) => r.status === userStatus) : users),
    [userStatus, users],
  );

  return (
    <>
      <ItDetailPage
        pageTitle="الإدارات العامة"
        backTo="/it/admins"
        backLabel="الإدارات العامة"
        heading={admin.name}
        showHeading={false}
        cardTabs
        tabs={[
          {
            id: "forms",
            label: "نماذج البيان",
            content: (
              <DetailTable
                title="نماذج البيان"
                columns={FORM_COLUMNS}
                rows={formRows}
                showActions
                showDelete={false}
                viewWhenStatus={(r) => r.status === "معتمد" || r.status === "قيد المراجعة"}
                searchable
                searchBoxed
                searchKeys={["title", "entity", "id"]}
                searchPlaceholder="بحث"
                chips={detailStatusChips}
                onRowClick={(r) => navigate(`/it/requests/${r.id}`)}
                filterFields={[
                  { label: "الحالة", value: formStatus, onChange: setFormStatus, options: [...new Set(detailForms.map((r) => r.status))] },
                ]}
                onClearFilters={() => setFormStatus("")}
              />
            ),
          },
          {
            id: "entities",
            label: "الجهات المرتبطة",
            content: (
              <DetailTable
                title={`الجهات الخارجية المرتبطة (${linkedEntities.length})`}
                columns={ENTITY_COLUMNS}
                rows={entityRows}
                onRowClick={(r) => navigate(`/it/admins/${admin.id}/entities/${r.id}`)}
                showActions
                searchable
                searchBoxed
                searchKeys={["name", "type"]}
                searchPlaceholder="بحث"
                actions={[{ label: "ربط جهة جديدة", icon: "link", onClick: () => setLinkOpen(true) }]}
                filterFields={[
                  { label: "الحالة", value: entityStatus, onChange: setEntityStatus, options: [...new Set(linkedEntities.map((r) => r.status))] },
                ]}
                onClearFilters={() => setEntityStatus("")}
              />
            ),
          },
          {
            id: "bulletins",
            label: "النشرات",
            content: (
              <DetailTable
                title={`النشرات المرتبطة (${bulletinRows.length})`}
                columns={BULLETIN_COLUMNS}
                rows={bulletinRows}
                showActions
                searchable
                searchBoxed
                searchKeys={["name"]}
                searchPlaceholder="بحث"
                leadingAction={() => ({
                  src: "/it/icon-git-compare.svg",
                  label: "ربط الجهات",
                  onClick: () => setLinkOpen(true),
                })}
                filterFields={[
                  { label: "الدورية", value: bullPeriod, onChange: setBullPeriod, options: [...new Set(linkedBulletins.map((r) => r.periodicity))] },
                ]}
                onClearFilters={() => setBullPeriod("")}
              />
            ),
          },
          {
            id: "users",
            label: "المستخدمين",
            content: (
              <DetailTable
                title="المستخدمين"
                columns={USER_COLUMNS}
                rows={userRows}
                showActions
                searchable
                searchBoxed
                searchKeys={["name", "phone", "email"]}
                searchPlaceholder="بحث"
                chips={detailUserChips}
                actions={[{ label: "تعيين مستخدم", primary: true, boxed: true, onClick: () => navigate("/it/users/new") }]}
                onEdit={(r) => navigate(`/it/users/${r.id}/edit`)}
                onDelete={(r) => refreshUsers(removeItUser(r.id))}
                leadingAction={(r) => (
                  r.status === "نشط"
                    ? {
                        src: "/it/icon-circle-pause.svg",
                        label: "إيقاف",
                        onClick: () => refreshUsers(toggleItUserActive(r.id)),
                      }
                    : {
                        src: "/it/icon-circle-play.svg",
                        label: "تفعيل",
                        onClick: () => refreshUsers(toggleItUserActive(r.id)),
                      }
                )}
                filterFields={[
                  { label: "الحالة", value: userStatus, onChange: setUserStatus, options: ["نشط", "غير نشط"] },
                ]}
                onClearFilters={() => setUserStatus("")}
              />
            ),
          },
        ]}
      />
      <LinkEntitiesModal open={linkOpen} onClose={() => setLinkOpen(false)} />
    </>
  );
}
