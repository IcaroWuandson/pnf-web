"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!user) {
        router.push("/login");
      } else {
        router.push("/home");
      }
    };

    handleRedirect().finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return null;
}
