"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transaction = {
  id: string;
  nome: string;
  valor: number;
  data: string;
  fixo: boolean;
  categoria: string;
  tipo: "entrada" | "saida";
  origem: "pessoal" | "empresarial";
};

const categorias = [
  { id: 1, nome: "Pró-labore" },
  { id: 2, nome: "Recebimento de cliente" },
  { id: 3, nome: "Assinaturas" },
  { id: 4, nome: "Caixa reserva" },
  { id: 5, nome: "Mobilidade" },
  { id: 6, nome: "Marketing" },
  { id: 7, nome: "Crescimento" },
  { id: 8, nome: "Equipe" },
  { id: 9, nome: "Fornecedores" },
  { id: 10, nome: "Impostos/taxas" },
  { id: 11, nome: "Mercado" },
  { id: 12, nome: "Saúde e beleza" },
  { id: 13, nome: "Lazer" },
  { id: 14, nome: "Vestuário" },
  { id: 15, nome: "Pet" },
  { id: 16, nome: "Seguro" },
  { id: 17, nome: "Despesas eventuais" },
  { id: 18, nome: "Outros" },
];

export default function FormTransacao() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [fixo, setFixo] = useState(false);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [origem, setOrigem] = useState<"pessoal" | "empresarial">("pessoal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado para adicionar uma transação.");
      return;
    }

    if (!nome.trim() || !valor || parseFloat(valor) <= 0 || !categoria) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      nome: nome.trim(),
      valor: parseFloat(valor),
      fixo,
      tipo,
      categoria,
      origem,
      data,
    };

    const { error } = await supabase.from("transacoes").insert([
      {
        user_id: user.id,
        nome: newTransaction.nome,
        valor: newTransaction.valor,
        fixo: newTransaction.fixo,
        tipo: newTransaction.tipo,
        categoria: newTransaction.categoria,
        origem: newTransaction.origem,
        created_at: data,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar transação:", error);
      toast.error("Erro ao salvar transação no banco de dados.");
      return;
    }

    setTransactions([newTransaction, ...transactions]);

    setNome("");
    setValor("");
    setFixo(false);
    setCategoria("");
    setTipo("entrada");
    setOrigem("pessoal");
    setData(new Date().toISOString().split("T")[0]);

    toast.success(
      `${tipo === "entrada" ? "Entrada" : "Saída"} adicionada com sucesso!`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            placeholder="Ex: Salário, Aluguel..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        {/* Valor */}
        <div className="space-y-2">
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        {/* Data */}
        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger id="categoria" className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat.id} value={cat.nome}>
                  {cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            value={tipo}
            onValueChange={(value) => setTipo(value as "entrada" | "saida")}
          >
            <SelectTrigger id="tipo" className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origem">Origem</Label>
          <Select
            value={origem}
            onValueChange={(value) =>
              setOrigem(value as "pessoal" | "empresarial")
            }
          >
            <SelectTrigger id="origem" className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoal">Pessoal</SelectItem>
              <SelectItem value="empresarial">Empresarial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="fixo"
          checked={fixo}
          onCheckedChange={(checked) => setFixo(checked as boolean)}
        />
        <Label htmlFor="fixo" className="cursor-pointer">
          Transação fixa (recorrente)
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#24b3a9] font-bold text-white"
      >
        Adicionar movimentação
      </Button>
    </form>
  );
}
