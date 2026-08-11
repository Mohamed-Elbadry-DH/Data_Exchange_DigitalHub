import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FormsList from "./pages/FormsList";
import RequiredList from "./pages/RequiredList";
import UsersList from "./pages/UsersList";
import RequestDetail from "./pages/RequestDetail";
import GaDashboard from "./pages/ga/Dashboard";
import GaFormsList from "./pages/ga/FormsList";
import GaRequiredList from "./pages/ga/RequiredList";
import GaUsersList from "./pages/ga/UsersList";
import GaRequestDetail from "./pages/ga/RequestDetail";
import Login from "./pages/Login";
import VerifyCode from "./pages/VerifyCode";
import LoadingPage from "./pages/Loading";
import RequireAuth, { RequireStage } from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

const SUPERVISOR = ["مشرف الإدارة العامة"];
const GENERAL_ADMIN = ["الإدارة العامة"];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RequireStage stage={null}><Login /></RequireStage>} />
          <Route path="/verify" element={<RequireStage stage="otp"><VerifyCode /></RequireStage>} />
          <Route path="/loading" element={<RequireStage stage="loading"><LoadingPage /></RequireStage>} />

          {/* supervisor module */}
          <Route element={<RequireAuth allow={SUPERVISOR} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forms" element={<FormsList />} />
            <Route path="/forms/:id" element={<RequestDetail mode="forms" />} />
            <Route path="/required" element={<RequiredList />} />
            <Route path="/required/:id" element={<RequestDetail mode="required" />} />
            <Route path="/users" element={<UsersList />} />
          </Route>

          {/* general admin module */}
          <Route element={<RequireAuth allow={GENERAL_ADMIN} />}>
            <Route path="/ga" element={<GaDashboard />} />
            <Route path="/ga/forms" element={<GaFormsList />} />
            <Route path="/ga/forms/:id" element={<GaRequestDetail mode="forms" />} />
            <Route path="/ga/required" element={<GaRequiredList />} />
            <Route path="/ga/required/:id" element={<GaRequestDetail mode="required" />} />
            <Route path="/ga/users" element={<GaUsersList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
