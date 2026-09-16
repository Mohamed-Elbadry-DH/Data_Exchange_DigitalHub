import { useEffect, useRef, useState } from "react";
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
import ExcelSheetRenderer from "./ExcelSheetRenderer";
import FieldConfirmPanel from "./FieldConfirmPanel";
import { parseWorkbook } from "./excel/ingestion/parseWorkbook.js";
import { inferFields } from "./excel/fields/inferFields.js";
import { createDefaultExcelInteractionSchema } from "./excel/interaction/interactionSchema.js";
import { buildEditableCellIndex, seedEditableCellValues } from "./excel/interaction/editableCellIndex.js";
import { analyzeWorkbookFormulas } from "./excel/calculation/formulaPrecedents.js";
import {
  applyCalculationPayload,
  createCalculationEngine,
  createWorkbookId,
} from "./excel/calculation/calculationEngine.js";
import { normalizeInputValue } from "./excel/calculation/inputNormalize.js";
import {
  emptyMeta, emptyStructure, validationRows, completionPercent, isStructureComplete,
} from "./formBuilderState";

/** Match ItListPage / detail action chrome (not Figma 1920 absolute 22/57). */
const BTN =
  "text-[16px] font-semibold rounded-[10px] h-[46px] min-w-[140px] px-6 cursor-pointer";

const CALC_DEBOUNCE_MS = 150;

/**
 * إنشاء نموذج البيان — three-step template builder
 * Excel path: parse → Auto Input Policy → numeric inputs + live formula recalculation.
 */
export default function FormBuilder() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  /** Original File kept outside React state (ref only). */
  const excelFileRef = useRef(null);
  const calcEngineRef = useRef(null);
  const calcDebounceRef = useRef(null);
  const pendingCalcValuesRef = useRef({});
  const handleCalcMessageRef = useRef(null);

  const [step, setStep] = useState(0);
  /** null | "chooser" | "manual" | "excel" — only meaningful on step 1 */
  const [structurePhase, setStructurePhase] = useState(null);
  const [excelFileName, setExcelFileName] = useState("");
  const [workbookJson, setWorkbookJson] = useState(null);
  const [interactionSchema, setInteractionSchema] = useState(null);
  const [editableIndex, setEditableIndex] = useState(() => new Map());
  const [parsingStatus, setParsingStatus] = useState("idle"); // idle | parsing | ready | error
  const [validationErrors, setValidationErrors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState(() => new Set());
  /** Sparse map: cellRef → number | string (interim typing) */
  const [cellValues, setCellValues] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});
  const [calculationErrors, setCalculationErrors] = useState({});
  const [calculationStatus, setCalculationStatus] = useState("idle");
  const [calculationMeta, setCalculationMeta] = useState(null);
  const [formulaCount, setFormulaCount] = useState(0);
  const [calculationErrorDetail, setCalculationErrorDetail] = useState("");

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

  useEffect(() => {
    return () => {
      if (calcDebounceRef.current) clearTimeout(calcDebounceRef.current);
      calcEngineRef.current?.destroy();
      calcEngineRef.current = null;
    };
  }, []);

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
    if (inChooser) return;
    if (inExcel) {
      if (parsingStatus !== "ready" || !workbookJson) return;
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

  const tearDownCalculation = async () => {
    if (calcDebounceRef.current) {
      clearTimeout(calcDebounceRef.current);
      calcDebounceRef.current = null;
    }
    pendingCalcValuesRef.current = {};
    const engine = calcEngineRef.current;
    calcEngineRef.current = null;
    if (engine) {
      try {
        await engine.destroy();
      } catch {
        /* ignore */
      }
    }
    setCalculatedValues({});
    setCalculationErrors({});
    setCalculationMeta(null);
    setCalculationStatus("idle");
  };

  const resetExcelState = async () => {
    await tearDownCalculation();
    setWorkbookJson(null);
    setInteractionSchema(null);
    setEditableIndex(new Map());
    setSuggestions([]);
    setSelectedSuggestionIds(new Set());
    setCellValues({});
    setValidationErrors([]);
    setFormulaCount(0);
    setCalculationErrorDetail("");
  };

  const handleCalcMessage = (msg) => {
    const { type, payload } = msg || {};
    if (type === "READY") {
      setCalculatedValues(payload?.changedValues || {});
      setCalculationErrors(payload?.errors || {});
      setCalculationMeta(payload?.meta || null);
      setCalculationErrorDetail("");
      setCalculationStatus("ready");
      // Flush UI debounce queue now that engine is ready
      if (calcDebounceRef.current) {
        clearTimeout(calcDebounceRef.current);
        calcDebounceRef.current = null;
      }
      queueMicrotask(() => flushPendingCalc());
      return;
    }
    if (type === "CALCULATION_RESULT") {
      if (payload?.queued) return;
      setCalculatedValues((prevValues) => {
        const applied = applyCalculationPayload(payload, {
          calculatedValues: prevValues,
          calculationErrors: {},
        });
        return applied.calculatedValues;
      });
      setCalculationErrors((prevErrors) => {
        const applied = applyCalculationPayload(payload, {
          calculatedValues: {},
          calculationErrors: prevErrors,
        });
        return applied.calculationErrors;
      });
      setCalculationErrorDetail("");
      setCalculationStatus("ready");
      return;
    }
    if (type === "CALCULATION_ERROR" || type === "ENGINE_ERROR") {
      const detail = payload?.error?.detail || payload?.error?.message || "";
      // Ignore transient "not ready" noise
      if (/not ready|Stale or missing/i.test(String(detail))) return;
      setCalculationErrorDetail(String(detail || payload?.error?.code || "CALCULATION_ERROR"));
      setCalculationStatus("error");
    }
  };
  handleCalcMessageRef.current = handleCalcMessage;

  const startCalculationEngine = async (workbook) => {
    await tearDownCalculation();
    setCalculationStatus("initializing");
    setCalculationErrorDetail("");
    const workbookId = createWorkbookId();
    const engine = createCalculationEngine({
      onMessage: (msg) => handleCalcMessageRef.current?.(msg),
    });
    calcEngineRef.current = engine;
    try {
      const msg = await engine.initialize(workbook, { workbookId });
      if (msg?.type === "ENGINE_ERROR") {
        setCalculationErrorDetail(
          String(msg.payload?.error?.detail || msg.payload?.error?.code || "ENGINE_ERROR"),
        );
        setCalculationStatus("error");
      }
    } catch (e) {
      setCalculationErrorDetail(String(e?.message || e));
      setCalculationStatus("error");
    }
  };

  const applyWorkbook = (workbook) => {
    const schema = createDefaultExcelInteractionSchema();
    const index = buildEditableCellIndex(workbook, schema);
    const seeded = seedEditableCellValues(workbook, index);
    const { formulaCount: nFormulas } = analyzeWorkbookFormulas(workbook);
    setWorkbookJson(workbook);
    setInteractionSchema(schema);
    setEditableIndex(index);
    setSuggestions(inferFields(workbook));
    setSelectedSuggestionIds(new Set());
    setCellValues(seeded);
    setFormulaCount(nFormulas);
    void startCalculationEngine(workbook);
  };

  const onExcelPicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    excelFileRef.current = file;
    setExcelFileName(file.name);
    setStructurePhase("excel");
    await resetExcelState();
    setParsingStatus("parsing");

    const result = await parseWorkbook(file);
    if (!result.ok) {
      setParsingStatus("error");
      setValidationErrors([result.error]);
      return;
    }

    applyWorkbook(result.workbook);
    setParsingStatus("ready");
  };

  const flushPendingCalc = () => {
    const engine = calcEngineRef.current;
    const batch = pendingCalcValuesRef.current;
    if (!engine || !Object.keys(batch).length) return;
    // Keep queue until engine is ready — setValues itself also queues.
    if (!engine.isReady) {
      return;
    }
    pendingCalcValuesRef.current = {};
    setCalculationStatus((s) => (s === "initializing" ? s : "calculating"));
    void engine.setValues(batch);
  };

  const scheduleCalcUpdate = (cellRef, value) => {
    pendingCalcValuesRef.current[cellRef] = normalizeInputValue(value);
    if (calcDebounceRef.current) clearTimeout(calcDebounceRef.current);
    calcDebounceRef.current = setTimeout(() => {
      calcDebounceRef.current = null;
      flushPendingCalc();
    }, CALC_DEBOUNCE_MS);
  };

  const handleCellValueChange = (cellRef, numOrNull, display) => {
    setCellValues((prev) => {
      const next = { ...prev };
      if (display === "" || (numOrNull === null && display === "")) {
        delete next[cellRef];
        scheduleCalcUpdate(cellRef, null);
        return next;
      }
      if (numOrNull !== undefined && numOrNull !== null) {
        next[cellRef] = numOrNull;
        scheduleCalcUpdate(cellRef, numOrNull);
      } else {
        next[cellRef] = display;
      }
      return next;
    });
  };

  const clearValues = () => {
    setCellValues((prev) => {
      const blanks = {};
      for (const ref of Object.keys(prev)) blanks[ref] = null;
      pendingCalcValuesRef.current = { ...pendingCalcValuesRef.current, ...blanks };
      if (calcDebounceRef.current) clearTimeout(calcDebounceRef.current);
      calcDebounceRef.current = setTimeout(() => {
        calcDebounceRef.current = null;
        flushPendingCalc();
      }, CALC_DEBOUNCE_MS);
      return {};
    });
  };

  const resetFieldConfiguration = () => {
    if (!workbookJson) return;
    const schema = createDefaultExcelInteractionSchema();
    setInteractionSchema(schema);
    setEditableIndex(buildEditableCellIndex(workbookJson, schema));
    setSelectedSuggestionIds(new Set());
  };

  const toggleSuggestion = (id) => {
    setSelectedSuggestionIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });
  };

  const applySuggestionConfig = () => {
    if (!workbookJson || !interactionSchema) return;
    const chosen = suggestions.filter((s) => selectedSuggestionIds.has(s.id));
    const overrides = chosen.map((s) => ({
      cell: s.cellRef,
      editable: true,
      type: s.type === "textarea" || s.type === "select" ? "number" : s.type || "number",
    }));
    const nextSchema = {
      ...interactionSchema,
      cellOverrides: [
        ...(interactionSchema.cellOverrides || []).filter(
          (o) => !overrides.some((n) => n.cell === o.cell),
        ),
        ...overrides,
      ],
    };
    setInteractionSchema(nextSchema);
    setEditableIndex(buildEditableCellIndex(workbookJson, nextSchema));
  };

  const submit = () => setSentOpen(true);

  const nextDisabled =
    inChooser ||
    (inExcel && (parsingStatus === "parsing" || parsingStatus === "error" || !workbookJson));
  const nextLabel = step === 2 ? "إرسال" : "التالى";

  return (
    <Layout title="الطلبات">
      <div className={`flex flex-col ${inManual ? "h-full min-h-0 overflow-hidden" : "min-h-full"}`}>
        <div className={`page-shell page-shell--flush flex-1 flex flex-col min-h-0 ${inManual ? "overflow-hidden" : ""}`}>
          <div
            className={`flex flex-1 flex-col min-h-0 pt-8 xl:pt-10 ${
              inManual ? "gap-10 pb-0 overflow-hidden" : "gap-10 pb-8"
            }`}
          >
            <div className="flex items-center gap-2 text-[15px] text-muted shrink-0" dir="rtl">
              <Link to="/it/requests" className="hover:text-primary">
                الطلبات
              </Link>
              <ChevronLeft size={16} className="text-[#adb5bd] shrink-0" />
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
                <ExcelStructureStep
                  excelFileName={excelFileName}
                  parsingStatus={parsingStatus}
                  validationErrors={validationErrors}
                  workbookJson={workbookJson}
                  editableIndex={editableIndex}
                  cellValues={cellValues}
                  calculatedValues={calculatedValues}
                  calculationErrors={calculationErrors}
                  calculationStatus={calculationStatus}
                  calculationMeta={calculationMeta}
                  calculationErrorDetail={calculationErrorDetail}
                  formulaCount={formulaCount}
                  suggestions={suggestions}
                  selectedSuggestionIds={selectedSuggestionIds}
                  onReplace={chooseExcel}
                  onToggleSuggestion={toggleSuggestion}
                  onApplySuggestionConfig={applySuggestionConfig}
                  onClearValues={clearValues}
                  onResetConfig={resetFieldConfiguration}
                  onValueChange={handleCellValueChange}
                />
              )}
              {inManual && <StepStructure structure={structure} onChange={setStructure} />}
              {step === 2 && (
                <StepReview
                  meta={meta}
                  structure={structure}
                  workbookJson={workbookJson}
                  cellValues={cellValues}
                  calculatedValues={calculatedValues}
                  calculationErrors={calculationErrors}
                  calculationMeta={calculationMeta}
                />
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 h-[64px] shrink-0 bg-[#f9f9f9] border-t border-[#eaeaeb]">
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
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

function ExcelStructureStep({
  excelFileName,
  parsingStatus,
  validationErrors,
  workbookJson,
  editableIndex,
  cellValues,
  calculatedValues,
  calculationErrors,
  calculationStatus,
  calculationMeta,
  calculationErrorDetail = "",
  formulaCount = 0,
  suggestions,
  selectedSuggestionIds,
  onReplace,
  onToggleSuggestion,
  onApplySuggestionConfig,
  onClearValues,
  onResetConfig,
  onValueChange,
}) {
  const editableCount = editableIndex?.size ?? 0;
  const showCalcBusy =
    calculationStatus === "initializing" || calculationStatus === "calculating";

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/it/file-xls.png" alt="" className="size-10 object-contain shrink-0" />
          <div className="min-w-0 text-right">
            <h2 className="text-[22px] font-bold text-[#052c65]">معاينة ملف Excel</h2>
            <p className="text-[14px] font-medium text-[#adb5bd] truncate">{excelFileName}</p>
            {parsingStatus === "ready" && (
              <p className="text-[13px] text-[#0986ed] mt-0.5">
                {editableCount} خانة جاهزة لإدخال الأرقام
                {formulaCount > 0
                  ? ` · ${formulaCount} معادلة نشطة`
                  : " · لا توجد معادلات في الملف"}
              </p>
            )}
            {parsingStatus === "ready" && formulaCount === 0 && (
              <p className="text-[12px] text-[#c89637] mt-0.5">
                لإظهار الحسابات الحية ارفع ملف Excel يحتوي صيغًا مثل =B8+C8 أو =SUM(B8:B12)
              </p>
            )}
            {showCalcBusy && (
              <p className="text-[12px] text-[#7f8999] mt-0.5" aria-live="polite">
                ● جاري تحديث الحسابات...
              </p>
            )}
            {calculationStatus === "error" && (
              <p className="text-[12px] text-[#dc2626] mt-0.5" title={calculationErrorDetail}>
                تعذّر تحديث بعض الحسابات
                {calculationErrorDetail ? ` — ${calculationErrorDetail}` : ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end" dir="ltr">
          {parsingStatus === "ready" && (
            <>
              <button
                type="button"
                onClick={onClearValues}
                className="h-[46px] px-4 rounded-[10px] bg-[#e0e0e0] text-[#052c65] text-[14px] font-semibold cursor-pointer"
              >
                مسح القيم
              </button>
              <button
                type="button"
                onClick={onResetConfig}
                className="h-[46px] px-4 rounded-[10px] bg-[#e0e0e0] text-[#052c65] text-[14px] font-semibold cursor-pointer"
              >
                إعادة ضبط الإعداد
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onReplace}
            className="h-[46px] px-6 rounded-[10px] bg-[#052c65] text-white text-[16px] font-semibold cursor-pointer"
          >
            استبدال الملف
          </button>
        </div>
      </div>

      {parsingStatus === "parsing" && (
        <div className="rounded-[12px] border border-[#d8d8d8] bg-white py-16 text-center">
          <p className="text-[16px] font-semibold text-[#052c65]">جارٍ تحليل ملف Excel...</p>
          <p className="text-[13px] text-[#adb5bd] mt-2">قد يستغرق ذلك لحظات حسب حجم الملف</p>
        </div>
      )}

      {parsingStatus === "error" && (
        <div className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] p-5 text-right">
          <p className="text-[15px] font-semibold text-[#dc2626]">تعذّر استيراد الملف</p>
          <ul className="mt-2 space-y-1">
            {validationErrors.map((err) => (
              <li key={err} className="text-[14px] text-[#7f1d1d]">{err}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onReplace}
            className="mt-4 h-[40px] px-4 rounded-[10px] bg-[#052c65] text-white text-[14px] font-semibold cursor-pointer"
          >
            اختر ملفًا آخر
          </button>
        </div>
      )}

      {parsingStatus === "ready" && workbookJson && (
        <>
          <ExcelSheetRenderer
            workbook={workbookJson}
            mode="edit"
            editableIndex={editableIndex}
            values={cellValues}
            calculatedValues={calculatedValues}
            calculationErrors={calculationErrors}
            calculationStatus={calculationStatus}
            onValueChange={onValueChange}
            showEditableAffordances
          />
          {calculationMeta?.formulaProfile && (
            <p className="text-[11px] text-[#adb5bd] text-left" dir="ltr">
              calc {calculationMeta.engine} {calculationMeta.engineVersion} ·{" "}
              {calculationMeta.formulaProfile}
            </p>
          )}
          <FieldConfirmPanel
            suggestions={suggestions}
            selectedIds={selectedSuggestionIds}
            onToggle={onToggleSuggestion}
            onConfirm={onApplySuggestionConfig}
            onClear={onResetConfig}
          />
        </>
      )}
    </div>
  );
}
