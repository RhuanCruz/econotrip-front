import { Helmet } from 'react-helmet-async';
import BuscaHospedagem from '@/components/hospedagem/BuscaHospedagem';

export default function TelaBuscaHospedagem() {
  return (
    <>
      <Helmet>
        <title>Buscar Hospedagem - Econotrip PrimeVoyage</title>
        <meta
          name="description"
          content="Encontre as melhores ofertas de hospedagem para sua viagem. Compare preços de hotéis, apartamentos, hostels e muito mais."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Hospedagem
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Encontre os melhores lugares para se hospedar em qualquer destino do mundo
            </p>
          </div>

          {/* Componente de busca */}
          <BuscaHospedagem />

          {/* Cards informativos */}
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Melhor Preço</h3>
              <p className="text-sm text-gray-600">
                Compare milhares de opções e encontre o melhor custo-benefício
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Reserva Segura</h3>
              <p className="text-sm text-gray-600">
                Sua reserva é protegida pelo Booking.com, líder mundial
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Variedade</h3>
              <p className="text-sm text-gray-600">
                Hotéis, apartamentos, hostels, resorts e muito mais
              </p>
            </div>
          </div>

          {/* CTA adicional */}
          <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Planeje sua viagem completa!</h2>
            <p className="text-blue-50 mb-4">
              Já pesquisou voos? Combine hospedagem com passagens aéreas e economize ainda mais
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/busca-voos"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Buscar Voos
              </a>
              <a
                href="/novo-roteiro"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
              >
                Criar Roteiro
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
