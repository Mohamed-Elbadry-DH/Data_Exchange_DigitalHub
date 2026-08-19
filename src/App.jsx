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
import DmDashboard from "./pages/dm/Dashboard";
import ItDashboard from "./pages/it/Dashboard";
import AdminsList from "./pages/it/AdminsList";
import EntitiesList from "./pages/it/EntitiesList";
import BulletinsList from "./pages/it/BulletinsList";
import ItUsersList from "./pages/it/UsersList";
import RequestsList from "./pages/it/RequestsList";
import ActivityLog from "./pages/it/ActivityLog";
import AdminDetail from "./pages/it/AdminDetail";
import AdminEntityDetail from "./pages/it/AdminEntityDetail";
import AdminCreate from "./pages/it/AdminCreate";
import EntityDetail from "./pages/it/EntityDetail";
import UserCreate from "./pages/it/UserCreate";
import ItRequestDetail from "./pages/it/RequestDetail";
import FormBuilder from "./pages/it/builder/FormBuilder";
import Login from "./pages/Login";
import VerifyCode from "./pages/VerifyCode";
import LoadingPage from "./pages/Loading";
import RequireAuth, { RequireStage } from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";
import { ROLES } from "./domain/roles";

const SUPERVISOR = ["مشرف الإدارة العامة"];
const GENERAL_ADMIN = ["الإدارة العامة"];
const IT_SPECIALIST = [ROLES.IT_SPECIALIST];
const DECISION_MAKER = [ROLES.DECISION_MAKER];

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

          {/* decision maker module */}
          <Route element={<RequireAuth allow={DECISION_MAKER} />}>
            <Route path="/dm" element={<DmDashboard />} />
          </Route>

          {/* IT specialist module */}
          <Route element={<RequireAuth allow={IT_SPECIALIST} />}>
            <Route path="/it" element={<ItDashboard />} />
            <Route path="/it/admins" element={<AdminsList />} />
            <Route path="/it/admins/new" element={<AdminCreate />} />
            <Route path="/it/admins/:id" element={<AdminDetail />} />
            <Route path="/it/admins/:id/entities/:entityId" element={<AdminEntityDetail />} />
            <Route path="/it/entities" element={<EntitiesList />} />
            <Route path="/it/entities/:id" element={<EntityDetail />} />
            <Route path="/it/bulletins" element={<BulletinsList />} />
            <Route path="/it/users" element={<ItUsersList />} />
            <Route path="/it/users/new" element={<UserCreate />} />
            <Route path="/it/forms/new" element={<FormBuilder />} />
            <Route path="/it/requests" element={<RequestsList />} />
            <Route path="/it/requests/:id" element={<ItRequestDetail />} />
            <Route path="/it/activity" element={<ActivityLog />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
