"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import VisaoGeral from "./_componentes/VisaoGeral";
import DetalheCategorias from "./_componentes/DetalheCategorias";

export default function Page() {
  const searchParams = useSearchParams();
  const tab = useMemo(
    () => searchParams.get("tab") || "visao-geral",
    [searchParams]
  );

  return (
    <Tabs defaultValue={tab}>
      <TabsList className="h-auto w-full md:w-[30vw] -space-x-px bg-background p-0 shadow-xs rtl:space-x-reverse">
        <TabsTrigger
          value="visao-geral"
          className="relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          asChild
        >
          <Link href="?tab=visao-geral" scroll={false}>
            Visão Geral
          </Link>
        </TabsTrigger>

        <TabsTrigger
          value="gasto-categoria"
          className="relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          asChild
        >
          <Link href="?tab=gasto-categoria" scroll={false}>
            Gasto por Categoria
          </Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visao-geral">
        <VisaoGeral />
      </TabsContent>

      <TabsContent value="gasto-categoria">
        <DetalheCategorias />
      </TabsContent>
    </Tabs>
  );
}
