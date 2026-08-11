import RequestList from "./RequestList";
import { requiredRows } from "../data/mock";

export default function RequiredList() {
  return (
    <RequestList
      title="البيانات المطلوبة"
      listTitle="قائمة البيانات المطلوبة"
      rows={requiredRows}
      detailPath="/required/1"
    />
  );
}
