"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Transacao = {
  id: string;
  user_id: string;
  tipo: "entrada" | "saida";
  origem: "pessoal" | "empresarial";
  valor: number | string;
  fixo: boolean;
  data?: string | null;
  created_at: string;
};

type ResumoMes = {
  entradas: number;
  saidas: number;
  saldo: number;
};

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function addMonthsSafe(date: Date, months: number) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const lastDay = new Date(y, m + months + 1, 0).getDate();
  return new Date(y, m + months, Math.min(d, lastDay));
}

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export default function VisaoGeral() {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const YEARS = useMemo(() => {
    const now = new Date();
    return [now.getFullYear(), now.getFullYear() + 1];
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao buscar transações:", error);
        return;
      }
      setTransacoes((data || []) as Transacao[]);
    })();
  }, [user]);

  const mapa = useMemo(() => {
    const result: Record<string, ResumoMes[]> = {};

    const origens: Array<Transacao["origem"]> = ["pessoal", "empresarial"];
    for (const origem of origens) {
      for (const ano of YEARS) {
        result[`${origem}-${ano}`] = Array.from({ length: 12 }, () => ({
          entradas: 0,
          saidas: 0,
          saldo: 0,
        }));
      }
    }

    transacoes.forEach((t) => {
      const baseDate = new Date(t.data || t.created_at);

      // adiciona transação no mês correspondente e, se for fixa, repete nos próximos meses
      for (let i = 0; i < 12; i++) {
        const repeatDate = addMonthsSafe(baseDate, i);
        const ano = repeatDate.getFullYear();
        if (!YEARS.includes(ano)) continue;
        const mesIndex = repeatDate.getMonth();
        const key = `${t.origem}-${ano}`;
        const entry = result[key]?.[mesIndex];
        if (!entry) continue;

        if (t.tipo === "entrada") entry.entradas += Number(t.valor);
        else entry.saidas += Number(t.valor);

        if (!t.fixo) break; // se não for fixo, só adiciona no mês original
      }
    });

    // calcula saldo
    for (const key in result) {
      result[key] = result[key].map((m) => ({
        ...m,
        saldo: m.entradas - m.saidas,
      }));
    }

    return result;
  }, [transacoes, YEARS]);

  const renderTabela = (meses: ResumoMes[], titulo: string) => (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-center">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead className="text-green-600">Entradas</TableHead>
              <TableHead className="text-red-600">Saídas</TableHead>
              <TableHead className="text-blue-600">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MESES.map((nome, i) => (
              <TableRow key={i}>
                <TableCell>{nome}</TableCell>
                <TableCell className="text-green-600">
                  {formatCurrency(meses[i]?.entradas || 0)}
                </TableCell>
                <TableCell className="text-red-600">
                  {formatCurrency(meses[i]?.saidas || 0)}
                </TableCell>
                <TableCell
                  className={`${
                    (meses[i]?.saldo || 0) >= 0
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(meses[i]?.saldo || 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-10">
      {YEARS.map((ano) => (
        <div key={ano}>
          <h2 className="text-xl font-semibold text-center mb-4">{ano}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderTabela(mapa[`pessoal-${ano}`] || [], "FINANÇAS PESSOAIS")}
            {renderTabela(mapa[`empresarial-${ano}`] || [], "EMPRESA")}
          </div>
          <Separator className="my-6" />
        </div>
      ))}
    </div>
  );
}
