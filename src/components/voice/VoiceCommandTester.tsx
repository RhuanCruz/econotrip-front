import React, { useState } from 'react';
import { Card } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui-custom/Input';
import { useNavigate } from 'react-router-dom';
import { parseFlightCommand } from '@/utils/voiceCommandParser';

export const VoiceCommandTester: React.FC = () => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const testCommand = () => {
    const text = command.toLowerCase();
    const parsed = parseFlightCommand(text);

    setResult(parsed);

    if (parsed.confidence >= 50 && parsed.origem && parsed.destino && parsed.dataIda) {
      const searchParams = {
        origem: parsed.origem,
        destino: parsed.destino,
        dataIda: parsed.dataIda,
        dataVolta: parsed.dataVolta,
        passageiros: {
          adults: parsed.passageiros || 1,
          children: 0,
          infants: 0
        },
        classe: parsed.classe || 'economica',
      };

      console.log('Navigating with:', searchParams);
      setTimeout(() => {
        navigate('/busca-voos', { state: { searchParams } });
      }, 1000);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6 m-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Voice Command Tester</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Comando de Voz</label>
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Ex: buscar voo de são paulo para rio de janeiro amanhã com 2 passageiros"
            className="w-full"
            onKeyPress={(e) => e.key === 'Enter' && testCommand()}
          />
        </div>

        <Button onClick={testCommand} variant="primary" className="w-full">
          Testar Comando
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Resultado do Parsing</h3>
                <span className={`text-xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence}% confiança
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Origem:</span>
                  <p className="font-semibold">{result.origem || '❌ Não detectado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Destino:</span>
                  <p className="font-semibold">{result.destino || '❌ Não detectado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Data de Ida:</span>
                  <p className="font-semibold">{result.dataIda || '❌ Não detectado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Data de Volta:</span>
                  <p className="font-semibold">{result.dataVolta || 'Não especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Passageiros:</span>
                  <p className="font-semibold">{result.passageiros || 1}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Classe:</span>
                  <p className="font-semibold capitalize">{result.classe}</p>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Erros:</h4>
                  <ul className="list-disc list-inside text-red-700 text-sm">
                    {result.errors.map((error: string, i: number) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">JSON Completo:</h4>
              <pre className="text-xs overflow-auto bg-white p-3 rounded border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600 space-y-3">
          <h3 className="font-bold text-base text-gray-900 mb-2">Exemplos de Comandos:</h3>

          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" onClick={() => setCommand("buscar voo de são paulo para rio de janeiro amanhã")}>
              <code className="text-sm">buscar voo de são paulo para rio de janeiro amanhã</code>
            </div>
            <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" onClick={() => setCommand("quero viajar de brasília para miami hoje com 3 passageiros")}>
              <code className="text-sm">quero viajar de brasília para miami hoje com 3 passageiros</code>
            </div>
            <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" onClick={() => setCommand("procurar voo de sp para paris dia 15 de março classe executiva")}>
              <code className="text-sm">procurar voo de sp para paris dia 15 de março classe executiva</code>
            </div>
            <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" onClick={() => setCommand("passagem de curitiba para lisboa próxima semana")}>
              <code className="text-sm">passagem de curitiba para lisboa próxima semana</code>
            </div>
            <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" onClick={() => setCommand("voar de fortaleza para salvador amanhã ida e volta")}>
              <code className="text-sm">voar de fortaleza para salvador amanhã ida e volta</code>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
