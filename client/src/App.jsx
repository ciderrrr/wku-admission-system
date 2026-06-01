import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicationForm from "./pages/ApplicationForm";
import UploadDocuments from "./pages/UploadDocuments";

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "student") return <Navigate to="/student" replace />;
    if (user.role === "officer") return <Navigate to="/officer" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply"
          element={
            <ProtectedRoute allowedRole="student">
              <ApplicationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload/:applicationId"
          element={
            <ProtectedRoute allowedRole="student">
              <UploadDocuments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;