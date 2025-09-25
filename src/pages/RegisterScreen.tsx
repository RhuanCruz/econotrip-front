import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { UserService } from "@/api/user/UserService";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    birthdate: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  // Password validation criteria
  const passwordCriteria = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Validate on blur for better UX
    setTimeout(() => {
      let error = "";
      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "confirmPassword":
          error = validateConfirmPassword(formData.password, value);
          break;
      }
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }, 500); // Debounce validation
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

  // Date formatter (DD/MM/YYYY)
  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").substring(0, 8);
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
    } else {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4)}`;
    }
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for date input
  const convertToDateInput = (dateStr: string) => {
    if (dateStr.length === 10) {
      const [day, month, year] = dateStr.split('/');
      if (day && month && year && year.length === 4) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return dateStr;
  };

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return "Nome é obrigatório";
    if (name.trim().length < 6) return "Nome deve ter pelo menos 6 caracteres";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "E-mail é obrigatório";
    
    // More robust email validation regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email.trim())) return "E-mail deve ter um formato válido";
    
    // Additional checks
    if (email.length > 254) return "E-mail muito longo";
    if (email.includes('..')) return "E-mail não pode ter pontos consecutivos";
    if (email.startsWith('.') || email.endsWith('.')) return "E-mail não pode começar ou terminar com ponto";
    
    return "";
  };

  const validateDate = (date: string) => {
    if (!date.trim()) return "Data de nascimento é obrigatória";
    
    // Check DD/MM/YYYY format
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(dateRegex);
    
    if (!match) return "Data deve estar no formato DD/MM/AAAA";
    
    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Basic date validation
    if (monthNum < 1 || monthNum > 12) return "Mês inválido";
    if (dayNum < 1 || dayNum > 31) return "Dia inválido";
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return "Ano inválido";
    
    // Check if date is valid
    const dateObj = new Date(yearNum, monthNum - 1, dayNum);
    if (dateObj.getDate() !== dayNum || dateObj.getMonth() !== monthNum - 1) {
      return "Data inválida";
    }
    
    return "";
  };

  const validateCPF = (cpf: string) => {
    if (!cpf.trim()) return "CPF é obrigatório";
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11) return "CPF deve ter 11 dígitos";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Senha é obrigatória";
    if (!isPasswordValid) return "Senha não atende aos critérios de segurança";
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword.trim()) return "Confirmação de senha é obrigatória";
    if (password !== confirmPassword) return "Senhas não coincidem";
    return "";
  };

  // Check if all form fields are valid
  const isFormValid = () => {
    return (
      formData.name.trim().length >= 6 &&
      formData.email.trim() !== "" &&
      validateEmail(formData.email) === "" &&
      formData.birthdate.trim() !== "" &&
      validateDate(formData.birthdate) === "" &&
      formData.cpf.trim() !== "" &&
      validateCPF(formData.cpf) === "" &&
      isPasswordValid &&
      passwordsMatch &&
      acceptedTerms &&
      // Check that there are no current field errors
      Object.values(fieldErrors).every(error => error === "")
    );
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY for display
  const convertFromDateInput = (dateStr: string) => {
    if (dateStr.includes('-') && dateStr.length === 10) {
      const [year, month, day] = dateStr.split('-');
      if (day && month && year) {
        return `${day}/${month}/${year}`;
      }
    }
    return dateStr;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setFormData((prev) => ({ ...prev, cpf: formattedCPF }));
    
    // Clear error when user starts typing
    if (fieldErrors.cpf) {
      setFieldErrors((prev) => ({ ...prev, cpf: "" }));
    }
    
    // Validate CPF
    setTimeout(() => {
      const error = validateCPF(formattedCPF);
      setFieldErrors((prev) => ({ ...prev, cpf: error }));
    }, 500);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let formattedDate = "";
    
    // If it's a date input (YYYY-MM-DD format), convert to DD/MM/YYYY
    if (e.target.type === 'date') {
      formattedDate = convertFromDateInput(value);
    } else {
      // If it's a text input, apply DD/MM/YYYY mask
      formattedDate = formatDate(value);
    }
    
    setFormData((prev) => ({ ...prev, birthdate: formattedDate }));
    
    // Clear error when user starts typing
    if (fieldErrors.birthdate) {
      setFieldErrors((prev) => ({ ...prev, birthdate: "" }));
    }
    
    // Validate date
    setTimeout(() => {
      const error = validateDate(formattedDate);
      setFieldErrors((prev) => ({ ...prev, birthdate: error }));
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      birthdate: validateDate(formData.birthdate),
      cpf: validateCPF(formData.cpf),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
    };

    setFieldErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== "");
    
    if (hasErrors) {
      toast({
        variant: "destructive",
        title: "Formulário inválido",
        description: "Por favor, corrija os erros nos campos destacados.",
      });
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de serviço e política de privacidade.",
      });
      setLoading(false);
      return;
    }
    
    await UserService.create({
      fullname: formData.name,
      birthdate: convertToDateInput(formData.birthdate), // Convert to YYYY-MM-DD for API
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
        <div className="mb-8 flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/econotrip_logo.png" 
            alt="EconoTrip"
            className="rounded-2xl"
          />
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
            error={fieldErrors.name}
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
            error={fieldErrors.email}
          />

          {/* Date input with responsive type */}
          <div className="block md:hidden">
            <Input
              type="text"
              name="birthdate"
              label="Data de nascimento"
              placeholder="DD/MM/AAAA"
              icon={Calendar}
              value={formData.birthdate}
              onChange={handleDateChange}
              required
              aria-label="Digite sua data de nascimento"
              className="text-base"
              error={fieldErrors.birthdate}
            />
          </div>
          
          <div className="hidden md:block">
            <Input
              type="date"
              name="birthdate"
              label="Data de nascimento"
              icon={Calendar}
              value={convertToDateInput(formData.birthdate)}
              onChange={handleDateChange}
              required
              aria-label="Selecione sua data de nascimento"
              className="text-base"
              error={fieldErrors.birthdate}
            />
          </div>

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
            error={fieldErrors.cpf}
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
            error={fieldErrors.password}
          />

          {/* Password Criteria */}
          {formData.password && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Sua senha deve conter:
              </p>
              <div className="grid grid-cols-1 gap-1 text-sm">
                {Object.entries({
                  "Pelo menos 8 caracteres": passwordCriteria.minLength,
                  "Ao menos uma letra maiúscula": passwordCriteria.hasUpperCase,
                  "Ao menos uma letra minúscula": passwordCriteria.hasLowerCase,
                  "Ao menos um número": passwordCriteria.hasNumber,
                  "Ao menos um caractere especial": passwordCriteria.hasSpecialChar,
                }).map(([criterion, met]) => (
                  <div key={criterion} className={`flex items-center space-x-2 ${met ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`h-2 w-2 rounded-full ${met ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            error={fieldErrors.confirmPassword}
          />

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className={`flex items-center space-x-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
              <div className={`h-2 w-2 rounded-full ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{passwordsMatch ? 'Senhas coincidem' : 'Senhas não coincidem'}</span>
            </div>
          )}

          {/* Checkbox de aceitar termos */}
          <div className="flex items-start space-x-3 py-4">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-1 border-econotrip-primary data-[state=checked]:bg-econotrip-primary data-[state=checked]:border-econotrip-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 leading-relaxed cursor-pointer"
            >
              Eu li e aceito os{" "}
              <button
                type="button"
                onClick={() => navigate("/termos-servico")}
                className="text-econotrip-blue hover:text-econotrip-blue underline font-medium"
              >
                termos de serviço
              </button>{" "}
              e a{" "}
              <button
                type="button"
                onClick={() => navigate("/politica-privacidade")}
                className="text-econotrip-blue hover:text-econotrip-blue underline font-medium"
              >
                política de privacidade
              </button>
              .
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={CheckCircle}
            loading={loading}
            disabled={!isFormValid()}
            className="w-full bg-econotrip-primary rounded-full h-14 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
