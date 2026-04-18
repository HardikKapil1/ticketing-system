"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: number;
  role: string;
  exp: number;
}

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
      if (decoded.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (error) {
      // invalid token — clear and redirect
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      router.push("/login");
    }
  }, []);

  return null;
}
