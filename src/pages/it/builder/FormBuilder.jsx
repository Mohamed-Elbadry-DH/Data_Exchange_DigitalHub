import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "../../../components/it/ItLayout";
import BuilderStepper from "../../../components/it/BuilderStepper";
import StructureValidationModal from "../../../components/it/StructureValidationModal";
import SuccessModal from "../../../components/SuccessModal";
import StepMetadata from "./StepMetadata";
import StepStructureMode from "./StepStructureMode";
import StepStructure from "./StepStructure";
import StepReview from "./StepReview";
import {
  emptyMeta, emptyStructure, validationRows, completionPercent, isStructureComplete,
} from "./formBuilderState";

/** Match ItListPage / detail action chrome (not Figma 1920 absolute 22/57). */
const BTN =
  "text-[16px] font-semibold rounded-[10px] h-[46px] min-w-[140px] px-6 cursor-pointer";

/**
 * إنشاء نموذج البيان — three-step template builder
 * (Figma 279:77 → 2244:1579 / 282:185 → 645:3331).
 *
 * Step 2 opens on the Excel-vs-manual chooser; manual continues to the
 * structure editor. Excel records a mock file pick then unlocks «التالى».
 */
export default function FormBuilder() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(0);
  /** null | "chooser" | "manual" | "excel" — only meaningful on step 1 */
  const [structurePhase, setStructurePhase] = useState(null);
  const [excelFileName, setExcelFileName] = useState("");
  const [meta, setMeta] = useState(emptyMeta);
  const [structure, setStructure] = useState(emptyStructure);
  const [validationOpen, setValidationOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);

  const rows = validationRows(meta, structure);
  const percent = completionPercent(rows);
  const onStructureStep = step === 1;
  const inChooser = onStructureStep && (structurePhase === null || structurePhase === "chooser");
  const inManual = onStructureStep && structurePhase === "manual";
  const inExcel = onStructureStep && structurePhase === "excel";

  const goToStep = (n) => {
    setStep(n);
    if (n === 1) setStructurePhase((p) => p ?? "chooser");
  };

  const next = () => {
    if (step === 0) {
      goToStep(1);
      setStructurePhase("chooser");
      return;
    }
    if (inChooser) {
      // Require an explicit card action first
      return;
    }
    if (inExcel) {
      goToStep(2);
      return;
    }
    if (inManual && !isStructureComplete(rows)) {
      setValidationOpen(true);
      return;
    }
    if (step < 2) goToStep(step + 1);
  };

  const back = () => {
    if (inManual || inExcel) {
      setStructurePhase("chooser");
      return;
    }
    if (step > 0) goToStep(step - 1);
  };

  const chooseManual = () => setStructurePhase("manual");

  const chooseExcel = () => {
    fileRef.current?.click();
  };

  const onExcelPicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    setStructurePhase("excel");
    e.target.value = "";
  };

  const submit = () => setSentOpen(true);

  const nextDisabled = inChooser;
  const nextLabel = step === 2 ? "إرسال" : "التالى";

  return (
    <Layout title="الطلبات">
      <div className={`flex flex-col ${inManual ? "h-full min-h-0 overflow-hidden" : "min-h-full"}`}>
        {/*
          page-shell--flush zeros padding-block (overrides pt-*), so top/gap
          live on an inner stack — Figma 279:77: ~26px under topbar, ~50px to stepper.
        */}
        <div className={`page-shell page-shell--flush flex-1 flex flex-col min-h-0 ${inManual ? "overflow-hidden" : ""}`}>
          <div
            className={`flex flex-1 flex-col min-h-0 pt-8 xl:pt-10 ${
              inManual ? "gap-10 pb-0 overflow-hidden" : "gap-10 pb-8"
            }`}
          >
            <div className="flex items-center gap-1 text-[16px] shrink-0" dir="rtl">
              <Link to="/it/requests" className="text-[#adb5bd] font-medium hover:text-primary">
                الطلبات
              </Link>
              <ChevronLeft size={20} className="text-[#052c65] shrink-0" />
              <span className="text-[#052c65] font-semibold">إنشاء نموذج البيان</span>
            </div>

            <div className="shrink-0">
              <BuilderStepper current={step} />
            </div>

            <div className={inManual ? "flex-1 min-h-0 -mx-4 sm:-mx-6 xl:-mx-8 flex flex-col overflow-hidden" : ""}>
              {step === 0 && <StepMetadata meta={meta} onChange={setMeta} />}
              {inChooser && (
                <StepStructureMode
                  onChooseManual={chooseManual}
                  onChooseExcel={chooseExcel}
                  excelFileName={excelFileName}
                />
              )}
              {inExcel && (
                <div className="flex flex-col items-center gap-4 py-10 text-center" dir="rtl">
                  <img src="/it/file-xls.png" alt="" className="size-12 object-contain" />
                  <h2 className="text-[18px] font-bold text-[#052c65]">تم رفع الملف</h2>
                  <p className="text-[14px] font-medium text-[#adb5bd]">{excelFileName}</p>
                  <button
                    type="button"
                    onClick={chooseExcel}
                    className="h-[46px] px-6 rounded-[10px] bg-[#052c65] text-white text-[16px] font-semibold cursor-pointer"
                  >
                    استبدال الملف
                  </button>
                </div>
              )}
              {inManual && <StepStructure structure={structure} onChange={setStructure} />}
              {step === 2 && <StepReview meta={meta} structure={structure} />}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 h-[64px] shrink-0 bg-[#f9f9f9] border-t border-[#eaeaeb]">
          {/* التالى (left) · إلغاء · السابق (right) — sizes match list/detail actions */}
          <div className="page-shell h-full flex items-center justify-between !py-0" dir="ltr">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={step === 2 ? submit : next}
                disabled={nextDisabled}
                className={`${BTN} bg-[#0986ed] text-white disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {nextLabel}
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/it/requests")}
                  className={`${BTN} bg-[#e0e0e0] text-[#052c65]`}
                >
                  إلغاء
                </button>
              )}
            </div>
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className={`${BTN} bg-[#e0e0e0] text-[#1f254b]`}
              >
                السابق
              </button>
            ) : (
              <span className="min-w-[140px]" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={onExcelPicked}
      />

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
