import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import ItDetailPage, { DetailTable } from "../../components/it/ItDetailPage";
import StatusBadge from "../../components/it/StatusBadge";
import LinkEntitiesModal from "../../components/it/LinkEntitiesModal";
import {
  generalAdmins, externalEntities, bulletins, itUsers, detailForms, detailStatusChips,
} from "../../data/mockIt";

const FORM_COLUMNS = [
  { key: "id", label: "رقم الطلب", dir: "ltr" },
  { key: "title", label: "عنوان نموذج البيان" },
  { key: "entity", label: "الجهة الخارجية" },
  { key: "periodicity", label: "الدورية" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
  { key: "delivered", label: "تاريخ التسليم", dir: "ltr" },
  { key: "delay", label: "التأخير" },
];

const ENTITY_COLUMNS = [
  { key: "name", label: "الجهة الخارجية" },
  { key: "type", label: "نوع الجهة" },
  { key: "bulletinsCount", label: "عدد النشرات", render: () => 3 },
  { key: "formsCount", label: "عدد نماذج البيان" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

const BULLETIN_COLUMNS = [
  { key: "name", label: "اسم نشرة" },
  { key: "periodicity", label: "الدورية" },
  { key: "entitiesCount", label: "عدد الجهات المرتبطة" },
  { key: "formsCount", label: "عدد نماذج البيان" },
  { key: "created", label: "تاريخ الإنشاء", dir: "ltr" },
];

const USER_COLUMNS = [
  { key: "name", label: "المستخدم" },
  { key: "phone", label: "رقم الهاتف", dir: "ltr" },
  { key: "jobRole", label: "الدور الوظيفي" },
  { key: "org", label: "الجهة المرتبطة" },
  { key: "joined", label: "تاريخ الانضمام", dir: "ltr" },
  { key: "stopped", label: "تاريخ الإيقاف", dir: "ltr" },
  { key: "status", label: "الحالة", render: (r) => <StatusBadge status={r.status} /> },
];

export default function AdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [linkOpen, setLinkOpen] = useState(false);

  const admin = generalAdmins.find((a) => String(a.id) === String(id)) || generalAdmins[0];

  return (
    <>
      <ItDetailPage
        pageTitle="الإدارات العامة"
        backTo="/it/admins"
        backLabel="الإدارات العامة"
        heading={admin.name}
        tiles={[
          { label: "الحالة", value: admin.status },
          { label: "عدد المستخدمين", value: admin.usersCount },
          { label: "عدد النشرات", value: admin.bulletinsCount },
          { label: "عدد الجهات المرتبطة", value: admin.entitiesCount },
          { label: "عدد نماذج البيان", value: admin.formsCount },
        ]}
        chips={detailStatusChips}
        tabs={[
          {
            id: "forms",
            label: "نماذج البيان",
            content: <DetailTable columns={FORM_COLUMNS} rows={detailForms} />,
          },
          {
            id: "entities",
            label: "الجهات المرتبطة",
            content: (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setLinkOpen(true)}
                    className="flex items-center gap-2 bg-[#052C65] text-white text-[14px] font-bold rounded-[12px] py-2.5 px-4 cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    ربط جهة خارجية
                  </button>
                </div>
                <DetailTable
                  columns={ENTITY_COLUMNS}
                  rows={externalEntities}
                  onRowClick={(r) => navigate(`/it/entities/${r.id}`)}
                />
              </div>
            ),
          },
          {
            id: "bulletins",
            label: "النشرات",
            content: <DetailTable columns={BULLETIN_COLUMNS} rows={bulletins} />,
          },
          {
            id: "users",
            label: "المستخدمين",
            content: <DetailTable columns={USER_COLUMNS} rows={itUsers} />,
          },
        ]}
      />
      <LinkEntitiesModal open={linkOpen} onClose={() => setLinkOpen(false)} />
    </>
  );
}
