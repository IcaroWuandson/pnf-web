"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Previsao = {
  dia: string;
  entrada: number;
  saida: number;
};

export default function Page() {
  const { user } = useAuth();
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }); // ✅ ordena do mais antigo para o mais recente

      if (error) {
        console.error("Erro ao buscar transações:", error);
        return;
      }

      const totalEntradas = data
        .filter((t) => t.tipo === "entrada")
        .reduce((acc, t) => acc + Number(t.valor), 0);

      const totalSaidas = data
        .filter((t) => t.tipo === "saida")
        .reduce((acc, t) => acc + Number(t.valor), 0);

      setEntradas(totalEntradas);
      setSaidas(totalSaidas);
      setSaldo(totalEntradas - totalSaidas);

      const groupedByMonth = data.reduce((acc: any, t) => {
        const mes = new Date(t.created_at)
          .toLocaleString("pt-BR", { month: "short" })
          .toUpperCase();
        if (!acc[mes]) acc[mes] = { mes, entrada: 0, saida: 0 };
        if (t.tipo === "entrada") acc[mes].entrada += Number(t.valor);
        if (t.tipo === "saida") acc[mes].saida += Number(t.valor);
        return acc;
      }, {});

      const chartArray = Object.values(groupedByMonth).sort(
        (a: any, b: any) =>
          new Date(`2025 ${a.mes} 1`).getMonth() -
          new Date(`2025 ${b.mes} 1`).getMonth()
      );
      setChartData(chartArray);

      const categorias = data
        .filter((t) => t.tipo === "saida")
        .reduce((acc: any, t) => {
          acc[t.categoria] = (acc[t.categoria] || 0) + Number(t.valor);
          return acc;
        }, {});

      const pieArray = Object.keys(categorias).map((cat) => ({
        categoria: cat,
        valor: categorias[cat],
      }));
      setPieData(pieArray);

      const hoje = new Date();
      const daqui30 = new Date();
      daqui30.setDate(hoje.getDate() + 30);

      const fixos = data.filter((t) => t.fixo === true);
      const variaveis = data.filter(
        (t) =>
          new Date(t.data) >= hoje && new Date(t.data) <= daqui30 && !t.fixo
      );

      const todasPrevisoes = [...variaveis];

      fixos.forEach((t) => {
        let dataAtual = new Date(hoje);
        while (dataAtual <= daqui30) {
          todasPrevisoes.push({
            ...t,
            data: new Date(dataAtual),
          });
          dataAtual.setDate(dataAtual.getDate() + 30);
        }
      });

      const agrupado = todasPrevisoes.reduce((acc: any, t) => {
        const dia = new Date(t.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        });
        if (!acc[dia]) acc[dia] = { dia, entrada: 0, saida: 0 };
        if (t.tipo === "entrada") acc[dia].entrada += Number(t.valor);
        if (t.tipo === "saida") acc[dia].saida += Number(t.valor);
        return acc;
      }, {});

      const previsaoArray = Object.values(
        agrupado as Record<string, Previsao>
      ).sort((a, b) => {
        const dataA = new Date(`2025 ${a.dia}`);
        const dataB = new Date(`2025 ${b.dia}`);
        return dataA.getTime() - dataB.getTime();
      });
      setForecastData(previsaoArray);
    };

    fetchData();
  }, [user]);

  const COLORS = [
    "#0ea5e9",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#eab308",
    "#6366f1",
    "#ec4899",
    "#84cc16",
  ];

  const total = pieData.reduce((acc, curr) => acc + curr.valor, 0);
  const dataComPercentual = pieData.map((item) => ({
    ...item,
    percentual: ((item.valor / total) * 100).toFixed(1),
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {entradas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {saidas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                saldo >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {saldo.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                entrada: { label: "Entradas", color: "#22c55e" },
                saida: { label: "Saídas", color: "#ef4444" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <Tooltip />
                  <Bar dataKey="entrada" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saida" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previsão dos próximos 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                entrada: { label: "Entradas", color: "#16a34a" },
                saida: { label: "Saídas", color: "#dc2626" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <Tooltip />
                  <Bar dataKey="entrada" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saida" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComPercentual}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="categoria" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`,
                    name,
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="valor"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Valor gasto"
                >
                  {dataComPercentual.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
