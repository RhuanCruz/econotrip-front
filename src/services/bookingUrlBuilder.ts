import { HospedagemSearchParams, BookingUrlParams } from '@/types/hospedagem';

/**
 * Constrói a URL do Booking.com com os parâmetros de busca
 * @param params Parâmetros de busca de hospedagem
 * @returns URL completa para redirecionamento
 */
export function buildBookingUrl(params: HospedagemSearchParams): string {
  const baseUrl = 'https://www.booking.com/searchresults.pt-br.html';

  const bookingParams: BookingUrlParams = {
    ss: params.cidade,
    checkin: params.checkIn,
    checkout: params.checkOut,
    group_adults: params.adultos,
    group_children: params.criancas,
    no_rooms: params.quartos,
    selected_currency: 'BRL',
  };

  // Construir query string
  const queryParams = new URLSearchParams();

  Object.entries(bookingParams).forEach(([key, value]) => {
    queryParams.append(key, value.toString());
  });

  return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Abre a busca do Booking.com em uma nova aba
 * @param params Parâmetros de busca de hospedagem
 */
export function redirectToBooking(params: HospedagemSearchParams): void {
  const url = buildBookingUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Valida se as datas são válidas (check-out após check-in)
 * @param checkIn Data de check-in
 * @param checkOut Data de check-out
 * @returns true se válido, false caso contrário
 */
export function validateDates(checkIn: string, checkOut: string): boolean {
  const dateIn = new Date(checkIn);
  const dateOut = new Date(checkOut);

  return dateOut > dateIn;
}

/**
 * Calcula o número de noites entre duas datas
 * @param checkIn Data de check-in
 * @param checkOut Data de check-out
 * @returns Número de noites
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const dateIn = new Date(checkIn);
  const dateOut = new Date(checkOut);

  const diffTime = Math.abs(dateOut.getTime() - dateIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
