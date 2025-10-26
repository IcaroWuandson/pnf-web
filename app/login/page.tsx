import { Button } from "@/components/ui/button";

import LoginForm from "./_componentes/login-form";
import Link from "next/link";
import Logo from "./_componentes/logo";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="px-2 py-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-3xl font-bold leading-tight">
                Coloque suas finanças pessoais e profissionais em ordem com o{" "}
                <span className="bg-gradient-hero bg-clip-text text-[#24b3a9]">
                  Painel Financeiro Inteligente
                </span>
              </h1>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ainda não conhece o Painel Financeiro Inteligente?
              </p>
              <Link href="#">
                <Button
                  variant="outline"
                  className="border-primary/20 hover:border-primary hover:bg-primary/5"
                >
                  Saiba mais
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-8 order-1 lg:order-2">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
