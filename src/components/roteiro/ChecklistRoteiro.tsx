
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Checkbox } from "@/components/ui-custom/Checkbox";
import { CheckCircle, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
}

interface ChecklistSection {
  id: string;
  titulo: string;
  icon: React.ComponentType<any>;
  color: string;
  items: ChecklistItem[];
}

export function ChecklistRoteiro() {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      id: "antes",
      titulo: "Antes da viagem",
      icon: Clock,
      color: "text-blue-600",
      items: [
        { id: "docs", texto: "Documentos separados e conferidos?", concluido: false },
        { id: "bagagem", texto: "Bagagem preparada e organizada?", concluido: false },
        { id: "remedios", texto: "Remédios organizados e receitas em mãos?", concluido: false },
        { id: "roupas", texto: "Roupas adequadas ao clima do destino?", concluido: false },
        { id: "dinheiro", texto: "Dinheiro e cartões organizados?", concluido: false },
      ],
    },
    {
      id: "durante",
      titulo: "Durante a viagem",
      icon: CheckCircle,
      color: "text-green-600",
      items: [
        { id: "embarque", texto: "Local do embarque salvo no celular?", concluido: false },
        { id: "cartao", texto: "Cartão de embarque emitido?", concluido: false },
        { id: "refeicao", texto: "Refeição planejada ou pedida?", concluido: false },
        { id: "contatos", texto: "Contatos de emergência anotados?", concluido: false },
        { id: "hotel", texto: "Endereço do hotel salvo?", concluido: false },
      ],
    },
    {
      id: "depois",
      titulo: "Depois da viagem",
      icon: Star,
      color: "text-purple-600",
      items: [
        { id: "avaliar", texto: "Avaliar a experiência da viagem?", concluido: false },
        { id: "compartilhar", texto: "Compartilhar fotos com a família?", concluido: false },
        { id: "pontos", texto: "Adicionar pontos de fidelidade?", concluido: false },
        { id: "feedback", texto: "Deixar feedback para a ECONOTRIP?", concluido: false },
      ],
    },
  ]);

  useEffect(() => {
    // Carregar estado do checklist do localStorage
    const checklistSalvo = localStorage.getItem("econotrip_checklist_roteiro");
    if (checklistSalvo) {
      setSections(JSON.parse(checklistSalvo));
    }
  }, []);

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections(prev => {
      const newSections = prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => 
              item.id === itemId 
                ? { ...item, concluido: !item.concluido }
                : item
            ),
          };
        }
        return section;
      });
      
      // Salvar no localStorage
      localStorage.setItem("econotrip_checklist_roteiro", JSON.stringify(newSections));
      return newSections;
    });
  };

  const getProgress = (section: ChecklistSection) => {
    const completed = section.items.filter(item => item.concluido).length;
    const total = section.items.length;
    return Math.round((completed / total) * 100);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
          Seu checklist de viagem
        </h2>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const progress = getProgress(section);
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-xl p-5 bg-gray-50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-econotrip-blue">
                    {section.titulo}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress === 100 ? "bg-green-500" : "bg-econotrip-orange"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <input
                      type="checkbox"
                      checked={item.concluido}
                      onChange={() => toggleItem(section.id, item.id)}
                      className="w-5 h-5 text-econotrip-blue rounded"
                    />
                    <label 
                      className={`text-base cursor-pointer flex-1 ${
                        item.concluido ? "line-through text-gray-500" : "text-gray-700"
                      }`}
                      onClick={() => toggleItem(section.id, item.id)}
                    >
                      {item.texto}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
