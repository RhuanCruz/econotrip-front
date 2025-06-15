import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { toast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { UserService } from "@/api/user/UserService";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simple CPF formatter (XXX.XXX.XXX-XX)
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "").substring(0, 11);
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.substring(0, 3)}.${numbers.substring(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6)}`;
    } else {
      return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setFormData((prev) => ({ ...prev, cpf: formattedCPF }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas estão iguais.",
      });
      setLoading(false);
      return;
    }
    
    await UserService.create({
      fullname: formData.name,
      birthdate: formData.birthdate,
      email: formData.email,
      password: formData.password,
      cpf: formData.cpf.replace(/[.-]/g, "")
    }).then(() => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao ECONOTRIP!",
      });
      navigate("/login");
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Por favor, preencha todos os campos corretamente.",
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="font-museomoderno font-bold text-4xl text-econotrip-blue">
            ECONOTRIP
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-econotrip-blue mb-8 text-center font-museomoderno">
          Criar nova conta
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <Input
            type="text"
            name="name"
            label="Nome completo"
            placeholder="Digite seu nome completo"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Digite seu nome completo"
          />

          <Input
            type="email"
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Digite seu endereço de e-mail"
          />

          <Input
            type="date"
            name="birthdate"
            label="Data de nascimento"
            icon={Calendar}
            value={formData.birthdate}
            onChange={handleChange}
            required
            aria-label="Selecione sua data de nascimento"
          />

          <Input
            type="text"
            name="cpf"
            label="CPF"
            placeholder="XXX.XXX.XXX-XX"
            icon={CreditCard}
            value={formData.cpf}
            onChange={handleCPFChange}
            required
            aria-label="Digite seu CPF"
          />

          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="Crie uma senha segura"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
            aria-label="Crie uma senha"
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="Digite novamente sua senha"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-label="Confirme sua senha"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={CheckCircle}
            loading={loading}
            className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] rounded-full h-14 mt-8"
          >
            Criar conta
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg underline underline-offset-2 touch-target"
            aria-label="Ir para a página de login"
          >
            Já tem conta? Fazer login
          </button>
        </div>
      </div>

      {/* Help button */}
      <AssistButton tooltipText="Ajuda com o cadastro" />
    </div>
  );
}
