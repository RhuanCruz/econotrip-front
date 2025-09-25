import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database, Share2, Bell } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion } from "framer-motion";

export default function PrivacyPolicyScreen() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: "Coleta de Informações",
      content: "Coletamos informações que você nos fornece diretamente, como nome, e-mail, CPF e data de nascimento durante o cadastro. Também coletamos dados de uso da plataforma para melhorar nossos serviços."
    },
    {
      icon: Database,
      title: "Uso das Informações",
      content: "Utilizamos suas informações para processar reservas, enviar confirmações, personalizar sua experiência e comunicar ofertas relevantes. Seus dados são essenciais para o funcionamento do serviço."
    },
    {
      icon: Share2,
      title: "Compartilhamento",
      content: "Compartilhamos informações apenas com parceiros essenciais para completar suas reservas (companhias aéreas, hotéis). Nunca vendemos seus dados pessoais para terceiros."
    },
    {
      icon: Lock,
      title: "Segurança",
      content: "Implementamos medidas de segurança robustas incluindo criptografia, autenticação segura e monitoramento contínuo para proteger suas informações pessoais."
    },
    {
      icon: Bell,
      title: "Comunicações",
      content: "Enviamos e-mails sobre suas reservas, atualizações de voos e ofertas personalizadas. Você pode gerenciar suas preferências de comunicação a qualquer momento."
    },
    {
      icon: Shield,
      title: "Seus Direitos",
      content: "Você tem direito de acessar, corrigir, excluir ou transferir seus dados. Entre em contato conosco para exercer esses direitos conforme a LGPD."
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
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue mb-2">
            Política de Privacidade
          </h1>
          <p className="text-gray-600 text-lg">
            Última atualização: 10 de julho de 2025
          </p>
          <p className="text-gray-700 mt-4">
            No ECONOTRIP, valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais. 
            Esta política explica como coletamos, usamos e protegemos seus dados.
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

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <h2 className="text-xl font-bold text-econotrip-blue mb-4">
              Entre em Contato
            </h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre esta política de privacidade ou quiser exercer seus direitos sobre dados pessoais, entre em contato conosco:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>E-mail:</strong> privacidade@econotrip.com</p>
              <p><strong>Telefone:</strong> (11) 0000-0000</p>
              <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
