"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  PieChart,
  Pie,
} from "recharts";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { MonthCarousel } from "@/components/seletor-mes";

export default function DetalheCategorias() {
  const { user } = useAuth();

  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!user) return;

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

    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", inicioMes)
        .lt("created_at", fimMes)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao buscar transações:", error);
        setLoading(false);
        return;
      }

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
      setLoading(false);
    };

    fetchData();
  }, [user, selectedDate]);

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
      <MonthCarousel
        onMonthSelect={(date) => setSelectedDate(date)}
        defaultSelectedMonth={new Date()}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {loading || pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[300px] gap-4">
              <Skeleton className="w-[200px] h-[200px] rounded-full" />
              <Skeleton className="w-[150px] h-4" />
              <Skeleton className="w-[100px] h-4" />
              <p>Sem registros financeiros</p>
            </div>
          ) : (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataComPercentual}
                    dataKey="valor"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelLine={false}
                    label={({ payload }) =>
                      `${payload.categoria}: ${payload.percentual}%`
                    }
                  >
                    {dataComPercentual.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
