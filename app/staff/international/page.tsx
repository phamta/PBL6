"use client";

import { useRouter } from "next/navigation";
import { InternationalMembers } from "../../../components/staff/InternationalMembers";

export default function StaffInternationalPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === "visa-management") {
      router.push("/staff/visa");
    }
  };

  return <InternationalMembers onNavigate={handleNavigate} />;
}