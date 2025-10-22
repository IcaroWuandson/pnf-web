"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Transaction = {
  id: string;
  nome: string;
  valor: number;
  created_at: string;
  fixo: boolean;
  categoria: string;
  tipo: "entrada" | "saida";
  origem: "pessoal" | "empresarial";
};

export default function TableDespesa() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    // 🔹 Busca paginada
    const { data, error, count } = await supabase
      .from("transacoes")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Erro ao carregar transações:", error);
      toast.error("Erro ao carregar transações!");
    } else {
      setTransactions(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, page]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("transacoes").delete().eq("id", id);

    if (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir transação!");
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transação removida com sucesso!");
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="mt-6 border rounded-md">
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Recorrência</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                Carregando transações...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                Nenhuma transação adicionada ainda.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.nome}</TableCell>
                <TableCell>
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>{t.categoria}</TableCell>
                <TableCell
                  className={
                    t.tipo === "entrada" ? "text-green-600" : "text-red-600"
                  }
                >
                  {t.tipo === "entrada" ? "Entrada" : "Saída"}
                </TableCell>
                <TableCell className="capitalize">{t.origem}</TableCell>
                <TableCell>
                  {new Date(t.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>{t.fixo ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 🔹 Paginação */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages || 1}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
