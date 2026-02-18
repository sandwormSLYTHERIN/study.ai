import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/homepage";
import About from "../pages/about";
import Dashboard from "../pages/dash";
import Login from "../pages/login";
import Register from "../pages/register";
import Notes from "../pages/notes";
import Summarize from "../pages/summarize";
import Documents from "../pages/documents";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dash" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/summarize" element={<Summarize />} />
          <Route path="/documents" element={<Documents />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}