import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProjectDetails from "./pages/ProjectDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default App;
