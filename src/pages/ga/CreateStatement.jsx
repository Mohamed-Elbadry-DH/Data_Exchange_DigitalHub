import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "../../components/ga/GaLayout";
import CreateStatementForm, {
  DiscardWarning,
  emptyCreateForm,
} from "../../components/ga/CreateStatementForm";
import { createGaRequest } from "../../domain/requestState";

/**
 * طلب إنشاء نموذج البيان — full page (PDF / docs §10).
 * Route: `/ga/forms/new`
 */
export default function CreateStatement() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyCreateForm);
  const [uploadName, setUploadName] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);

  const back = () => navigate("/ga/forms");
  const requestCancel = () => setConfirmClose(true);

  const submit = () => {
    const row = createGaRequest({ ...form, uploadName });
    navigate(`/ga/forms/${row.id}`);
  };

  return (
    <Layout title="نماذج البيان">
      <div className="flex min-h-full flex-col">
        <div className="page-shell space-y-6 flex-1">
          <div className="flex items-center gap-1 text-[16px] shrink-0" dir="rtl">
            <Link to="/ga/forms" className="text-[#adb5bd] font-medium hover:text-primary">
              نماذج البيان
            </Link>
            <ChevronLeft size={20} className="text-[#052c65] shrink-0" />
            <span className="text-[#052c65] font-semibold">طلب إنشاء نموذج البيان</span>
          </div>

          <div className="bg-white rounded-[20px] border border-[#D8D8D8] p-6 sm:p-8 shadow-sm">
            <h2 className="text-[20px] font-bold text-[#052C65] mb-8 text-right">
              طلب إنشاء نموذج البيان
            </h2>
            <CreateStatementForm
              form={form}
              onChange={setForm}
              uploadName={uploadName}
              onUpload={() =>
                setUploadName(`مرفق_${form.title || "طلب"}_${Date.now().toString().slice(-4)}.xlsx`)
              }
              onSubmit={submit}
              onCancel={requestCancel}
            />
          </div>
        </div>
      </div>

      <DiscardWarning
        open={confirmClose}
        onConfirm={back}
        onCancel={() => setConfirmClose(false)}
      />
    </Layout>
  );
}
