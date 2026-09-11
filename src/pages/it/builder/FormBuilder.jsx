import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "../../../components/it/ItLayout";
import BuilderStepper from "../../../components/it/BuilderStepper";
import StructureValidationModal from "../../../components/it/StructureValidationModal";
import SuccessModal from "../../../components/SuccessModal";
import StepMetadata from "./StepMetadata";
import StepStructure from "./StepStructure";
import StepReview from "./StepReview";
import {
  emptyMeta, emptyStructure, validationRows, completionPercent, isStructureComplete,
} from "./formBuilderState";

const BTN =
  "text-[22px] font-medium rounded-[11.27px] h-[57px] w-[259px] cursor-pointer";

/**
 * إنشاء نموذج البيان — the three-step template builder
 * (Figma 279:77 → 282:185 → 645:3331).
 */
export default function FormBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState(emptyMeta);
  const [structure, setStructure] = useState(emptyStructure);
  const [validationOpen, setValidationOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);

  const rows = validationRows(meta, structure);
  const percent = completionPercent(rows);

  const next = () => {
    if (step === 1 && !isStructureComplete(rows)) {
      setValidationOpen(true);
      return;
    }
    if (step < 2) setStep(step + 1);
  };

  const submit = () => setSentOpen(true);

  return (
    <Layout title="الطلبات">
      <div className={`flex flex-col ${step === 1 ? "h-full min-h-0 overflow-hidden" : "min-h-full"}`}>
        <div className={`pt-7 flex-1 flex flex-col min-h-0 ${step === 1 ? "px-4 sm:px-6 xl:px-8 pb-0 gap-8 overflow-hidden" : "px-4 sm:px-6 xl:px-8 pb-10 space-y-8"}`}>
          <div className="flex items-center gap-1 text-[20px] shrink-0" dir="rtl">
            <Link to="/it/requests" className="text-[#adb5bd] font-medium hover:text-primary">
              الطلبات
            </Link>
            <ChevronLeft size={30} className="text-[#052c65] shrink-0" />
            <span className="text-[#052c65] font-semibold">إنشاء نموذج البيان</span>
          </div>

          <div className="shrink-0">
            <BuilderStepper current={step} />
          </div>

          <div className={step === 1 ? "flex-1 min-h-0 -mx-4 sm:-mx-6 xl:-mx-8 flex flex-col overflow-hidden" : ""}>
            {step === 0 && <StepMetadata meta={meta} onChange={setMeta} />}
            {step === 1 && <StepStructure structure={structure} onChange={setStructure} />}
            {step === 2 && <StepReview meta={meta} structure={structure} />}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 h-[87px] shrink-0 bg-[#f9f9f9] border-t border-[#eaeaeb] px-4 sm:px-6 xl:px-8">
          <div className="h-full w-full flex items-center justify-between" dir="rtl">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={`${BTN} bg-[#e0e0e0] text-[#1f254b]`}
              >
                السابق
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={step === 2 ? submit : next}
              className={`${BTN} bg-[#0986ed] text-white`}
            >
              {step === 2 ? "إرسال" : "التالى"}
            </button>
          </div>
        </div>
      </div>

      <StructureValidationModal
        open={validationOpen}
        onClose={() => setValidationOpen(false)}
        rows={rows}
        percent={percent}
      />

      <SuccessModal
        open={sentOpen}
        onClose={() => {
          setSentOpen(false);
          navigate("/it/requests");
        }}
        message="تم إرسال نموذج البيان لاعتماد المشرف"
      />
    </Layout>
  );
}
