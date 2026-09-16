import RequestList from "./RequestList";
import { formsRows } from "../data/mock";
import { resolveSupervisorList } from "../domain/supervisorStatus";

export default function FormsList() {
  const rows = resolveSupervisorList(formsRows, "forms");
  return (
    <RequestList
      title="نماذج البيان"
      listTitle="قائمة نماذج البيان"
      rows={rows}
      detailPath="/forms"
    />
  );
}
