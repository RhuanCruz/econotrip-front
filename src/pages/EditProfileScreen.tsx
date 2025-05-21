import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui-custom/Input";
import { Button } from "@/components/ui-custom/Button";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { toast } from "@/hooks/use-toast";
import { 
  User, Mail, Calendar, Lock, KeyRound, CheckCircle, ArrowLeft
} from "lucide-react";
import { AssistButton } from "@/components/ui-custom/AssistButton";

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "Maria Oliveira",
    email: "maria@exemplo.com",
    birthDate: "1958-05-12",
    cpf: "123.456.789-00",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
        variant: "default"
      });

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/perfil");
      }, 2000);
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/perfil");
  };

  return (
    <div className="max-w-2xl mx-auto py-6 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={handleCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
          aria-label="Voltar para perfil"
        >
          <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
        </button>
        <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
          Editar Perfil
        </h1>
      </div>

      {showSuccess ? (
        <AlertBox
          type="success"
          title="Perfil atualizado com sucesso!"
          icon={CheckCircle}
          className="mb-6"
        >
          <p>
            Suas informações pessoais foram atualizadas. 
            Redirecionando para a página de perfil...
          </p>
        </AlertBox>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="fullName"
            label="Nome Completo"
            icon={User}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
            required
            aria-label="Nome completo"
          />

          <Input
            type="email"
            name="email"
            label="E-mail"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu e-mail"
            required
            aria-label="E-mail"
          />

          <Input
            type="date"
            name="birthDate"
            label="Data de Nascimento"
            icon={Calendar}
            value={formData.birthDate}
            onChange={handleChange}
            required
            className="text-base"
            aria-label="Data de nascimento"
          />

          <Input
            type="text"
            name="cpf"
            label="CPF"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            required
            aria-label="CPF"
            className="font-mono"
          />

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-museomoderno font-medium text-econotrip-blue mb-4">
              Alterar Senha <span className="text-gray-500 text-base">(opcional)</span>
            </h2>
            
            <div className="space-y-6">
              <Input
                type="password"
                name="newPassword"
                label="Nova Senha"
                icon={Lock}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Digite sua nova senha"
                aria-label="Nova senha"
              />

              <Input
                type="password"
                name="confirmPassword"
                label="Confirmar Nova Senha"
                icon={KeyRound}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
                aria-label="Confirmar nova senha"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              icon={CheckCircle}
              className="w-full md:w-2/3 bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] rounded-full h-14"
            >
              Salvar Alterações
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleCancel}
              className="w-full md:w-1/3 rounded-full h-14"
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
      
      {/* Use our new AssistButton component instead of inline implementation */}
      <AssistButton tooltipText="Ajuda com seus dados" />
    </div>
  );
}
