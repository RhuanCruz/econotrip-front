
import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const toggleHighContrast = () => {
    document.body.classList.toggle('high-contrast');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center mb-2" aria-label="Ir para página inicial">
              <div className="font-museomoderno font-bold text-xl text-econotrip-blue mr-2">
                ECONOTRIP
              </div>
              <span className="text-econotrip-orange font-medium">PrimeVoyage</span>
            </Link>
            <p className="text-gray-600">
              © {currentYear} ECONOTRIP. Todos os direitos reservados.
            </p>
          </div>
          <button
            onClick={toggleHighContrast}
            className="px-4 py-3 bg-econotrip-blue text-white rounded-full touch-target flex items-center justify-center"
            aria-label="Alternar modo de alto contraste"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
            Modo de Alto Contraste
          </button>
        </div>
      </div>
    </footer>
  );
}
