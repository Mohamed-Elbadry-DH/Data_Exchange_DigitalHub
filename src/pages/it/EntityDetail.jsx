import { useNavigate, useParams } from "react-router-dom";
import { FileSpreadsheet } from "lucide-react";
import ItDetailPage, { DetailTable } from "../../components/it/ItDetailPage";
import StatusBadge from "../../components/it/StatusBadge";
import {
  externalEntities, generalAdmins, itUsers, detailForms, detailStatusChips, detailUserChips,
} from "../../data/mockIt";

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
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-gray-200 text-[#052C65] text-[14px] font-semibold rounded-[12px] py-2.5 px-4 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <FileSpreadsheet size={16} />
          تصدير Excel
        </button>
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
              rows={itUsers}
              showActions
              searchable
              searchKeys={["name", "phone"]}
              searchPlaceholder="بحث عن مستخدم"
            />
          ),
        },
      ]}
    />
  );
}
