"use client";

import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/lib/supabase";

// import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { Spinner } from "@/components/ui/spinner";
import AppSidebar from "./AppSidebar";
import Navbar from "./NavBar";

export const invalidateStatusCache = (userId: string) => {
  const cacheKey = `user_status_${userId}`;
  localStorage.removeItem(cacheKey);
};

export default function AppShell({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  // const { user } = useAuth();
  // const [isActive, setIsActive] = useState<boolean | null>(null);

  // useEffect(() => {
  //   if (!user?.id) return;

  //   const CACHE_KEY = `user_status_${user.id}`;
  //   const CACHE_TTL = 10 * 60 * 1000;

  //   const fetchUserStatus = async () => {
  //     try {
  //       const cached = localStorage.getItem(CACHE_KEY);
  //       if (cached) {
  //         const { ativo, timestamp } = JSON.parse(cached);
  //         const isExpired = Date.now() - timestamp > CACHE_TTL;
  //         if (!isExpired) {
  //           setIsActive(ativo);
  //           return;
  //         } else {
  //           localStorage.removeItem(CACHE_KEY);
  //         }
  //       }

  //       const { data, error } = await supabase
  //         .from("users")
  //         .select("ativo")
  //         .eq("user_id", user.id)
  //         .single();

  //       if (error) {
  //         console.error("Erro ao buscar status do usuário:", error);
  //         setIsActive(false);
  //         return;
  //       }

  //       const ativo = data?.ativo ?? false;
  //       setIsActive(ativo);
  //       localStorage.setItem(
  //         CACHE_KEY,
  //         JSON.stringify({ ativo, timestamp: Date.now() })
  //       );
  //     } catch (err) {
  //       console.error("Erro inesperado:", err);
  //       setIsActive(false);
  //     }
  //   };

  //   fetchUserStatus();
  // }, [user?.id]);

  // if (isActive === null) {
  //   return (
  //     <div className="flex h-screen w-screen">
  //       <AppSidebar />

  //       <div className="flex flex-col flex-1">
  //         <Navbar />

  //         <main className="flex-1 h-full bg-gray-50   dark:bg-gray-900 w-full flex items-center justify-center p-6 space-y-6 animate-pulse overflow-y-auto">
  //           <Spinner />
  //         </main>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full dark:bg-gray-900 relative">
      {!isMobile && <AppSidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className={`flex-1 p-6 `}>{children}</main>
        {/* 
        {!isActive && (
          <div className="fixed inset-0  flex items-center justify-center bg-transparent pointer-events-auto">
            <Card className=" relative top-52 max-w-sm w-full p-6">
              <CardTitle className="text-center text-lg font-bold">
                É necessário ativar seu plano
              </CardTitle>
              <CardContent className="text-center mt-4">
                Para ter acesso completo a plataforma, por favor assine um dos
                nossos planos.
              </CardContent>
              <div className="mt-2 flex justify-center">
                <Button
                  className="
                w-full"
                >
                  <Link href="/ativar-plano">Ativar Plano</Link>
                </Button>
              </div>
            </Card>
          </div>
        )} */}
      </div>
    </div>
  );
}
