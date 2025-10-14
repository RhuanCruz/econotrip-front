// Tipos para o sistema de busca de hospedagem

export interface HospedagemSearchParams {
  cidade: string;
  checkIn: string; // formato YYYY-MM-DD
  checkOut: string; // formato YYYY-MM-DD
  adultos: number;
  criancas: number;
  quartos: number;
}

export interface BookingUrlParams {
  ss: string; // cidade
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  group_adults: number;
  group_children: number;
  no_rooms: number;
  selected_currency: string;
}
