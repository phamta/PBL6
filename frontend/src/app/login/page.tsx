"use client";

import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/login/LoginPage";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // điều hướng sau khi "đăng nhập" thành công
    router.push("/dashboard/admin");
  };

  const handleBack = () => {
    router.push("/");
  };

  return <LoginPage onLogin={handleLogin} onBack={handleBack} />;
}