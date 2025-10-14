import { useState } from 'react';
import { Calendar, MapPin, Users, Baby, Home, Search } from 'lucide-react';
import { HospedagemSearchParams } from '@/types/hospedagem';
import { redirectToBooking, validateDates, calculateNights } from '@/services/bookingUrlBuilder';

export default function BuscaHospedagem() {
  const [formData, setFormData] = useState<HospedagemSearchParams>({
    cidade: '',
    checkIn: '',
    checkOut: '',
    adultos: 2,
    criancas: 0,
    quartos: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Data mínima: hoje
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (field: keyof HospedagemSearchParams, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Digite o nome da cidade';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Selecione a data de check-in';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Selecione a data de check-out';
    }

    if (formData.checkIn && formData.checkOut) {
      if (!validateDates(formData.checkIn, formData.checkOut)) {
        newErrors.checkOut = 'Check-out deve ser após o check-in';
      }
    }

    if (formData.adultos < 1) {
      newErrors.adultos = 'Pelo menos 1 adulto é necessário';
    }

    if (formData.quartos < 1) {
      newErrors.quartos = 'Pelo menos 1 quarto é necessário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      redirectToBooking(formData);
    }
  };

  const nights = formData.checkIn && formData.checkOut && validateDates(formData.checkIn, formData.checkOut)
    ? calculateNights(formData.checkIn, formData.checkOut)
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Buscar Hospedagem
          </h2>
          <p className="text-gray-600">
            Encontre as melhores ofertas de hotéis, apartamentos e muito mais
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cidade */}
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Cidade de destino *
            </label>
            <input
              type="text"
              id="cidade"
              value={formData.cidade}
              onChange={(e) => handleChange('cidade', e.target.value)}
              placeholder="Ex: Rio de Janeiro, São Paulo, Lisboa..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cidade ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cidade && (
              <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>
            )}
          </div>

          {/* Datas - Grid responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in */}
            <div>
              <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-in *
              </label>
              <input
                type="date"
                id="checkIn"
                value={formData.checkIn}
                onChange={(e) => handleChange('checkIn', e.target.value)}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.checkIn ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.checkIn && (
                <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
              )}
            </div>

            {/* Check-out */}
            <div>
              <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-out *
              </label>
              <input
                type="date"
                id="checkOut"
                value={formData.checkOut}
                onChange={(e) => handleChange('checkOut', e.target.value)}
                min={formData.checkIn || today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.checkOut ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.checkOut && (
                <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
              )}
            </div>
          </div>

          {/* Info de noites */}
          {nights > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <Calendar className="inline w-4 h-4 mr-1" />
                Estadia de <strong>{nights}</strong> {nights === 1 ? 'noite' : 'noites'}
              </p>
            </div>
          )}

          {/* Hóspedes e Quartos - Grid responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Adultos */}
            <div>
              <label htmlFor="adultos" className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Adultos *
              </label>
              <input
                type="number"
                id="adultos"
                value={formData.adultos}
                onChange={(e) => handleChange('adultos', parseInt(e.target.value) || 0)}
                min="1"
                max="30"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.adultos ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.adultos && (
                <p className="mt-1 text-sm text-red-600">{errors.adultos}</p>
              )}
            </div>

            {/* Crianças */}
            <div>
              <label htmlFor="criancas" className="block text-sm font-medium text-gray-700 mb-2">
                <Baby className="inline w-4 h-4 mr-1" />
                Crianças
              </label>
              <input
                type="number"
                id="criancas"
                value={formData.criancas}
                onChange={(e) => handleChange('criancas', parseInt(e.target.value) || 0)}
                min="0"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quartos */}
            <div>
              <label htmlFor="quartos" className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="inline w-4 h-4 mr-1" />
                Quartos *
              </label>
              <input
                type="number"
                id="quartos"
                value={formData.quartos}
                onChange={(e) => handleChange('quartos', parseInt(e.target.value) || 0)}
                min="1"
                max="30"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.quartos ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.quartos && (
                <p className="mt-1 text-sm text-red-600">{errors.quartos}</p>
              )}
            </div>
          </div>

          {/* Botão de busca */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5" />
            Buscar Hospedagens no Booking.com
          </button>

          {/* Nota informativa */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Você será redirecionado para o Booking.com com sua busca já preenchida.
              Compare preços, avalie opções e reserve com segurança!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
