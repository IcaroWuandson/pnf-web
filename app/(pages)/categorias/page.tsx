
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";

type Category = {
  nome: string;
  descricao: string;
  tipo: "entrada" | "saida" | "ambos";
  ambito?: "pessoal" | "empresarial" | "ambos";
};

export default function Page() {
  const categorias: Category[] = [
    {
      nome: "Pró-labore",
      descricao:
        "Remuneração fixa retirada pelo empreendedor como 'salário' mensal, separada dos lucros da empresa.",
      tipo: "entrada",
      ambito: "empresarial",
    },
    {
      nome: "Recebimento de cliente",
      descricao:
        "Entradas de dinheiro relacionadas à prestação de serviços ou vendas realizadas pela empresa.",
      tipo: "entrada",
      ambito: "empresarial",
    },
    {
      nome: "Aluguel/Contas fixas",
      descricao:
        "Despesas com aluguel, condomínio, IPTU, energia, água, entre outros.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Caixa reserva",
      descricao: "Valor separado para emergências ou imprevistos.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Mobilidade",
      descricao:
        "Custos de deslocamento com gasolina, uber, ônibus, ou outros.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Assinaturas",
      descricao:
        "Gastos com internet, plataformas, softwares, aplicativos ou outros serviços recorrentes.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Marketing",
      descricao:
        "Investimentos em divulgação, anúncios, redes sociais e materiais promocionais.",
      tipo: "saida",
      ambito: "empresarial",
    },
    {
      nome: "Crescimento",
      descricao:
        "Gastos com melhorias, novos projetos para crescimento do negócio ou capacitação.",
      tipo: "saida",
      ambito: "empresarial",
    },
    {
      nome: "Equipe",
      descricao:
        "Salários, encargos ou pagamento de colaboradores fixos ou terceirizados.",
      tipo: "saida",
      ambito: "empresarial",
    },
    {
      nome: "Fornecedores",
      descricao: "Compras de mercadorias, embalagens e insumos.",
      tipo: "saida",
      ambito: "empresarial",
    },
    {
      nome: "Impostos/taxas",
      descricao:
        "Pagamentos de tributos, taxas de serviços ou tarifas bancárias.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Mercado",
      descricao: "Todas as compras realizadas em supermercados.",
      tipo: "saida",
      ambito: "pessoal",
    },
    {
      nome: "Saúde e beleza",
      descricao:
        "Despesas com farmácia, salão de beleza, procedimentos estéticos, barbeiro, entre outros.",
      tipo: "saida",
      ambito: "pessoal",
    },
    {
      nome: "Lazer",
      descricao:
        "Despesas com passeios, viagens, restaurantes, cinema, entre outros.",
      tipo: "saida",
      ambito: "pessoal",
    },
    {
      nome: "Vestuário",
      descricao:
        "Compras em lojas de roupas, calçados, acessórios, entre outros.",
      tipo: "saida",
      ambito: "pessoal",
    },
    {
      nome: "Pet",
      descricao: "Alimentação, veterinária, higiene, brinquedos, entre outros.",
      tipo: "saida",
      ambito: "pessoal",
    },
    {
      nome: "Seguro",
      descricao:
        "Qualquer tipo de proteção contratual, como seguros de saúde, de vida, automóvel, e outros.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Despesas eventuais",
      descricao:
        "Custos inesperados ou pontuais que não se repetem com frequência.",
      tipo: "saida",
      ambito: "ambos",
    },
    {
      nome: "Outros",
      descricao: "Despesas que não se encaixam nas categorias principais.",
      tipo: "saida",
      ambito: "ambos",
    },
  ];

  const tiposDespesa = [
    {
      nome: "Despesa Fixa",
      descricao:
        "É um gasto que se repete todo mês, com valor previsível, como aluguel ou salário.",
    },
    {
      nome: "Despesa Variável",
      descricao:
        "É um gasto que muda de valor ou frequência, como compras eventuais ou combustível.",
    },
  ];

  const categoriasEntrada = categorias.filter((c) => c.tipo === "entrada");
  const categoriasSaida = categorias.filter((c) => c.tipo === "saida");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Despesa</CardTitle>
          <CardDescription>
            Compreenda a diferença entre despesas fixas e variáveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tiposDespesa.map((tipo) => (
            <div
              key={tipo.nome}
              className="flex gap-4 items-start p-4 rounded-lg border bg-card"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{tipo.nome}</h3>
                <p className="text-muted-foreground">{tipo.descricao}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categorias de Entrada */}
      <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle className="text-success">Categorias de Entrada</CardTitle>
          <CardDescription>Receitas e valores recebidos</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {categoriasEntrada.map((categoria) => (
            <div
              key={categoria.nome}
              className="flex gap-4 items-start p-4 rounded-lg border bg-card"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{categoria.nome}</h3>
                  {categoria.ambito && categoria.ambito !== "ambos" && (
                    <Badge variant="outline" className="gap-1">
                      {categoria.ambito === "empresarial" ? (
                        <>
                          <Building2 className="h-3 w-3" />
                          Empresarial
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          Pessoal
                        </>
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {categoria.descricao}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categorias de Saída */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">
            Categorias de Saída
          </CardTitle>
          <CardDescription>Despesas e gastos realizados</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {categoriasSaida.map((categoria) => (
            <div
              key={categoria.nome}
              className="flex gap-4 items-start p-4 rounded-lg border bg-card"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{categoria.nome}</h3>
                  {categoria.ambito && categoria.ambito !== "ambos" && (
                    <Badge variant="outline" className="gap-1">
                      {categoria.ambito === "empresarial" ? (
                        <>
                          <Building2 className="h-3 w-3" />
                          Empresarial
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          Pessoal
                        </>
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {categoria.descricao}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
