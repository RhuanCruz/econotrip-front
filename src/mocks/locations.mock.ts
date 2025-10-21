import type { StandardLocation } from '@/api/location/types';

/**
 * Mock de aeroportos brasileiros e internacionais
 * Para usar enquanto o backend não está disponível
 */
export const MOCK_LOCATIONS: StandardLocation[] = [
  // São Paulo
  { code: 'GRU', name: 'Aeroporto Internacional de Guarulhos', city: 'São Paulo', country: 'Brazil', cityCode: 'SAO' },
  { code: 'CGH', name: 'Aeroporto de Congonhas', city: 'São Paulo', country: 'Brazil', cityCode: 'SAO' },
  { code: 'VCP', name: 'Aeroporto de Viracopos', city: 'Campinas', country: 'Brazil', cityCode: 'CPQ' },

  // Rio de Janeiro
  { code: 'GIG', name: 'Aeroporto Internacional do Galeão', city: 'Rio de Janeiro', country: 'Brazil', cityCode: 'RIO' },
  { code: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro', country: 'Brazil', cityCode: 'RIO' },

  // Outras capitais brasileiras
  { code: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília', country: 'Brazil', cityCode: 'BSB' },
  { code: 'SSA', name: 'Aeroporto Internacional de Salvador', city: 'Salvador', country: 'Brazil', cityCode: 'SSA' },
  { code: 'FOR', name: 'Aeroporto Internacional de Fortaleza', city: 'Fortaleza', country: 'Brazil', cityCode: 'FOR' },
  { code: 'REC', name: 'Aeroporto Internacional do Recife', city: 'Recife', country: 'Brazil', cityCode: 'REC' },
  { code: 'CWB', name: 'Aeroporto Internacional Afonso Pena', city: 'Curitiba', country: 'Brazil', cityCode: 'CWB' },
  { code: 'POA', name: 'Aeroporto Salgado Filho', city: 'Porto Alegre', country: 'Brazil', cityCode: 'POA' },
  { code: 'BEL', name: 'Aeroporto Internacional de Belém', city: 'Belém', country: 'Brazil', cityCode: 'BEL' },
  { code: 'MAO', name: 'Aeroporto Eduardo Gomes', city: 'Manaus', country: 'Brazil', cityCode: 'MAO' },
  { code: 'FLN', name: 'Aeroporto Hercílio Luz', city: 'Florianópolis', country: 'Brazil', cityCode: 'FLN' },
  { code: 'VIX', name: 'Aeroporto de Vitória', city: 'Vitória', country: 'Brazil', cityCode: 'VIX' },
  { code: 'CNF', name: 'Aeroporto de Confins', city: 'Belo Horizonte', country: 'Brazil', cityCode: 'BHZ' },

  // Europa
  { code: 'LIS', name: 'Aeroporto de Lisboa', city: 'Lisboa', country: 'Portugal', cityCode: 'LIS' },
  { code: 'OPO', name: 'Aeroporto do Porto', city: 'Porto', country: 'Portugal', cityCode: 'OPO' },
  { code: 'MAD', name: 'Aeroporto Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Spain', cityCode: 'MAD' },
  { code: 'BCN', name: 'Aeroporto de Barcelona', city: 'Barcelona', country: 'Spain', cityCode: 'BCN' },
  { code: 'CDG', name: 'Aeroporto Charles de Gaulle', city: 'Paris', country: 'France', cityCode: 'PAR' },
  { code: 'ORY', name: 'Aeroporto de Orly', city: 'Paris', country: 'France', cityCode: 'PAR' },
  { code: 'FCO', name: 'Aeroporto Leonardo da Vinci', city: 'Roma', country: 'Italy', cityCode: 'ROM' },
  { code: 'LHR', name: 'Aeroporto de Heathrow', city: 'Londres', country: 'United Kingdom', cityCode: 'LON' },
  { code: 'FRA', name: 'Aeroporto de Frankfurt', city: 'Frankfurt', country: 'Germany', cityCode: 'FRA' },
  { code: 'AMS', name: 'Aeroporto de Schiphol', city: 'Amsterdam', country: 'Netherlands', cityCode: 'AMS' },

  // América do Norte
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'Nova York', country: 'USA', cityCode: 'NYC' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'USA', cityCode: 'NYC' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA', cityCode: 'MIA' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', cityCode: 'LAX' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA', cityCode: 'CHI' },
  { code: 'MEX', name: 'Aeropuerto Internacional de la Ciudad de México', city: 'Cidade do México', country: 'Mexico', cityCode: 'MEX' },
  { code: 'CUN', name: 'Aeroporto de Cancún', city: 'Cancún', country: 'Mexico', cityCode: 'CUN' },

  // América do Sul
  { code: 'EZE', name: 'Aeroporto Internacional de Ezeiza', city: 'Buenos Aires', country: 'Argentina', cityCode: 'BUE' },
  { code: 'AEP', name: 'Aeroporto Jorge Newbery', city: 'Buenos Aires', country: 'Argentina', cityCode: 'BUE' },
  { code: 'SCL', name: 'Aeroporto Arturo Merino Benítez', city: 'Santiago', country: 'Chile', cityCode: 'SCL' },
  { code: 'LIM', name: 'Aeroporto Internacional Jorge Chávez', city: 'Lima', country: 'Peru', cityCode: 'LIM' },
  { code: 'BOG', name: 'Aeroporto El Dorado', city: 'Bogotá', country: 'Colombia', cityCode: 'BOG' },

  // Ásia
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', cityCode: 'DXB' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', cityCode: 'DOH' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tóquio', country: 'Japan', cityCode: 'TYO' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tóquio', country: 'Japan', cityCode: 'TYO' },
];

/**
 * Filtra locations mockadas por keyword
 * Simula o comportamento da API
 */
export function filterMockLocations(keyword: string): StandardLocation[] {
  const normalizedKeyword = keyword
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos

  return MOCK_LOCATIONS.filter((location) => {
    const normalizedCode = location.code.toLowerCase();
    const normalizedName = location.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedCity = location.city
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return (
      normalizedCode.includes(normalizedKeyword) ||
      normalizedName.includes(normalizedKeyword) ||
      normalizedCity.includes(normalizedKeyword)
    );
  }).slice(0, 10); // Limita a 10 resultados
}

/**
 * Flag para controlar se deve usar mock ou API real
 * Altere para false quando o backend estiver funcionando
 */
export const USE_MOCK_LOCATIONS = false; // ✅ Desativado - usando API real
