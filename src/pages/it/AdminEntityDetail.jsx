import { useParams } from "react-router-dom";
import ItDetailPage, { DetailTable } from "../../components/it/ItDetailPage";
import StatusBadge from "../../components/it/StatusBadge";
import {
  generalAdmins, externalEntities, detailForms, detailStatusChips,
} from "../../data/mockIt";
import { downloadCsv } from "./exportDownload";

const FORM_COLUMNS = [
  { key: "id", label: "رقم الطلب", dir: "ltr", className: "text-right" },
  { key: "title", label: "عنوان نموذج البيان", className: "text-right" },
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

function exportFormsCsv(rows) {
  downloadCsv(
    "نماذج_البيان.csv",
    ["رقم الطلب", "عنوان نموذج البيان", "الدورية", "الحالة", "تاريخ التسليم", "التأخير"],
    rows.map((r) => [r.id, r.title, r.periodicity, r.status, r.delivered, r.delay]),
  );
}

/** جهة مرتبطة من داخل إدارة عامة — Figma 645:4699 */
export default function AdminEntityDetail() {
  const { id, entityId } = useParams();
  const admin = generalAdmins.find((a) => String(a.id) === String(id)) || generalAdmins[0];
  const entity = externalEntities.find((e) => String(e.id) === String(entityId)) || externalEntities[5];
  const forms = detailForms.filter((f) => f.entity === entity.name);
  const rows = forms.length ? forms : detailForms;

  return (
    <ItDetailPage
      pageTitle="الإدارات العامة"
      backTo="/it/admins"
      backLabel="الإدارات العامة"
      midCrumb={{ label: admin.name, to: `/it/admins/${admin.id}` }}
      heading={entity.name}
      headingTone="primary"
      showHeading={false}
      actions={(
        <button
          type="button"
          onClick={() => exportFormsCsv(rows)}
          className="flex items-center justify-center gap-2 bg-[#052c65] h-[46px] w-[163px] rounded-[10px] text-white text-[16px] font-semibold shrink-0 cursor-pointer"
        >
          <span>تصدير Excel</span>
          <span className="size-6 shrink-0 overflow-clip">
            <img src="/it/icon-download.svg" alt="" className="size-full" />
          </span>
        </button>
      )}
    >
      <div className="space-y-6">
        <DetailTable
          title="نماذج البيان المطلوبة من هذة الجهة"
          columns={FORM_COLUMNS}
          rows={rows}
          showActions
          showDelete={false}
          viewWhenStatus={(r) => r.status === "معتمد" || r.status === "قيد المراجعة"}
          searchable
          searchBoxed
          searchKeys={["title", "id"]}
          searchPlaceholder="بحث"
          chips={detailStatusChips}
        />
      </div>
    </ItDetailPage>
  );
}
