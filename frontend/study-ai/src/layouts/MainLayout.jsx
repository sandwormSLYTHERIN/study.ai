import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff" }}>
      <Navbar />
      <div style={{ padding: "30px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </div>
    </div>
  );
}