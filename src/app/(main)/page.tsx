"use client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  const accessToken = getAccessToken();

  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    } else {
      router.push("login");
    }
  }, []);

  return (
    <div className="h-screen w-full flex-center">
      <LoadingSpinner className="h-10 w-10" />
    </div>
  );
};

export default HomePage;
