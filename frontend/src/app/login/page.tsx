"use client";

import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/login/LoginPage";

export default function Login() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <LoginPage onBack={handleBack} />;
}