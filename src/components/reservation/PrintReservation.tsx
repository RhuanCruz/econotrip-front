
import React from "react";
import { Button } from "@/components/ui-custom/Button";
import { Printer, Share, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReservationData {
  passenger: string;
  flight: string;
  date: string;
  seat: string;
  locator: string;
  departure: string;
  arrival: string;
}

interface PrintReservationProps {
  reservationData: ReservationData;
}

export function PrintReservation({ reservationData }: PrintReservationProps) {
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Reserva ECONOTRIP - ${reservationData.locator}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #5FB4E8; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #5FB4E8; margin-bottom: 10px; }
            .subtitle { color: #F39C12; font-size: 16px; }
            .reservation-details { margin: 20px 0; }
            .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #333; }
            .value { color: #666; }
            .important { background: #f8f9fa; padding: 15px; border-left: 4px solid #5FB4E8; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ECONOTRIP</div>
            <div class="subtitle">PrimeVoyage</div>
            <h2>Confirmação de Reserva</h2>
          </div>
          
          <div class="reservation-details">
            <div class="detail-item">
              <span class="label">Localizador:</span>
              <span class="value">${reservationData.locator}</span>
            </div>
            <div class="detail-item">
              <span class="label">Passageiro:</span>
              <span class="value">${reservationData.passenger}</span>
            </div>
            <div class="detail-item">
              <span class="label">Voo:</span>
              <span class="value">${reservationData.flight}</span>
            </div>
            <div class="detail-item">
              <span class="label">Data e Horário:</span>
              <span class="value">${reservationData.date}</span>
            </div>
            <div class="detail-item">
              <span class="label">Assento:</span>
              <span class="value">${reservationData.seat}</span>
            </div>
            <div class="detail-item">
              <span class="label">Embarque:</span>
              <span class="value">${reservationData.departure}</span>
            </div>
            <div class="detail-item">
              <span class="label">Desembarque:</span>
              <span class="value">${reservationData.arrival}</span>
            </div>
          </div>
          
          <div class="important">
            <h3>Informações Importantes:</h3>
            <ul>
              <li>Apresente-se no aeroporto com 2 horas de antecedência para voos nacionais</li>
              <li>Leve um documento oficial com foto (RG ou CNH)</li>
              <li>Guarde este comprovante até o final da viagem</li>
              <li>Em caso de dúvidas, ligue para 0800 123 456</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>ECONOTRIP - Conectando pessoas, cuidando do futuro</p>
            <p>Data de impressão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }

    toast({
      title: "Reserva enviada para impressão",
      description: "Sua reserva foi formatada para impressão.",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Reserva ECONOTRIP - ${reservationData.locator}`,
      text: `Minha reserva: ${reservationData.flight} em ${reservationData.date}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Reserva compartilhada",
          description: "Sua reserva foi compartilhada com sucesso.",
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Link copiado",
        description: "O link da reserva foi copiado para a área de transferência.",
      });
    }
  };

  const handleDownload = () => {
    const content = `
ECONOTRIP - PrimeVoyage
Confirmação de Reserva

Localizador: ${reservationData.locator}
Passageiro: ${reservationData.passenger}
Voo: ${reservationData.flight}
Data: ${reservationData.date}
Assento: ${reservationData.seat}
Embarque: ${reservationData.departure}
Desembarque: ${reservationData.arrival}

Informações importantes:
- Apresente-se no aeroporto com 2 horas de antecedência
- Leve documento oficial com foto
- Em caso de dúvidas: 0800 123 456

Data de geração: ${new Date().toLocaleDateString('pt-BR')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reserva-${reservationData.locator}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Reserva baixada",
      description: "Arquivo de texto salvo com os detalhes da reserva.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="primary"
        size="lg"
        icon={Printer}
        onClick={handlePrint}
        className="flex-1"
        aria-label="Imprimir reserva"
      >
        Imprimir
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        icon={Share}
        onClick={handleShare}
        className="flex-1"
        aria-label="Compartilhar reserva"
      >
        Compartilhar
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        icon={Download}
        onClick={handleDownload}
        className="flex-1"
        aria-label="Baixar como arquivo"
      >
        Baixar
      </Button>
    </div>
  );
}
