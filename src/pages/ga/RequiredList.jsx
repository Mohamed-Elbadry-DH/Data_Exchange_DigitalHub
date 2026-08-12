import RequestList from "./RequestList";
import { formsRows, requiredRows } from "../../data/mockGa";
import { resolveRequiredList } from "../../domain/requestState";

export default function RequiredList() {
  const rows = resolveRequiredList(formsRows, requiredRows);

  return (
    <RequestList
      title="البيانات المطلوبة"
      listTitle="قائمة البيانات المطلوبة"
      rows={rows}
      detailPath="/ga/required"
    />
  );
}
