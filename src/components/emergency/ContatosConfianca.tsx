
import React, { useState } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { UserPlus, Phone, Mail, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContatoConfianca {
  id: string;
  nome: string;
  telefone: string;
  email: string;
}

interface ContatosConfiancaProps {
  contatos: ContatoConfianca[];
  onSaveContatos: (contatos: ContatoConfianca[]) => void;
}

export function ContatosConfianca({ contatos, onSaveContatos }: ContatosConfiancaProps) {
  const [contatosLocal, setContatosLocal] = useState<ContatoConfianca[]>(contatos);
  const [novoContato, setNovoContato] = useState({
    nome: "",
    telefone: "",
    email: "",
  });

  const handleAddContato = () => {
    if (!novoContato.nome || !novoContato.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const contato: ContatoConfianca = {
      id: Date.now().toString(),
      ...novoContato,
    };

    const novosContatos = [...contatosLocal, contato];
    setContatosLocal(novosContatos);
    onSaveContatos(novosContatos);
    
    setNovoContato({ nome: "", telefone: "", email: "" });
    
    toast({
      title: "Contato adicionado",
      description: "Contato de confiança salvo com sucesso!",
    });
  };

  const handleRemoveContato = (id: string) => {
    const novosContatos = contatosLocal.filter(c => c.id !== id);
    setContatosLocal(novosContatos);
    onSaveContatos(novosContatos);
  };

  const handleEmergencyCall = (telefone: string, nome: string) => {
    const url = `tel:${telefone}`;
    window.location.href = url;
    
    toast({
      title: "Ligando para contato de emergência",
      description: `Chamando ${nome}...`,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue">
          Contatos de confiança
        </h2>
      </div>

      {/* Lista de contatos existentes */}
      {contatosLocal.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-medium text-econotrip-blue">Seus contatos:</h3>
          {contatosLocal.map((contato) => (
            <div key={contato.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-econotrip-blue">{contato.nome}</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Phone}
                    onClick={() => handleEmergencyCall(contato.telefone, contato.nome)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ligar
                  </Button>
                  <button
                    onClick={() => handleRemoveContato(contato.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div className="text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {contato.telefone}
                </p>
                {contato.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {contato.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulário para adicionar novo contato */}
      {contatosLocal.length < 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-econotrip-blue">
            {contatosLocal.length === 0 ? "Adicionar primeiro contato:" : "Adicionar segundo contato:"}
          </h3>
          
          <Input
            label="Nome completo"
            value={novoContato.nome}
            onChange={(e) => setNovoContato(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: João Silva"
            required
          />
          
          <Input
            label="Telefone"
            value={novoContato.telefone}
            onChange={(e) => setNovoContato(prev => ({ ...prev, telefone: e.target.value }))}
            placeholder="Ex: (11) 99999-9999"
            required
          />
          
          <Input
            label="E-mail (opcional)"
            type="email"
            value={novoContato.email}
            onChange={(e) => setNovoContato(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Ex: joao@email.com"
          />
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddContato}
            className="w-full"
          >
            Adicionar contato
          </Button>
        </div>
      )}

      {/* Botão de emergência quando há contatos */}
      {contatosLocal.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-medium text-red-600">Emergência</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Use este botão apenas em caso de emergência para avisar seus contatos de confiança.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={Phone}
            onClick={() => handleEmergencyCall(contatosLocal[0].telefone, contatosLocal[0].nome)}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Chamar contato de emergência
          </Button>
        </div>
      )}
    </Card>
  );
}
