import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CreditCard, Plane, AlertCircle, Scale, Users } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion } from "framer-motion";

export default function TermsOfServiceScreen() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Users,
      title: "Aceitação dos Termos",
      content: "Ao usar o ECONOTRIP, você concorda com estes termos de serviço. Se não concordar, não utilize nossos serviços. Estes termos podem ser atualizados periodicamente."
    },
    {
      icon: Plane,
      title: "Serviços Oferecidos",
      content: "O ECONOTRIP é uma plataforma de busca e comparação de voos. Facilitamos a conexão entre você e companhias aéreas, mas não somos uma companhia aérea nem agência de viagens."
    },
    {
      icon: CreditCard,
      title: "Pagamentos e Preços",
      content: "Os preços são fornecidos pelas companhias aéreas e podem variar. Você será direcionado para completar a compra no site da companhia aérea ou parceiro autorizado."
    },
    {
      icon: AlertCircle,
      title: "Responsabilidades",
      content: "O ECONOTRIP não se responsabiliza por alterações de voos, cancelamentos ou problemas com as companhias aéreas. Nossa responsabilidade se limita à plataforma de busca."
    },
    {
      icon: FileText,
      title: "Conta do Usuário",
      content: "Você é responsável por manter suas informações de conta atualizadas e proteger sua senha. Use nossos serviços apenas para fins legais e pessoais."
    },
    {
      icon: Scale,
      title: "Limitações e Lei Aplicável",
      content: "Estes termos são regidos pela lei brasileira. Disputas serão resolvidas nos tribunais de São Paulo, SP. Nossa responsabilidade é limitada conforme permitido por lei."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              className="text-econotrip-blue hover:bg-econotrip-blue/10 touch-target"
            >
              Voltar
            </Button>
            <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue mb-2">
            Termos de Serviço
          </h1>
          <p className="text-gray-600 text-lg">
            Última atualização: 10 de julho de 2025
          </p>
          <p className="text-gray-700 mt-4">
            Bem-vindo ao ECONOTRIP! Estes termos de serviço estabelecem as regras para o uso da nossa plataforma. 
            Leia atentamente antes de usar nossos serviços.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue/10 to-econotrip-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-econotrip-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-econotrip-blue mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-amber-800 mb-3">
                  Aviso Importante
                </h2>
                <p className="text-amber-700 leading-relaxed">
                  O ECONOTRIP é uma plataforma de comparação. Todas as reservas e transações 
                  são processadas diretamente pelas companhias aéreas ou seus parceiros autorizados. 
                  Sempre verifique os termos específicos da companhia aérea antes de finalizar sua compra.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <h2 className="text-xl font-bold text-econotrip-blue mb-4">
              Dúvidas sobre os Termos?
            </h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre estes termos de serviço, entre em contato conosco:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>E-mail:</strong> suporte@econotrip.com</p>
              <p><strong>Telefone:</strong> (11) 0000-0000</p>
              <p><strong>Horário:</strong> Segunda a sexta, 8h às 18h</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
