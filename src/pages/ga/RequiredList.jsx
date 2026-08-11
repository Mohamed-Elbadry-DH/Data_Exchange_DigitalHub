import RequestList from "./RequestList";
import { requiredRows } from "../../data/mockGa";

export default function RequiredList() {
  return (
    <RequestList
      title="البيانات المطلوبة"
      listTitle="قائمة البيانات المطلوبة"
      rows={requiredRows}
      detailPath="/ga/required"
    />
  );
}
