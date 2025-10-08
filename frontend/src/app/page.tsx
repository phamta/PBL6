"use client";

import { useRouter } from "next/navigation";
import { EnhancedLandingPage } from "@/components/LandingPage";

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return <EnhancedLandingPage onLoginClick={handleLoginClick} />;
}