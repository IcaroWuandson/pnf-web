"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FormTransacao from "./_componentes/FormTransacao";
import { MonthCarousel } from "@/components/seletor-mes";
import TableDespesa from "./_componentes/TableDespesa";
import { Separator } from "@/components/ui/separator";

type Totais = {
  entradas: number;
  fixas: number;
  variaveis: number;
  saldo: number;
};

export default function Page() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pessoal, setPessoal] = useState<Totais>({
    entradas: 0,
    fixas: 0,
    variaveis: 0,
    saldo: 0,
  });
  const [empresarial, setEmpresarial] = useState<Totais>({
    entradas: 0,
    fixas: 0,
    variaveis: 0,
    saldo: 0,
  });

  const fetchData = async () => {
    if (!user?.id) return;

    const inicioMes = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).toISOString();
    const fimMes = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      1
    ).toISOString();

    const { data, error } = await supabase
      .from("transacoes")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", inicioMes)
      .lt("created_at", fimMes);

    if (error) {
      console.error("Erro ao buscar transações:", error);
      return;
    }

    const pessoalData = data.filter((t) => t.origem === "pessoal");
    const empresarialData = data.filter((t) => t.origem === "empresarial");

    const calcularTotais = (arr: any[]): Totais => {
      const entradas = arr
        .filter((t) => t.tipo === "entrada")
        .reduce((acc, t) => acc + Number(t.valor), 0);
      const fixas = arr
        .filter((t) => t.tipo === "saida" && t.fixo)
        .reduce((acc, t) => acc + Number(t.valor), 0);
      const variaveis = arr
        .filter((t) => t.tipo === "saida" && !t.fixo)
        .reduce((acc, t) => acc + Number(t.valor), 0);
      return {
        entradas,
        fixas,
        variaveis,
        saldo: entradas - (fixas + variaveis),
      };
    };

    setPessoal(calcularTotais(pessoalData));
    setEmpresarial(calcularTotais(empresarialData));
  };

  // Busca inicial e ao trocar de mês
  useEffect(() => {
    fetchData();
  }, [user?.id, selectedDate]);

  // 🔥 Escuta em tempo real alterações na tabela
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("transacoes-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transacoes",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData(); // Atualiza automaticamente
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <MonthCarousel
        onMonthSelect={(date) => setSelectedDate(date)}
        defaultSelectedMonth={new Date()}
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {/* --- Saldo Pessoal --- */}
        <Card className="col-span-2 bg-[#b8fbff]">
          <CardHeader>
            <CardTitle>Saldo Pessoal</CardTitle>
            <CardDescription>Seu resumo PF</CardDescription>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <div className="flex justify-between">
              <span>Entradas:</span>
              <strong className="text-green-600">
                {pessoal.entradas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Despesas fixas:</span>
              <strong className="text-red-600">
                {pessoal.fixas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Despesas variáveis:</span>
              <strong className="text-red-600">
                {pessoal.variaveis.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <Separator className="bg-black" />
            <div className="flex justify-between pt-2 ">
              <span>Saldo:</span>
              <strong
                className={
                  pessoal.saldo >= 0 ? "text-green-700" : "text-red-700"
                }
              >
                {pessoal.saldo.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* --- Saldo Empresarial --- */}
        <Card className="col-span-2 bg-[#bdfce1]">
          <CardHeader>
            <CardTitle>Saldo Empresarial</CardTitle>
            <CardDescription>Seu resumo PJ</CardDescription>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <div className="flex justify-between">
              <span>Entradas:</span>
              <strong className="text-green-600">
                {empresarial.entradas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Despesas fixas:</span>
              <strong className="text-red-600">
                {empresarial.fixas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Despesas variáveis:</span>
              <strong className="text-red-600">
                {empresarial.variaveis.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <Separator className="bg-black" />
            <div className="flex justify-between  pt-2">
              <span>Saldo:</span>
              <strong
                className={
                  empresarial.saldo >= 0 ? "text-green-700" : "text-red-700"
                }
              >
                {empresarial.saldo.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* --- Botão Nova Movimentação --- */}
        <Card>
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>Registre uma nova movimentação</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#24b3a9] font-bold text-white">
                  <PlusCircle className="mr-2" /> Nova movimentação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="mb-5">
                  <DialogTitle>Registre aqui a sua movimentação</DialogTitle>
                </DialogHeader>
                <FormTransacao />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <TableDespesa />
    </div>
  );
}
