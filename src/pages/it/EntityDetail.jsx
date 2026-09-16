import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import ItDetailPage, { DetailTable } from "../../components/it/ItDetailPage";
import StatusBadge from "../../components/it/StatusBadge";
import {
  externalEntities, generalAdmins, detailForms, detailStatusChips, detailUserChips,
} from "../../data/mockIt";
import {
  loadItUsers,
  removeItUser,
  toggleItUserActive,
} from "../../domain/itUsersStore";
import { downloadCsv } from "./exportDownload";

function exportEntityFormsCsv(rows) {
  downloadCsv(
    "نماذج_البيان.csv",
    ["رقم الطلب", "عنوان نموذج البيان", "الإدارة", "الدورية", "الحالة", "تاريخ التسليم", "التأخير"],
    rows.map((r) => [r.id, r.title, r.admin, r.periodicity, r.status, r.delivered, r.delay]),
  );
}

const FORM_COLUMNS = [
  { key: "id", label: "رقم الطلب", dir: "ltr" },
  { key: "title", label: "عنوان نموذج البيان" },
  { key: "admin", label: "الإداراة المسؤلة" },
  { key: "periodicity", label: "الدورية" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
  { key: "delivered", label: "تاريخ التسليم", dir: "ltr" },
  { key: "delay", label: "التأخير" },
];

const ADMIN_COLUMNS = [
  { key: "name", label: "اسم الإدارة" },
  { key: "usersCount", label: "عدد المستخدمين" },
  { key: "bulletinsCount", label: "عدد النشرات" },
  { key: "formsCount", label: "عدد نماذج البيان" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

const USER_COLUMNS = [
  { key: "name", label: "المستخدم" },
  { key: "phone", label: "رقم الهاتف", dir: "ltr" },
  { key: "jobRole", label: "الدور الوظيفي" },
  { key: "joined", label: "تاريخ الانضمام", dir: "ltr" },
  { key: "stopped", label: "تاريخ الإيقاف", dir: "ltr" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

export default function EntityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => loadItUsers());
  const refreshUsers = (next) => setUsers(next);
  const entity = externalEntities.find((e) => String(e.id) === String(id)) || externalEntities[0];
  const owningAdmin = generalAdmins.find((a) => a.name === entity.admin);

  return (
    <ItDetailPage
      pageTitle="الجهات الخارجية"
      backTo="/it/entities"
      backLabel="الجهات الخارجية"
      midCrumb={owningAdmin ? { label: owningAdmin.name, to: `/it/admins/${owningAdmin.id}` } : { label: entity.admin }}
      heading={entity.name}
      tiles={[
        { label: "نوع الجهة", value: entity.type },
        { label: "الحالة", value: entity.status },
        { label: "عدد المستخدمين", value: 12 },
        { label: "عدد الإدارات المرتبطة", value: 3 },
        { label: "عدد نماذج البيان", value: entity.formsCount },
      ]}
      actions={(
        /* Actions sit on the left of the header; LTR order = إنشاء then تصدير (Figma 1060:4073) */
        <div className="flex flex-wrap items-center gap-3" dir="ltr">
          <button
            type="button"
            onClick={() => navigate("/it/forms/new")}
            className="flex items-center justify-center gap-2 bg-[#052c65] h-[46px] rounded-[10px] text-white text-[16px] font-semibold shrink-0 cursor-pointer whitespace-nowrap px-4"
          >
            <span>إنشاء البيان جديد</span>
            <Plus size={24} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => exportEntityFormsCsv(detailForms)}
            className="flex items-center justify-center gap-2 bg-[#052c65] h-[46px] min-w-[163px] rounded-[10px] text-white text-[16px] font-semibold shrink-0 cursor-pointer px-4"
          >
            <span>تصدير Excel</span>
            <span className="size-6 shrink-0 overflow-clip">
              <img src="/it/icon-download.svg" alt="" className="size-full" />
            </span>
          </button>
        </div>
      )}
      tabs={[
        {
          id: "forms",
          label: "نماذج البيان",
          chips: detailStatusChips,
          content: (
            <DetailTable
              columns={FORM_COLUMNS}
              rows={detailForms}
              showActions
              searchable
              searchKeys={["title"]}
              searchPlaceholder="بحث عن نموذج بيان"
            />
          ),
        },
        {
          id: "admins",
          label: "الإدارات المرتبطة",
          chips: null,
          content: (
            <DetailTable
              columns={ADMIN_COLUMNS}
              rows={generalAdmins.slice(0, 3)}
              onRowClick={(r) => navigate(`/it/admins/${r.id}`)}
              showActions
              searchable
              searchKeys={["name"]}
              searchPlaceholder="بحث عن إدارة"
            />
          ),
        },
        {
          id: "users",
          label: "المستخدمين",
          chips: detailUserChips,
          content: (
            <DetailTable
              columns={USER_COLUMNS}
              rows={users}
              showActions
              searchable
              searchKeys={["name", "phone"]}
              searchPlaceholder="بحث عن مستخدم"
              onEdit={(r) => navigate(`/it/users/${r.id}/edit`)}
              onDelete={(r) => refreshUsers(removeItUser(r.id))}
              leadingAction={(r) =>
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
              }
            />
          ),
        },
      ]}
    />
  );
}
