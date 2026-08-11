import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FormsList from "./pages/FormsList";
import RequiredList from "./pages/RequiredList";
import UsersList from "./pages/UsersList";
import RequestDetail from "./pages/RequestDetail";
import Login from "./pages/Login";
import VerifyCode from "./pages/VerifyCode";
import LoadingPage from "./pages/Loading";
import RequireAuth, { RequireStage } from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RequireStage stage={null}><Login /></RequireStage>} />
          <Route path="/verify" element={<RequireStage stage="otp"><VerifyCode /></RequireStage>} />
          <Route path="/loading" element={<RequireStage stage="loading"><LoadingPage /></RequireStage>} />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forms" element={<FormsList />} />
            <Route path="/forms/:id" element={<RequestDetail mode="forms" />} />
            <Route path="/required" element={<RequiredList />} />
            <Route path="/required/:id" element={<RequestDetail mode="required" />} />
            <Route path="/users" element={<UsersList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
