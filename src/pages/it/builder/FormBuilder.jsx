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
    // Structure requirements gate the move from step 2 to step 3.
    if (step === 1 && !isStructureComplete(rows)) {
      setValidationOpen(true);
      return;
    }
    if (step < 2) setStep(step + 1);
  };

  const submit = () => setSentOpen(true);

  return (
    <Layout title="لوحة التحكم">
      <div className="px-8 pt-7 pb-32 space-y-8">
        <div className="flex items-center gap-2 text-[15px] text-muted justify-end" dir="rtl">
          <Link to="/it" className="hover:text-primary">لوحة التحكم</Link>
          <ChevronLeft size={16} />
          <span className="text-[#052c65] text-[22px] font-semibold">إنشاء نموذج البيان</span>
        </div>

        <BuilderStepper current={step} />

        {step === 0 && (
          <>
            <p className="text-[18px] text-muted text-right">أدخل المعلومات الأساسية للقالب الجديد</p>
            <StepMetadata meta={meta} onChange={setMeta} />
          </>
        )}
        {step === 1 && <StepStructure structure={structure} onChange={setStructure} />}
        {step === 2 && <StepReview meta={meta} structure={structure} />}
      </div>

      {/* sticky action bar — Figma 641:1223 */}
      <div className="sticky bottom-0 h-[87px] bg-[#f9f9f9] border-t border-[#eaeaeb] flex items-center justify-between px-12">
        <button
          type="button"
          onClick={() => (step === 0 ? navigate("/it") : setStep(step - 1))}
          className="bg-[#e0e0e0] text-[#1f254b] text-[22px] rounded-[11.27px] h-[57px] w-[259px] cursor-pointer"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={step === 2 ? submit : next}
          className="bg-[#0986ed] text-white text-[22px] rounded-[11.27px] h-[57px] w-[259px] cursor-pointer"
        >
          {step === 2 ? "إرسال" : "التالى"}
        </button>
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
