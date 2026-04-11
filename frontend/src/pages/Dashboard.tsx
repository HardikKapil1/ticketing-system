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

  useEffect(() => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    const decoded = jwtDecode<JwtPayload>(token)
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      navigate('/login')
      return
    }
    if (decoded.role === 'ADMIN') {
      navigate('/admin')
    } else {
      navigate('/user')
    }
  } catch (error) {
    // invalid token — clear and redirect
    console.error('Invalid token:', error);
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }
}, [])

  return null;
};

export default Dashboard;
