import { useNavigate, useParams } from "react-router-dom";
import ItDetailPage, { DetailTable } from "../../components/it/ItDetailPage";
import StatusBadge from "../../components/it/StatusBadge";
import {
  externalEntities, generalAdmins, itUsers, detailForms, detailStatusChips,
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

  return (
    <ItDetailPage
      pageTitle="الجهات الخارجية"
      backTo="/it/entities"
      backLabel="الجهات الخارجية"
      heading={entity.name}
      tiles={[
        { label: "نوع الجهة", value: entity.type },
        { label: "الحالة", value: entity.status },
        { label: "عدد المستخدمين", value: 12 },
        { label: "عدد الإدارات المرتبطة", value: 3 },
        { label: "عدد نماذج البيان", value: entity.formsCount },
      ]}
      chips={detailStatusChips}
      tabs={[
        {
          id: "forms",
          label: "نماذج البيان",
          content: <DetailTable columns={FORM_COLUMNS} rows={detailForms} />,
        },
        {
          id: "admins",
          label: "الإدارات المرتبطة",
          content: (
            <DetailTable
              columns={ADMIN_COLUMNS}
              rows={generalAdmins.slice(0, 3)}
              onRowClick={(r) => navigate(`/it/admins/${r.id}`)}
            />
          ),
        },
        {
          id: "users",
          label: "المستخدمين",
          content: <DetailTable columns={USER_COLUMNS} rows={itUsers} />,
        },
      ]}
    />
  );
}
