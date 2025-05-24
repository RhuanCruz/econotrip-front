
import { useState, useEffect } from "react";

interface SearchData {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: string;
  classe: string;
  somenteDireto: boolean;
  voosSustentaveis: boolean;
  tarifasFlexiveis: boolean;
  acessibilidade: boolean;
}

export function useLastSearch() {
  const [lastSearch, setLastSearch] = useState<SearchData | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  useEffect(() => {
    const savedSearch = localStorage.getItem("econotrip_last_search");
    if (savedSearch) {
      try {
        const parsedSearch = JSON.parse(savedSearch);
        setLastSearch(parsedSearch);
        setShowRestorePrompt(true);
      } catch (error) {
        console.log("Erro ao recuperar última busca:", error);
        localStorage.removeItem("econotrip_last_search");
      }
    }
  }, []);

  const saveSearch = (searchData: SearchData) => {
    try {
      localStorage.setItem("econotrip_last_search", JSON.stringify(searchData));
      setLastSearch(searchData);
    } catch (error) {
      console.log("Erro ao salvar busca:", error);
    }
  };

  const clearLastSearch = () => {
    localStorage.removeItem("econotrip_last_search");
    setLastSearch(null);
    setShowRestorePrompt(false);
  };

  const hideRestorePrompt = () => {
    setShowRestorePrompt(false);
  };

  return {
    lastSearch,
    showRestorePrompt,
    saveSearch,
    clearLastSearch,
    hideRestorePrompt
  };
}
