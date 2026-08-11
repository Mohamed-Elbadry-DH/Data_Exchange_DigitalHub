import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FormsList from "./pages/FormsList";
import RequiredList from "./pages/RequiredList";
import UsersList from "./pages/UsersList";
import RequestDetail from "./pages/RequestDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forms" element={<FormsList />} />
        <Route path="/forms/:id" element={<RequestDetail mode="forms" />} />
        <Route path="/required" element={<RequiredList />} />
        <Route path="/required/:id" element={<RequestDetail mode="required" />} />
        <Route path="/users" element={<UsersList />} />
      </Routes>
    </Router>
  );
}
