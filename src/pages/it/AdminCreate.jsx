import { Navigate } from "react-router-dom";

/** Legacy full-page create — now the Figma 1955:7129 modal on the list. */
export default function AdminCreate() {
  return <Navigate to="/it/admins?create=1" replace />;
}
