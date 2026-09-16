import RequestList from "./RequestList";
import { requiredRows } from "../data/mock";
import { resolveSupervisorList } from "../domain/supervisorStatus";

export default function RequiredList() {
  const rows = resolveSupervisorList(requiredRows, "required");
  return (
    <RequestList
      title="البيانات المطلوبة"
      listTitle="قائمة البيانات المطلوبة"
      rows={rows}
      detailPath="/required"
    />
  );
}
