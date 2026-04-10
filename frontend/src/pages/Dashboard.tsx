import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  useEffect(() => {
    if (!token || !decoded) {
      navigate("/login");
      return;
    }
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (decoded.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, []);

  return null;
};

export default Dashboard;
