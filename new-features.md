# 📋 Mudanças Necessárias no Backend - PrimeVoyage

Este documento detalha todas as alterações que precisam ser implementadas no backend para suportar as novas funcionalidades do frontend.

---

## 📑 Índice
1. [Atualização do Radar de Voos](#1-atualização-do-radar-de-voos)
2. [Sistema de Hospedagem](#2-sistema-de-hospedagem)
3. [Sistema de Feedback](#3-sistema-de-feedback)
4. [Resumo de Prioridades](#4-resumo-de-prioridades)

---

## 1. Atualização do Radar de Voos

### 1.1 Atualizar Model/Schema do Radar

**Arquivo:** `models/Radar.js` (ou equivalente)

**Adicionar novos campos:**

```javascript
const RadarSchema = new Schema({
  userId: { type: Number, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  start: { type: Date },
  end: { type: Date },
  value: { type: Number },
  type: {
    type: String,
    enum: ['AIRMILES', 'MONEY'],
    required: true
  },

  // ============ NOVOS CAMPOS ============
  airline: {
    type: String,
    required: false,
    trim: true,
    uppercase: true
  }, // Filtro de companhia aérea (ex: "LATAM", "GOL", "AZUL")

  tripType: {
    type: String,
    enum: ['ONE_WAY', 'ROUND_TRIP'],
    default: 'ONE_WAY'
  }, // Tipo de viagem

  returnDateRange: {
    type: Number,
    default: 15
  }, // Intervalo em dias para buscar voos de retorno (usado quando tripType = ROUND_TRIP)
  // ======================================

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 1.2 Atualizar Endpoint POST /radars

**Arquivo:** `routes/radars.js` ou `controllers/RadarController.js`

**Request Body Atualizado:**

```typescript
{
  origin: string;           // Obrigatório
  destination: string;      // Obrigatório
  type: 'AIRMILES' | 'MONEY'; // Obrigatório
  start?: string;           // Opcional (ISO Date)
  end?: string;             // Opcional (ISO Date)
  value?: number;           // Opcional (alerta de preço)

  // ============ NOVOS ============
  airline?: string;         // Opcional - filtro de companhia (ex: "LATAM")
  tripType?: 'ONE_WAY' | 'ROUND_TRIP'; // Opcional - padrão ONE_WAY
  returnDateRange?: number; // Opcional - padrão 15 (dias)
  // ===============================
}
```

**Validações a adicionar:**

```javascript
// Validar airline apenas para tipo AIRMILES
if (type === 'AIRMILES' && airline) {
  // airline deve ser string válida
  airline = airline.trim().toUpperCase();
}

// Validar tripType
if (tripType && !['ONE_WAY', 'ROUND_TRIP'].includes(tripType)) {
  return res.status(400).json({
    error: 'tripType deve ser ONE_WAY ou ROUND_TRIP'
  });
}

// Validar returnDateRange
if (tripType === 'ROUND_TRIP' && returnDateRange) {
  if (returnDateRange < 1 || returnDateRange > 30) {
    return res.status(400).json({
      error: 'returnDateRange deve estar entre 1 e 30 dias'
    });
  }
}
```

### 1.3 Atualizar Lógica de Busca de Voos

**Arquivo:** `services/FlightSearchService.js` (ou equivalente)

**Quando `tripType = 'ROUND_TRIP'`:**

```javascript
async function searchFlights(radar) {
  const { origin, destination, start, end, tripType, returnDateRange, airline, type } = radar;

  if (tripType === 'ROUND_TRIP') {
    // Para cada data de ida, buscar voos de volta dentro do intervalo
    const outboundFlights = await searchOutboundFlights(origin, destination, start, end);

    for (const outbound of outboundFlights) {
      const departureDate = new Date(outbound.date);

      // Buscar voos de retorno no intervalo de returnDateRange dias
      const returnStart = new Date(departureDate);
      returnStart.setDate(returnStart.getDate() + 1); // mínimo 1 dia depois

      const returnEnd = new Date(departureDate);
      returnEnd.setDate(returnEnd.getDate() + returnDateRange); // até X dias depois

      const returnFlights = await searchReturnFlights(
        destination,
        origin,
        returnStart,
        returnEnd
      );

      // Encontrar o voo de retorno mais barato
      const cheapestReturn = returnFlights.sort((a, b) => a.price - b.price)[0];

      if (cheapestReturn) {
        // Salvar combinação ida + volta
        await saveRoundTripOffer(radar.id, {
          outbound: outbound,
          return: cheapestReturn,
          totalPrice: outbound.price + cheapestReturn.price
        });
      }
    }
  } else {
    // Lógica ONE_WAY existente
    const flights = await searchOutboundFlights(origin, destination, start, end);

    // Filtrar por companhia se especificado
    let filteredFlights = flights;
    if (airline) {
      filteredFlights = flights.filter(f =>
        f.airline.toUpperCase() === airline.toUpperCase()
      );
    }

    // Salvar ofertas
    for (const flight of filteredFlights) {
      await saveFlightOffer(radar.id, flight);
    }
  }
}
```

### 1.4 Atualizar Resposta GET /radars/:id/flights

**Retornar informações adicionais:**

```json
{
  "results": [
    {
      "_id": "...",
      "origin": "GRU",
      "destination": "LIS",
      "type": "AIRMILES",
      "date": "2025-03-15",
      "value": 35000,
      "airline": "LATAM",
      "tripType": "ROUND_TRIP",
      "returnDate": "2025-03-22",
      "returnValue": 35000,
      "totalValue": 70000,
      "createdAt": "2025-01-14T10:00:00Z"
    }
  ]
}
```

---

## 2. Sistema de Hospedagem

### 2.1 Criar Model/Schema de Hospedagem

**Arquivo:** `models/AccommodationRadar.js`

```javascript
const AccommodationRadarSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  rooms: {
    type: Number,
    default: 1,
    min: 1
  },
  maxPrice: {
    type: Number,
    min: 0
  },
  type: {
    type: String,
    enum: ['HOTEL', 'APARTMENT', 'HOSTEL', 'GUESTHOUSE', 'RESORT']
  },
  minRating: {
    type: Number,
    min: 0,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AccommodationRadar', AccommodationRadarSchema);
```

**Arquivo:** `models/AccommodationResult.js`

```javascript
const AccommodationResultSchema = new Schema({
  radarId: {
    type: Schema.Types.ObjectId,
    ref: 'AccommodationRadar',
    required: true
  },
  accommodationId: {
    type: String,
    required: true
  }, // ID externo (Booking.com)
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'BRL'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  imageUrl: String,
  bookingUrl: String,
  foundAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AccommodationResult', AccommodationResultSchema);
```

### 2.2 Integração com API Booking.com

**Arquivo:** `services/BookingService.js`

**Opções de API:**
1. **Booking.com Official API** (requer parceria)
2. **RapidAPI - Booking.com** (mais acessível)
3. **Alternativas:** Agoda, Hotels.com, Trivago

**Exemplo com RapidAPI:**

```javascript
const axios = require('axios');

class BookingService {
  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY;
    this.baseUrl = 'https://booking-com.p.rapidapi.com/v1';
  }

  async searchAccommodations(params) {
    const {
      city,
      checkIn,      // YYYY-MM-DD
      checkOut,     // YYYY-MM-DD
      adults,
      children = 0,
      rooms = 1,
      minPrice,
      maxPrice,
      type,
      minRating
    } = params;

    try {
      // 1. Buscar dest_id da cidade
      const destResponse = await axios.get(`${this.baseUrl}/hotels/locations`, {
        params: { name: city, locale: 'pt-br' },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
      });

      const destId = destResponse.data[0]?.dest_id;
      if (!destId) {
        throw new Error('Cidade não encontrada');
      }

      // 2. Buscar hotéis
      const searchResponse = await axios.get(`${this.baseUrl}/hotels/search`, {
        params: {
          dest_id: destId,
          dest_type: 'city',
          checkin_date: checkIn,
          checkout_date: checkOut,
          adults_number: adults,
          children_number: children,
          room_number: rooms,
          locale: 'pt-br',
          currency: 'BRL',
          order_by: 'price',
          filter_by_currency: 'BRL',
          units: 'metric'
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
      });

      // 3. Filtrar e formatar resultados
      let results = searchResponse.data.result || [];

      // Aplicar filtros
      if (minPrice || maxPrice) {
        results = results.filter(hotel => {
          const price = hotel.min_total_price || hotel.price_breakdown?.gross_price;
          return (!minPrice || price >= minPrice) &&
                 (!maxPrice || price <= maxPrice);
        });
      }

      if (minRating) {
        results = results.filter(hotel =>
          (hotel.review_score || 0) >= minRating
        );
      }

      if (type) {
        results = results.filter(hotel =>
          hotel.accommodation_type_name?.toUpperCase() === type
        );
      }

      // Formatar para nosso padrão
      return results.map(hotel => ({
        id: hotel.hotel_id.toString(),
        name: hotel.hotel_name,
        type: this.mapAccommodationType(hotel.accommodation_type_name),
        city: hotel.city,
        country: hotel.country_trans,
        address: hotel.address,
        rating: hotel.review_score || 0,
        reviewScore: hotel.review_score,
        reviewCount: hotel.review_nr,
        price: {
          currency: 'BRL',
          amount: hotel.min_total_price || hotel.price_breakdown?.gross_price || 0,
          perNight: true
        },
        images: hotel.max_photo_url ? [hotel.max_photo_url] : [],
        amenities: this.extractAmenities(hotel),
        coordinates: {
          latitude: hotel.latitude,
          longitude: hotel.longitude
        },
        description: hotel.hotel_name_trans,
        bookingUrl: hotel.url
      }));
    } catch (error) {
      console.error('Erro ao buscar hospedagens:', error);
      throw error;
    }
  }

  mapAccommodationType(bookingType) {
    const typeMap = {
      'hotel': 'HOTEL',
      'aparthotel': 'APARTMENT',
      'hostel': 'HOSTEL',
      'guesthouse': 'GUESTHOUSE',
      'resort': 'RESORT'
    };
    return typeMap[bookingType?.toLowerCase()] || 'HOTEL';
  }

  extractAmenities(hotel) {
    const amenities = [];
    if (hotel.is_free_cancellable) amenities.push('Cancelamento Grátis');
    if (hotel.has_swimming_pool) amenities.push('Piscina');
    if (hotel.has_free_parking) amenities.push('Estacionamento');
    return amenities;
  }
}

module.exports = new BookingService();
```

### 2.3 Criar Endpoints de Hospedagem

**Arquivo:** `routes/accommodations.js`

```javascript
const express = require('express');
const router = express.Router();
const BookingService = require('../services/BookingService');
const { authenticate } = require('../middleware/auth');

// POST /accommodations/search - Buscar hospedagens
router.post('/search', authenticate, async (req, res) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      minPrice,
      maxPrice,
      type,
      minRating
    } = req.body;

    // Validações
    if (!city || !checkIn || !checkOut || !adults) {
      return res.status(400).json({
        error: 'Campos obrigatórios: city, checkIn, checkOut, adults'
      });
    }

    const results = await BookingService.searchAccommodations({
      city,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      minPrice,
      maxPrice,
      type,
      minRating
    });

    res.json({
      results,
      metadata: {
        total: results.length,
        offset: 0,
        limit: results.length
      }
    });
  } catch (error) {
    console.error('Erro na busca de hospedagens:', error);
    res.status(500).json({
      error: 'Erro ao buscar hospedagens',
      message: error.message
    });
  }
});

module.exports = router;
```

**Arquivo:** `routes/radars-accommodation.js`

```javascript
const express = require('express');
const router = express.Router();
const AccommodationRadar = require('../models/AccommodationRadar');
const AccommodationResult = require('../models/AccommodationResult');
const { authenticate } = require('../middleware/auth');

// POST /radars/accommodation - Criar radar de hospedagem
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      maxPrice,
      type,
      minRating
    } = req.body;

    // Validações
    if (!city || !checkIn || !checkOut || !adults) {
      return res.status(400).json({
        error: 'Campos obrigatórios: city, checkIn, checkOut, adults'
      });
    }

    const radar = new AccommodationRadar({
      userId: req.user.id,
      city,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children: children || 0,
      rooms: rooms || 1,
      maxPrice,
      type,
      minRating
    });

    await radar.save();

    // Iniciar busca assíncrona (cron job ou worker)
    // scheduleAccommodationSearch(radar.id);

    res.status(201).json(radar);
  } catch (error) {
    console.error('Erro ao criar radar de hospedagem:', error);
    res.status(500).json({
      error: 'Erro ao criar radar',
      message: error.message
    });
  }
});

// POST /radars/accommodation/list - Listar radares
router.post('/list', authenticate, async (req, res) => {
  try {
    const radars = await AccommodationRadar.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      records: radars,
      metadata: {
        total: radars.length,
        items: radars.length,
        offset: 0
      }
    });
  } catch (error) {
    console.error('Erro ao listar radares:', error);
    res.status(500).json({ error: 'Erro ao listar radares' });
  }
});

// GET /radars/accommodation/:id/results - Obter resultados
router.get('/:id/results', authenticate, async (req, res) => {
  try {
    const radar = await AccommodationRadar.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!radar) {
      return res.status(404).json({ error: 'Radar não encontrado' });
    }

    const results = await AccommodationResult.find({
      radarId: radar._id
    }).sort({ price: 1 });

    res.json({ results });
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro ao buscar resultados' });
  }
});

// DELETE /radars/accommodation/:id - Deletar radar
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const radar = await AccommodationRadar.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!radar) {
      return res.status(404).json({ error: 'Radar não encontrado' });
    }

    // Deletar resultados associados
    await AccommodationResult.deleteMany({ radarId: radar._id });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar radar:', error);
    res.status(500).json({ error: 'Erro ao deletar radar' });
  }
});

module.exports = router;
```

### 2.4 Registrar Rotas no App Principal

**Arquivo:** `app.js` ou `server.js`

```javascript
const accommodationRoutes = require('./routes/accommodations');
const accommodationRadarRoutes = require('./routes/radars-accommodation');

app.use('/api/accommodations', accommodationRoutes);
app.use('/api/radars/accommodation', accommodationRadarRoutes);
```

### 2.5 Criar Cron Job para Monitoramento (Opcional)

**Arquivo:** `jobs/accommodationRadarJob.js`

```javascript
const cron = require('node-cron');
const AccommodationRadar = require('../models/AccommodationRadar');
const AccommodationResult = require('../models/AccommodationResult');
const BookingService = require('../services/BookingService');

// Executar a cada 6 horas
cron.schedule('0 */6 * * *', async () => {
  console.log('Iniciando verificação de radares de hospedagem...');

  try {
    // Buscar radares ativos (checkIn no futuro)
    const radars = await AccommodationRadar.find({
      checkIn: { $gte: new Date() }
    });

    for (const radar of radars) {
      try {
        const results = await BookingService.searchAccommodations({
          city: radar.city,
          checkIn: radar.checkIn.toISOString().split('T')[0],
          checkOut: radar.checkOut.toISOString().split('T')[0],
          adults: radar.adults,
          children: radar.children,
          rooms: radar.rooms,
          maxPrice: radar.maxPrice,
          type: radar.type,
          minRating: radar.minRating
        });

        // Salvar apenas ofertas que atendem aos critérios
        for (const result of results) {
          const existingResult = await AccommodationResult.findOne({
            radarId: radar._id,
            accommodationId: result.id,
            checkIn: radar.checkIn,
            checkOut: radar.checkOut
          });

          if (!existingResult) {
            await AccommodationResult.create({
              radarId: radar._id,
              accommodationId: result.id,
              name: result.name,
              city: result.city,
              price: result.price.amount,
              currency: result.price.currency,
              rating: result.rating,
              checkIn: radar.checkIn,
              checkOut: radar.checkOut,
              imageUrl: result.images[0],
              bookingUrl: result.bookingUrl
            });

            // Enviar notificação ao usuário (email/push)
            // await notifyUser(radar.userId, result);
          }
        }
      } catch (error) {
        console.error(`Erro ao processar radar ${radar._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Erro no job de hospedagem:', error);
  }
});
```

---

## 3. Sistema de Feedback

### 3.1 Criar Model/Schema de Feedback

**Arquivo:** `models/Feedback.js`

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: [
      'BUG',
      'FEATURE_REQUEST',
      'IMPROVEMENT',
      'GENERAL',
      'COMPLIMENT',
      'COMPLAINT'
    ],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING'
  },
  attachments: [{
    type: String
  }],
  userAgent: String,
  ipAddress: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index para busca
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);
```

### 3.2 Criar Endpoint de Feedback

**Arquivo:** `routes/feedback.js`

```javascript
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticate } = require('../middleware/auth');
const emailService = require('../services/EmailService');

// POST /feedback - Enviar feedback
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      category,
      subject,
      message,
      rating,
      email,
      attachments
    } = req.body;

    // Validações
    if (!category || !subject || !message) {
      return res.status(400).json({
        error: 'Campos obrigatórios: category, subject, message'
      });
    }

    if (!['BUG', 'FEATURE_REQUEST', 'IMPROVEMENT', 'GENERAL', 'COMPLIMENT', 'COMPLAINT'].includes(category)) {
      return res.status(400).json({
        error: 'Categoria inválida'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        error: 'Rating deve estar entre 1 e 5'
      });
    }

    // Criar feedback
    const feedback = new Feedback({
      userId: req.user.id,
      category,
      subject,
      message,
      rating,
      email: email || req.user.email,
      attachments,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    await feedback.save();

    // Enviar email para equipe
    await emailService.sendFeedbackNotification({
      feedbackId: feedback._id,
      category: feedback.category,
      subject: feedback.subject,
      message: feedback.message,
      rating: feedback.rating,
      userName: req.user.name,
      userEmail: feedback.email
    });

    // Se for bug crítico, enviar alerta
    if (category === 'BUG' && rating <= 2) {
      await emailService.sendCriticalBugAlert(feedback);
    }

    res.status(201).json({
      feedback,
      message: 'Feedback enviado com sucesso! Agradecemos sua contribuição.'
    });
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    res.status(500).json({
      error: 'Erro ao enviar feedback',
      message: error.message
    });
  }
});

// GET /feedback - Listar feedbacks do usuário (opcional)
router.get('/', authenticate, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json({ feedbacks });
  } catch (error) {
    console.error('Erro ao listar feedbacks:', error);
    res.status(500).json({ error: 'Erro ao listar feedbacks' });
  }
});

// GET /feedback/stats - Estatísticas (admin)
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
```

### 3.3 Serviço de Email para Feedback

**Arquivo:** `services/EmailService.js`

```javascript
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendFeedbackNotification(data) {
    const categoryLabels = {
      BUG: '🐛 Bug',
      FEATURE_REQUEST: '💡 Sugestão de Funcionalidade',
      IMPROVEMENT: '⚡ Melhoria',
      COMPLIMENT: '💙 Elogio',
      COMPLAINT: '⚠️ Reclamação',
      GENERAL: '💬 Geral'
    };

    const emailHtml = `
      <h2>Novo Feedback Recebido</h2>
      <p><strong>Categoria:</strong> ${categoryLabels[data.category]}</p>
      <p><strong>Usuário:</strong> ${data.userName} (${data.userEmail})</p>
      ${data.rating ? `<p><strong>Avaliação:</strong> ${'⭐'.repeat(data.rating)}</p>` : ''}
      <p><strong>Assunto:</strong> ${data.subject}</p>
      <p><strong>Mensagem:</strong></p>
      <blockquote style="border-left: 4px solid #0066cc; padding-left: 16px; margin: 16px 0;">
        ${data.message.replace(/\n/g, '<br>')}
      </blockquote>
      <p><a href="${process.env.ADMIN_URL}/feedback/${data.feedbackId}">Ver no painel admin</a></p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.FEEDBACK_EMAIL || 'feedback@primevoyage.com',
      subject: `[${data.category}] ${data.subject}`,
      html: emailHtml
    });
  }

  async sendCriticalBugAlert(feedback) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.DEV_TEAM_EMAIL,
      subject: '🚨 BUG CRÍTICO REPORTADO - PrimeVoyage',
      html: `
        <h2 style="color: red;">⚠️ Bug Crítico Reportado</h2>
        <p><strong>Usuário:</strong> ${feedback.userId}</p>
        <p><strong>Avaliação:</strong> ${feedback.rating}/5</p>
        <p><strong>Assunto:</strong> ${feedback.subject}</p>
        <p><strong>Mensagem:</strong></p>
        <pre>${feedback.message}</pre>
        <p><strong>User Agent:</strong> ${feedback.userAgent}</p>
        <p><strong>IP:</strong> ${feedback.ipAddress}</p>
      `
    });
  }
}

module.exports = new EmailService();
```

### 3.4 Registrar Rota no App Principal

**Arquivo:** `app.js` ou `server.js`

```javascript
const feedbackRoutes = require('./routes/feedback');

app.use('/api/feedback', feedbackRoutes);
```

---

## 4. Resumo de Prioridades

### 🔴 Prioridade ALTA (Essencial para funcionar)

1. **Atualizar Model Radar** com novos campos (`airline`, `tripType`, `returnDateRange`)
2. **Atualizar POST /radars** para aceitar novos campos
3. **Criar endpoints de Feedback** (`POST /feedback`)
4. **Criar Model e endpoints de Hospedagem** (estrutura básica)

### 🟡 Prioridade MÉDIA (Funcionalidade completa)

5. **Implementar lógica de busca ida e volta** no radar de voos
6. **Integrar API Booking.com** para busca de hospedagens
7. **Criar cron job** para radares de hospedagem
8. **Implementar serviço de email** para feedback

### 🟢 Prioridade BAIXA (Melhorias)

9. **Dashboard admin** para gerenciar feedbacks
10. **Sistema de notificações** para radares
11. **Estatísticas e analytics** de feedbacks
12. **Rate limiting** nos endpoints de busca

---

## 5. Variáveis de Ambiente Necessárias

**Arquivo:** `.env`

```bash
# Booking.com API (RapidAPI)
RAPIDAPI_KEY=your_rapidapi_key_here

# Email (Feedback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=noreply@primevoyage.com
SMTP_PASS=your_smtp_password
SMTP_FROM="PrimeVoyage <noreply@primevoyage.com>"
FEEDBACK_EMAIL=feedback@primevoyage.com
DEV_TEAM_EMAIL=dev@primevoyage.com

# Admin
ADMIN_URL=https://admin.primevoyage.com
```

---

## 6. Dependências NPM Necessárias

```bash
npm install axios node-cron nodemailer
```

---

## 7. Testes Recomendados

### Testar Radar de Voos (atualizado)

```bash
# Criar radar com ida e volta
curl -X POST http://localhost:3000/api/radars \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "GRU",
    "destination": "LIS",
    "type": "AIRMILES",
    "airline": "LATAM",
    "tripType": "ROUND_TRIP",
    "returnDateRange": 15,
    "start": "2025-03-01",
    "end": "2025-03-31"
  }'
```

### Testar Busca de Hospedagem

```bash
curl -X POST http://localhost:3000/api/accommodations/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Rio de Janeiro",
    "checkIn": "2025-02-01",
    "checkOut": "2025-02-05",
    "adults": 2,
    "rooms": 1
  }'
```

### Testar Feedback

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "FEATURE_REQUEST",
    "subject": "Adicionar filtro de preço",
    "message": "Seria ótimo ter um filtro para preço máximo",
    "rating": 5,
    "email": "user@example.com"
  }'
```

---

## 8. Checklist de Implementação

- [ ] Atualizar Model `Radar` com novos campos
- [ ] Atualizar endpoint `POST /radars`
- [ ] Atualizar endpoint `GET /radars/:id/flights` (retornar ida+volta)
- [ ] Implementar lógica de busca ida e volta
- [ ] Criar Model `AccommodationRadar`
- [ ] Criar Model `AccommodationResult`
- [ ] Criar serviço `BookingService`
- [ ] Criar endpoints `/accommodations/search`
- [ ] Criar endpoints `/radars/accommodation/*`
- [ ] Criar Model `Feedback`
- [ ] Criar endpoint `POST /feedback`
- [ ] Criar serviço `EmailService`
- [ ] Configurar variáveis de ambiente
- [ ] Testar todos os endpoints
- [ ] Criar cron job para radares (opcional)
- [ ] Documentar API (Swagger/Postman)

---

## 9. Contato para Dúvidas

Se tiver dúvidas sobre qualquer implementação, consulte:
- **Frontend:** Arquivos em `src/api/*/types.ts` para ver contratos esperados
- **Documentação:** Este arquivo
- **Exemplos:** Seção de testes acima

---

**Última atualização:** 2025-01-14
**Versão:** 1.0.0
