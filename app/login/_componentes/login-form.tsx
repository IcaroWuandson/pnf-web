"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordRegisterConfirm, setShowPasswordRegisterConfirm] =
    useState(false);

  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("tab") || "login"
  );

  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Por favor, preencha e-mail e senha.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error("Digite um e-mail válido.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("E-mail ou senha incorretos.");
        } else {
          toast.error(
            error.message || "Erro no login. Verifique suas credenciais."
          );
        }
        console.log(error);
        return;
      }

      if (!data.session) {
        toast.error("Nenhuma sessão encontrada. Tente novamente.");
        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (err) {
      console.error("Erro inesperado no login:", err);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (registerPassword !== confirmPassword) {
      toast("As senhas não coincidem.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
    });

    if (error) {
      console.error("Erro no cadastro:", JSON.stringify(error, null, 2));

      toast.error("Erro no registro. Tente novamente.");
    } else if (data.session) {
      toast.success("Conta criada com sucesso", {
        description: "Basta acessar sua conta agora",
      });
      setActiveTab("login");
    } else {
      toast("Verifique seu e-mail para confirmar o registro.");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col dark:bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" asChild>
            <Link href="?tab=login">Já tem conta? Entre</Link>
          </TabsTrigger>
          <TabsTrigger value="register">
            <Link href="?tab=register">Novo? Registre-se</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="rounded-sm w-full md:w-[30vw] max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Insira suas credenciais para acessar sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin}>
                <div className="space-y-2 mb-3">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-10 h-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 "
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-[#24b3a9] font-bold"
                  type="submit"
                >
                  Entrar
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-sm font-normal text-black dark:text-white text-center">
              <p>
                Esqueceu sua senha?{" "}
                <Link
                  href="/esqueci-senha"
                  className="font-semibold hover:underline"
                >
                  Recupere sua senha aqui
                </Link>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="rounded-sm w-full md:w-[30vw] max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Registre-se</CardTitle>
              <CardDescription>
                Crie uma conta preenchendo as informações abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleRegister}>
                <div className="space-y-2 mb-3">
                  <Label htmlFor="register-email">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2 mb-3">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPasswordRegister ? "text" : "password"}
                      placeholder="********"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pr-10 h-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordRegister((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                      aria-label={
                        showPasswordRegister ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPasswordRegister ? (
                        <EyeOff size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirme sua senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswordRegisterConfirm ? "text" : "password"}
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 h-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordRegisterConfirm((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                      aria-label={
                        showPasswordRegisterConfirm
                          ? "Ocultar senha"
                          : "Mostrar senha"
                      }
                    >
                      {showPasswordRegisterConfirm ? (
                        <EyeOff size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-[#24b3a9] font-bold"
                  type="submit"
                >
                  Registrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
