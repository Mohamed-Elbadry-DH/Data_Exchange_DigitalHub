import RequestList from "./RequestList";
import { formsRows } from "../../data/mockGa";
import { resolveFormsList } from "../../domain/requestState";

export default function FormsList() {
  const rows = resolveFormsList(formsRows);

  return (
    <RequestList
      title="نماذج البيان"
      listTitle="قائمة نماذج البيان"
      rows={rows}
      detailPath="/ga/forms"
    />
  );
}
