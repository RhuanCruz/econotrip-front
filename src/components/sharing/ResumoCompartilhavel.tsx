
import React from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Share, Mail, MessageCircle, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DadosViagem {
  passageiro: string;
  voo: string;
  data: string;
  localizador: string;
  destino: string;
  hotel?: string;
}

interface ResumoCompartilhavelProps {
  dadosViagem: DadosViagem;
}

export function ResumoCompartilhavel({ dadosViagem }: ResumoCompartilhavelProps) {
  const handleWhatsApp = () => {
    const mensagem = `🛫 Minha viagem confirmada com ECONOTRIP!

✈️ Voo: ${dadosViagem.voo}
📅 Data: ${dadosViagem.data}
📍 Destino: ${dadosViagem.destino}
🔖 Localizador: ${dadosViagem.localizador}
${dadosViagem.hotel ? `🏨 Hotel: ${dadosViagem.hotel}` : ''}

Estou muito animado(a) para esta viagem! 😊`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    
    toast({
      title: "Compartilhado no WhatsApp",
      description: "Sua viagem foi compartilhada com sucesso!",
    });
  };

  const handleEmail = () => {
    const assunto = `Minha viagem confirmada - ${dadosViagem.destino}`;
    const corpo = `Olá!

Quero compartilhar com vocês que minha viagem está confirmada:

Passageiro: ${dadosViagem.passageiro}
Voo: ${dadosViagem.voo}
Data: ${dadosViagem.data}
Destino: ${dadosViagem.destino}
Localizador: ${dadosViagem.localizador}
${dadosViagem.hotel ? `Hotel: ${dadosViagem.hotel}` : ''}

Reserva feita através da ECONOTRIP - PrimeVoyage.

Um abraço!`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailtoUrl;

    toast({
      title: "E-mail preparado",
      description: "Seu cliente de e-mail foi aberto com os dados da viagem.",
    });
  };

  const handleCopyLink = () => {
    const resumo = `${dadosViagem.passageiro} - Viagem para ${dadosViagem.destino} em ${dadosViagem.data} - Localizador: ${dadosViagem.localizador}`;
    navigator.clipboard.writeText(resumo);
    
    toast({
      title: "Resumo copiado",
      description: "Os dados da viagem foram copiados para a área de transferência.",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Share className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue">
          Compartilhar esta viagem
        </h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-econotrip-blue mb-2">Resumo da viagem:</h3>
        <div className="space-y-1 text-gray-700">
          <p><strong>Passageiro:</strong> {dadosViagem.passageiro}</p>
          <p><strong>Voo:</strong> {dadosViagem.voo}</p>
          <p><strong>Data:</strong> {dadosViagem.data}</p>
          <p><strong>Destino:</strong> {dadosViagem.destino}</p>
          <p><strong>Localizador:</strong> {dadosViagem.localizador}</p>
          {dadosViagem.hotel && <p><strong>Hotel:</strong> {dadosViagem.hotel}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          icon={MessageCircle}
          onClick={handleWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Compartilhar no WhatsApp
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={Mail}
          onClick={handleEmail}
          className="w-full"
        >
          Enviar por e-mail
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={Link2}
          onClick={handleCopyLink}
          className="w-full"
        >
          Copiar resumo
        </Button>
      </div>
    </Card>
  );
}
