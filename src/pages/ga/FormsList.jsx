import RequestList from "./RequestList";
import { formsRows } from "../../data/mockGa";

export default function FormsList() {
  return (
    <RequestList
      title="نماذج البيان"
      listTitle="قائمة نماذج البيان"
      rows={formsRows}
      detailPath="/ga/forms"
    />
  );
}
