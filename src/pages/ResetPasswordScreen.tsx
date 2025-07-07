import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { toast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { UserService } from "@/api/user/UserService";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Password validation
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const canSubmit = isPasswordValid && passwordsMatch && !loading;

  useEffect(() => {
    const validateToken = async () => {
      console.log(token);
      if (!token) {
        toast({
          variant: "destructive",
          title: "Token inválido",
          description: "O link de redefinição de senha é inválido ou expirou.",
        });
        setValidatingToken(false);
        return;
      }

      setTokenValid(true);
      setValidatingToken(false);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit || !token) return;

    setLoading(true);
    
    try {
      await UserService.resetPassword({
        token,
        password,
        confirmPassword,
      });
      
      setResetSuccess(true);
      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi alterada. Você será redirecionado para o login.",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: error instanceof Error ? error.message : "Por favor, tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-econotrip-blue mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-manrope">
            Validando link de recuperação...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <div className="font-museomoderno font-bold text-4xl text-econotrip-blue">
              ECONOTRIP
            </div>
          </div>

          <AlertBox
            type="error"
            title="Link inválido ou expirado"
            className="mb-8"
          >
            <p>
              O link de redefinição de senha é inválido ou já expirou. 
              Por favor, solicite um novo link de recuperação.
            </p>
          </AlertBox>

          <div className="space-y-4">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => navigate("/recuperar-senha")}
              className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] rounded-full h-14"
            >
              Solicitar Novo Link
            </Button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg underline underline-offset-2 touch-target text-center"
            >
              Voltar para login
            </button>
          </div>
        </div>

        <AssistButton tooltipText="Ajuda com redefinição de senha" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="font-museomoderno font-bold text-4xl text-econotrip-blue">
            ECONOTRIP
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-econotrip-blue mb-4 text-center font-museomoderno">
          Nova Senha
        </h1>
        
        <p className="text-lg text-center text-gray-600 mb-8 font-manrope">
          Digite sua nova senha para acessar sua conta.
        </p>

        {resetSuccess ? (
          <AlertBox
            type="success"
            title="Senha redefinida com sucesso!"
            className="mb-8"
          >
            <div className="space-y-2">
              <p>
                Sua senha foi alterada com sucesso. Você será redirecionado para o login em alguns segundos.
              </p>
              <div className="flex items-center justify-center mt-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </AlertBox>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Digite sua nova senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Criteria */}
            {password && (
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

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                label="Confirmar Nova Senha"
                placeholder="Confirme sua nova senha"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-label="Confirme sua nova senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                {passwordsMatch ? "✓ As senhas coincidem" : "✗ As senhas não coincidem"}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!canSubmit}
              className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] rounded-full h-14 mt-8"
            >
              Redefinir Senha
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg underline underline-offset-2 touch-target"
            aria-label="Voltar para a tela de login"
          >
            Voltar para login
          </button>
        </div>
      </div>

      {/* Help button */}
      <AssistButton tooltipText="Ajuda com redefinição de senha" />
    </div>
  );
}
