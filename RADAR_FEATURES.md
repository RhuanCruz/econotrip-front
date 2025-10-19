# Documentação - Novas Features do Radar de Ofertas

## Status de Implementação

✅ **IMPLEMENTADO** - As features de filtro por companhia aérea e voos de ida e volta já foram implementadas no backend.

---

## 📋 Resumo Executivo

### O que foi implementado?

1. **Filtro por Companhia Aérea** ✈️
   - Campo `airline` opcional no radar
   - Filtra apenas voos da companhia especificada
   - Converte automaticamente para UPPERCASE

2. **Voos de Ida e Volta** 🔄
   - Campo `tripType`: `ONE_WAY` ou `ROUND_TRIP`
   - Campo `returnDateRange`: intervalo de busca da volta (1-30 dias, padrão: 15)
   - Sistema busca automaticamente a combinação mais barata

### Como usar (Resumo Rápido)

**Criar radar de IDA com filtro de companhia:**
```bash
POST http://localhost:3333/api/v1/radars
Authorization: Bearer {token}
Content-Type: application/json

{
  "origin": "GRU",
  "destination": "JFK",
  "type": "MONEY",
  "airline": "LATAM",        # ← NOVO
  "tripType": "ONE_WAY"
}
```

**Criar radar de IDA E VOLTA:**
```bash
POST http://localhost:3333/api/v1/radars
Authorization: Bearer {token}
Content-Type: application/json

{
  "origin": "GRU",
  "destination": "MAD",
  "type": "MONEY",
  "tripType": "ROUND_TRIP",      # ← NOVO
  "returnDateRange": 15          # ← NOVO
}
```

---

## 1. Filtro por Companhia Aérea

### Descrição
Permite que o usuário filtre as ofertas de voo por uma companhia aérea específica ao criar ou atualizar um radar.

### Implementação no Backend

#### Modelo de Dados (Database)
O campo `airline` foi adicionado à tabela `radar`:

```sql
-- Tabela: radar
airline VARCHAR(64) NULL
```

**Arquivo**: `prisma/schema.prisma`
```prisma
model Radar {
  id              Int       @id @default(autoincrement())
  userId          Int       @map("user_id")
  start           DateTime?
  end             DateTime?
  origin          String    @db.VarChar(32)
  destination     String    @db.VarChar(32)
  value           Float?
  type            String?   @db.VarChar(32)
  airline         String?   @db.VarChar(64)  // ← NOVO CAMPO
  tripType        String?   @default("ONE_WAY") @map("trip_type") @db.VarChar(16)
  returnDateRange Int?      @default(15) @map("return_date_range")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  user              User                @relation(fields: [userId], references: [id])
  RadarNotification RadarNotification[]

  @@map("radar")
}
```

#### Validação (Zod Schema)
**Arquivo**: `src/modules/radar/useCases/CreateRadar/CreateRadarSchema.ts`

```typescript
const CreateRadarSchema = object({
  start: string().date().transform((date) => `${date}T00:00:00.000Z`).optional(),
  end: string().date().transform((date) => `${date}T00:00:00.000Z`).optional(),
  origin: string().max(32),
  destination: string().max(32),
  value: number().min(1).optional(),
  type: ENUM(['MONEY', 'AIRMILES']),
  airline: string().max(64).optional(),  // ← VALIDAÇÃO: máximo 64 caracteres
  tripType: ENUM(['ONE_WAY', 'ROUND_TRIP']).optional(),
  returnDateRange: number().min(1).max(30).optional(),
});
```

#### Interface TypeScript
**Arquivo**: `src/modules/radar/dtos/ICreateRadarDTO.ts`

```typescript
interface ICreateRadarDTO {
  userId: number;
  start?: string;
  end?: string;
  origin: string;
  destination: string;
  type: string;
  value?: number;
  airline?: string;  // ← OPCIONAL
  tripType?: 'ONE_WAY' | 'ROUND_TRIP';
  returnDateRange?: number;
}
```

### Como o Frontend Deve Usar

#### Endpoint: `POST /api/v1/radars`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (Exemplo com filtro de companhia aérea):**
```json
{
  "origin": "GRU",
  "destination": "JFK",
  "type": "MONEY",
  "value": 2000,
  "start": "2025-12-01",
  "end": "2025-12-15",
  "airline": "LATAM",           // ← OPCIONAL: código ou nome da companhia
  "tripType": "ONE_WAY",
  "returnDateRange": 15
}
```

**Valores aceitos para `airline`:**
- Qualquer string com até 64 caracteres
- Pode ser o código IATA (ex: "LA", "G3", "AD")
- Pode ser o nome da companhia (ex: "LATAM", "Gol", "Azul")
- Pode ser `null` ou omitido para não filtrar por companhia

**Resposta de Sucesso (200):**
```json
{
  "id": 123,
  "userId": 45,
  "origin": "GRU",
  "destination": "JFK",
  "type": "MONEY",
  "value": 2000,
  "start": "2025-12-01T00:00:00.000Z",
  "end": "2025-12-15T00:00:00.000Z",
  "airline": "LATAM",
  "tripType": "ONE_WAY",
  "returnDateRange": 15,
  "createdAt": "2025-10-15T20:00:00.000Z",
  "updatedAt": "2025-10-15T20:00:00.000Z"
}
```

---

## 2. Voos de Ida e Volta

### Descrição
Permite que o usuário configure o radar para buscar voos de ida e volta (ROUND_TRIP) ao invés de apenas ida (ONE_WAY). Para voos de ida e volta, o sistema busca automaticamente os valores mais baratos dentro de um intervalo de datas configurável.

### Implementação no Backend

#### Modelo de Dados (Database)
Dois campos foram adicionados à tabela `radar`:

```sql
-- Tabela: radar
trip_type VARCHAR(16) DEFAULT 'ONE_WAY'
return_date_range INTEGER DEFAULT 15
```

**Arquivo**: `prisma/schema.prisma`
```prisma
model Radar {
  // ... outros campos
  tripType        String?   @default("ONE_WAY") @map("trip_type") @db.VarChar(16)
  returnDateRange Int?      @default(15) @map("return_date_range")
  // ...
}
```

#### Validação (Zod Schema)
**Arquivo**: `src/modules/radar/useCases/CreateRadar/CreateRadarSchema.ts`

```typescript
const CreateRadarSchema = object({
  // ... outros campos
  tripType: ENUM(['ONE_WAY', 'ROUND_TRIP']).optional(),  // ← Valores aceitos
  returnDateRange: number().min(1).max(30).optional(),   // ← Entre 1 e 30 dias
});
```

**Regras de Validação:**
- `tripType`: Aceita apenas `'ONE_WAY'` ou `'ROUND_TRIP'`
- `returnDateRange`: Número inteiro entre 1 e 30 dias
- Se omitido, assume `tripType = 'ONE_WAY'` e `returnDateRange = 15`

#### Processamento no Backend
**Arquivo**: `src/modules/radar/useCases/CreateRadar/CreateRadarService.ts`

```typescript
const radar = await this.radarRepository.create({
  userId: req.auth.user,
  start: data.start,
  end: data.end,
  origin: data.origin,
  destination: data.destination,
  type: data.type,
  value: data.value,
  airline: data.airline,
  tripType: data.tripType || 'ONE_WAY',        // ← Default: ONE_WAY
  returnDateRange: data.returnDateRange || 15,  // ← Default: 15 dias
});
```

### Como o Frontend Deve Usar

#### Endpoint: `POST /api/v1/radars`

**Cenário 1: Criar Radar de IDA (padrão)**
```json
{
  "origin": "GRU",
  "destination": "JFK",
  "type": "MONEY",
  "value": 2000,
  "start": "2025-12-01",
  "end": "2025-12-15"
  // tripType não enviado = ONE_WAY (padrão)
}
```

**Cenário 2: Criar Radar de IDA E VOLTA**
```json
{
  "origin": "GRU",
  "destination": "JFK",
  "type": "MONEY",
  "value": 4000,
  "start": "2025-12-01",
  "end": "2025-12-15",
  "tripType": "ROUND_TRIP",      // ← OBRIGATÓRIO para ida e volta
  "returnDateRange": 15          // ← OPCIONAL: intervalo de busca (padrão: 15 dias)
}
```

**Cenário 3: Radar IDA E VOLTA com companhia aérea específica**
```json
{
  "origin": "GRU",
  "destination": "MAD",
  "type": "AIRMILES",
  "value": 50000,
  "start": "2025-12-01",
  "end": "2025-12-20",
  "airline": "LATAM",
  "tripType": "ROUND_TRIP",
  "returnDateRange": 20          // ← Buscar voos de volta em até 20 dias após a ida
}
```

### Como Funciona o `returnDateRange`

Quando `tripType = 'ROUND_TRIP'`:

1. **Data de Ida**: O sistema busca voos entre `start` e `end` (período configurado pelo usuário)
2. **Data de Volta**: Para cada data de ida encontrada, o sistema busca voos de volta em um intervalo de **`returnDateRange` dias** após a data de ida
3. **Cálculo Automático**: O sistema retorna sempre os **valores mais baratos** dentro deste intervalo

**Exemplo:**
- `start`: 2025-12-01
- `end`: 2025-12-15
- `returnDateRange`: 15

O sistema irá:
- Buscar voos de **ida** entre 01/12 e 15/12
- Para cada ida (ex: 05/12), buscar voos de **volta** entre 05/12 e 20/12 (05/12 + 15 dias)
- Retornar as combinações mais baratas

---

## 3. Endpoints Disponíveis

### 3.1 Criar Radar
**Endpoint**: `POST /api/v1/radars`
**Autenticação**: Bearer Token (obrigatório)

**Request Body:**
```typescript
{
  origin: string;              // Código IATA de origem (ex: "GRU")
  destination: string;         // Código IATA de destino (ex: "JFK")
  type: 'MONEY' | 'AIRMILES'; // Tipo de busca
  value?: number;              // Valor máximo (opcional)
  start?: string;              // Data início (YYYY-MM-DD)
  end?: string;                // Data fim (YYYY-MM-DD)
  airline?: string;            // Companhia aérea (opcional)
  tripType?: 'ONE_WAY' | 'ROUND_TRIP';  // Tipo de viagem (padrão: ONE_WAY)
  returnDateRange?: number;    // Intervalo de busca da volta em dias (1-30, padrão: 15)
}
```

### 3.2 Atualizar Radar
**Endpoint**: `PATCH /api/v1/radars/:id`
**Autenticação**: Bearer Token (obrigatório)

**Request Body** (todos os campos são opcionais):
```typescript
{
  origin?: string;
  destination?: string;
  type?: 'MONEY' | 'AIRMILES';
  value?: number;
  start?: string;
  end?: string;
  airline?: string;
  tripType?: 'ONE_WAY' | 'ROUND_TRIP';
  returnDateRange?: number;
}
```

### 3.3 Listar Radares
**Endpoint**: `GET /api/v1/radars`
**Autenticação**: Bearer Token (obrigatório)

Retorna todos os radares do usuário autenticado.

### 3.4 Deletar Radar
**Endpoint**: `DELETE /api/v1/radars/:id`
**Autenticação**: Bearer Token (obrigatório)

---

## 4. Fluxo Completo - Frontend

### Exemplo de Componente React (Criar Radar)

```typescript
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3333/api/v1';

function CreateRadarForm() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    type: 'MONEY',
    value: '',
    start: '',
    end: '',
    airline: '',
    tripType: 'ONE_WAY',
    returnDateRange: 15
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Ou de onde você armazena o token

      const response = await axios.post(
        `${API_URL}/radars`,
        {
          origin: formData.origin,
          destination: formData.destination,
          type: formData.type,
          value: formData.value ? Number(formData.value) : undefined,
          start: formData.start || undefined,
          end: formData.end || undefined,
          airline: formData.airline || undefined,
          tripType: formData.tripType,
          returnDateRange: formData.tripType === 'ROUND_TRIP'
            ? formData.returnDateRange
            : undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Radar criado:', response.data);
      alert('Radar criado com sucesso!');

    } catch (error) {
      console.error('Erro ao criar radar:', error);
      alert('Erro ao criar radar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Origem:</label>
        <input
          type="text"
          value={formData.origin}
          onChange={(e) => setFormData({...formData, origin: e.target.value})}
          placeholder="GRU"
          maxLength={32}
          required
        />
      </div>

      <div>
        <label>Destino:</label>
        <input
          type="text"
          value={formData.destination}
          onChange={(e) => setFormData({...formData, destination: e.target.value})}
          placeholder="JFK"
          maxLength={32}
          required
        />
      </div>

      <div>
        <label>Tipo:</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value as 'MONEY' | 'AIRMILES'})}
        >
          <option value="MONEY">Dinheiro</option>
          <option value="AIRMILES">Milhas</option>
        </select>
      </div>

      <div>
        <label>Valor Máximo:</label>
        <input
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: e.target.value})}
          placeholder="2000"
          min={1}
        />
      </div>

      <div>
        <label>Data Início:</label>
        <input
          type="date"
          value={formData.start}
          onChange={(e) => setFormData({...formData, start: e.target.value})}
        />
      </div>

      <div>
        <label>Data Fim:</label>
        <input
          type="date"
          value={formData.end}
          onChange={(e) => setFormData({...formData, end: e.target.value})}
        />
      </div>

      {/* NOVO: Filtro por companhia aérea */}
      <div>
        <label>Companhia Aérea (opcional):</label>
        <input
          type="text"
          value={formData.airline}
          onChange={(e) => setFormData({...formData, airline: e.target.value})}
          placeholder="LATAM, Gol, Azul..."
          maxLength={64}
        />
      </div>

      {/* NOVO: Tipo de viagem */}
      <div>
        <label>Tipo de Viagem:</label>
        <select
          value={formData.tripType}
          onChange={(e) => setFormData({...formData, tripType: e.target.value as 'ONE_WAY' | 'ROUND_TRIP'})}
        >
          <option value="ONE_WAY">Apenas Ida</option>
          <option value="ROUND_TRIP">Ida e Volta</option>
        </select>
      </div>

      {/* NOVO: Intervalo de busca (apenas para ida e volta) */}
      {formData.tripType === 'ROUND_TRIP' && (
        <div>
          <label>Intervalo de busca da volta (dias):</label>
          <input
            type="number"
            value={formData.returnDateRange}
            onChange={(e) => setFormData({...formData, returnDateRange: Number(e.target.value)})}
            min={1}
            max={30}
          />
          <small>O sistema buscará voos de volta em até {formData.returnDateRange} dias após cada data de ida</small>
        </div>
      )}

      <button type="submit">Criar Radar</button>
    </form>
  );
}

export default CreateRadarForm;
```

---

## 5. Validações e Regras de Negócio

### Validações no Backend

1. **Campos Obrigatórios:**
   - `origin` (máx 32 caracteres)
   - `destination` (máx 32 caracteres)
   - `type` (apenas 'MONEY' ou 'AIRMILES')

2. **Campos Opcionais:**
   - `value` (número > 0)
   - `start` (formato: YYYY-MM-DD)
   - `end` (formato: YYYY-MM-DD)
   - `airline` (máx 64 caracteres, será convertido para UPPERCASE)
   - `tripType` (apenas 'ONE_WAY' ou 'ROUND_TRIP', padrão: 'ONE_WAY')
   - `returnDateRange` (número entre 1 e 30, padrão: 15)

3. **Valores Padrão:**
   - `tripType`: 'ONE_WAY' (se não informado)
   - `returnDateRange`: 15 dias (se não informado)

4. **Validações Aplicadas:**

```typescript
// 1. Se airline for informada, converter para uppercase e remover espaços
if (airline) {
  airline = airline.trim().toUpperCase();
}

// 2. Validar tripType
if (tripType && !['ONE_WAY', 'ROUND_TRIP'].includes(tripType)) {
  return res.status(400).json({
    error: 'tripType deve ser ONE_WAY ou ROUND_TRIP'
  });
}

// 3. Validar returnDateRange (apenas se tripType = ROUND_TRIP)
if (tripType === 'ROUND_TRIP' && returnDateRange) {
  if (returnDateRange < 1 || returnDateRange > 30) {
    return res.status(400).json({
      error: 'returnDateRange deve estar entre 1 e 30 dias'
    });
  }
}
```

### Comportamento do Sistema

- **Autenticação**: Todos os endpoints requerem Bearer Token
- **SMS Notification**: Ao criar radar, o sistema envia SMS de confirmação (se usuário tiver telefone cadastrado)
- **Radar Routine**: O sistema cria rotinas automáticas de busca para cada combinação origem/destino
- **Filtro de Companhia**: Se `airline` for informado, apenas voos dessa companhia são considerados
- **Ida e Volta**: Se `tripType = 'ROUND_TRIP'`, o sistema busca combinações de ida+volta dentro do `returnDateRange`

---

## 6. Lógica de Busca de Voos

### 6.1 Busca com Filtro de Companhia Aérea

Quando o campo `airline` está definido, o sistema filtra os resultados:

```typescript
let filteredFlights = flights;

if (airline) {
  filteredFlights = flights.filter(f =>
    f.airline.toUpperCase() === airline.toUpperCase()
  );
}
```

**Comportamento:**
- Compara o nome da companhia em uppercase (case-insensitive)
- Apenas voos da companhia especificada são retornados
- Se não houver voos da companhia no período, retorna array vazio

### 6.2 Busca de Voos de Ida e Volta (ROUND_TRIP)

Quando `tripType = 'ROUND_TRIP'`, o sistema executa a seguinte lógica:

```typescript
// Para cada voo de ida, buscar voos de volta dentro do intervalo
for (const outboundFlight of outboundFlights) {
  const departureDate = new Date(outboundFlight.date);

  // Calcular range de datas de retorno
  const returnStart = new Date(departureDate);
  returnStart.setDate(returnStart.getDate() + 1); // Mínimo 1 dia depois

  const returnEnd = new Date(departureDate);
  returnEnd.setDate(returnEnd.getDate() + returnDateRange); // Até X dias depois

  // Buscar voos de retorno (origem e destino invertidos)
  const returnFlights = await searchFlights(
    destination,  // origem do voo de volta
    origin,       // destino do voo de volta
    returnStart,
    returnEnd
  );

  // Aplicar filtro de companhia também nos voos de volta (se definido)
  if (airline) {
    returnFlights = returnFlights.filter(f =>
      f.airline.toUpperCase() === airline.toUpperCase()
    );
  }

  // Pegar o mais barato
  const cheapestReturn = returnFlights.sort((a, b) => a.price - b.price)[0];

  if (cheapestReturn) {
    // Salvar combinação ida + volta
    await saveRoundTripOffer({
      outbound: outboundFlight,
      return: cheapestReturn,
      totalPrice: outboundFlight.price + cheapestReturn.price
    });
  }
}
```

**Funcionamento:**
1. Para cada voo de **ida** encontrado no período (`start` até `end`)
2. Calcula o intervalo de datas de **volta**:
   - Início: data da ida + 1 dia (mínimo)
   - Fim: data da ida + `returnDateRange` dias
3. Busca voos de **volta** (destino → origem) neste intervalo
4. Se `airline` foi especificado, filtra também os voos de volta pela mesma companhia
5. Seleciona o voo de volta **mais barato** dentro do intervalo
6. Salva a combinação com o **preço total** (ida + volta)

**Exemplo Prático:**
```
Radar configurado:
- origin: GRU
- destination: MAD
- start: 2025-03-01
- end: 2025-03-10
- tripType: ROUND_TRIP
- returnDateRange: 15
- airline: LATAM

Cenário:
1. Sistema encontra voo LATAM de ida em 05/03 por R$ 2000
2. Busca voos LATAM de volta (MAD → GRU) entre 06/03 e 20/03 (05/03 + 15 dias)
3. Encontra voo de volta em 12/03 por R$ 1800
4. Salva oferta: ida 05/03 + volta 12/03 = R$ 3800 total
```

---

## 7. Formato de Resposta dos Voos Encontrados

### Endpoint: `GET /api/v1/radars/:id/flights`

**Response quando tripType = 'ONE_WAY':**
```json
{
  "results": [
    {
      "_id": "67890abcdef",
      "radarId": "12345",
      "origin": "GRU",
      "destination": "MAD",
      "type": "MONEY",
      "date": "2025-03-15",
      "value": 2000,
      "airline": "LATAM",
      "tripType": "ONE_WAY",
      "createdAt": "2025-01-14T10:00:00Z"
    },
    {
      "_id": "67890abcde2",
      "radarId": "12345",
      "origin": "GRU",
      "destination": "MAD",
      "type": "MONEY",
      "date": "2025-03-16",
      "value": 1850,
      "airline": "LATAM",
      "tripType": "ONE_WAY",
      "createdAt": "2025-01-14T11:00:00Z"
    }
  ],
  "metadata": {
    "total": 2,
    "radarId": "12345",
    "tripType": "ONE_WAY"
  }
}
```

**Response quando tripType = 'ROUND_TRIP':**
```json
{
  "results": [
    {
      "_id": "67890abcdef",
      "radarId": "12345",
      "origin": "GRU",
      "destination": "MAD",
      "type": "MONEY",
      "tripType": "ROUND_TRIP",

      // Dados do voo de ida
      "outboundDate": "2025-03-15",
      "outboundValue": 2000,
      "outboundAirline": "LATAM",

      // Dados do voo de volta
      "returnDate": "2025-03-22",
      "returnValue": 1800,
      "returnAirline": "LATAM",

      // Total
      "totalValue": 3800,

      "createdAt": "2025-01-14T10:00:00Z"
    },
    {
      "_id": "67890abcde2",
      "radarId": "12345",
      "origin": "GRU",
      "destination": "MAD",
      "type": "MONEY",
      "tripType": "ROUND_TRIP",

      "outboundDate": "2025-03-16",
      "outboundValue": 1850,
      "outboundAirline": "LATAM",

      "returnDate": "2025-03-25",
      "returnValue": 1900,
      "returnAirline": "LATAM",

      "totalValue": 3750,

      "createdAt": "2025-01-14T11:00:00Z"
    }
  ],
  "metadata": {
    "total": 2,
    "radarId": "12345",
    "tripType": "ROUND_TRIP",
    "returnDateRange": 15
  }
}
```

### Estrutura dos Campos na Resposta

**Campos Comuns (ONE_WAY e ROUND_TRIP):**
- `_id`: ID único da oferta encontrada
- `radarId`: ID do radar que gerou esta oferta
- `origin`: Código IATA de origem
- `destination`: Código IATA de destino
- `type`: "MONEY" ou "AIRMILES"
- `tripType`: "ONE_WAY" ou "ROUND_TRIP"
- `createdAt`: Timestamp de quando a oferta foi encontrada

**Campos Específicos de ONE_WAY:**
- `date`: Data do voo
- `value`: Preço do voo
- `airline`: Companhia aérea

**Campos Específicos de ROUND_TRIP:**
- `outboundDate`: Data do voo de ida
- `outboundValue`: Preço do voo de ida
- `outboundAirline`: Companhia aérea da ida
- `returnDate`: Data do voo de volta
- `returnValue`: Preço do voo de volta
- `returnAirline`: Companhia aérea da volta
- `totalValue`: Preço total (ida + volta)

---

## 8. Exemplos de Casos de Uso

### Caso 1: Radar simples de ida por companhia específica
```json
POST /api/v1/radars
{
  "origin": "GRU",
  "destination": "MIA",
  "type": "MONEY",
  "airline": "LATAM",
  "tripType": "ONE_WAY"
}
```
**Resultado**: Monitora apenas voos LATAM de GRU para MIA (somente ida)

### Caso 2: Radar de ida e volta com intervalo flexível
```json
POST /api/v1/radars
{
  "origin": "GIG",
  "destination": "LIS",
  "type": "MONEY",
  "value": 3000,
  "start": "2025-11-01",
  "end": "2025-11-30",
  "tripType": "ROUND_TRIP",
  "returnDateRange": 20
}
```
**Resultado**: Monitora voos de ida entre 01/11 e 30/11, e para cada ida encontrada, busca voltas em até 20 dias depois

### Caso 3: Radar de milhas com companhia específica e ida/volta
```json
POST /api/v1/radars
{
  "origin": "GRU",
  "destination": "CDG",
  "type": "AIRMILES",
  "value": 80000,
  "start": "2025-12-15",
  "end": "2025-12-25",
  "airline": "Air France",
  "tripType": "ROUND_TRIP",
  "returnDateRange": 15
}
```
**Resultado**: Monitora apenas voos Air France em milhas, com ida entre 15/12 e 25/12, e volta em até 15 dias após cada ida

---

## 9. Erros Comuns

### Erro 401 - Unauthorized
```json
{
  "statusCode": 401,
  "errors": [{
    "title": "Unauthorized",
    "message": "User is not authenticated"
  }]
}
```
**Solução**: Verificar se o token Bearer está sendo enviado corretamente no header

### Erro 400 - Validation Error
```json
{
  "statusCode": 400,
  "errors": [{
    "title": "Validation Error",
    "message": "Invalid input data",
    "detail": "returnDateRange must be between 1 and 30"
  }]
}
```
**Solução**: Verificar os dados enviados conforme as validações descritas

---

## 10. Checklist de Implementação no Frontend

- [ ] Adicionar campo de seleção de companhia aérea (input text ou select)
- [ ] Adicionar toggle/select para tipo de viagem (ONE_WAY / ROUND_TRIP)
- [ ] Adicionar campo de intervalo de volta (apenas visível se ROUND_TRIP selecionado)
- [ ] Validar que returnDateRange está entre 1 e 30
- [ ] Atualizar chamadas de API para incluir os novos campos
- [ ] Atualizar interface de listagem de radares para exibir os novos campos
- [ ] Atualizar formulário de edição de radar para permitir modificar os novos campos
- [ ] Adicionar legendas/tooltips explicando o funcionamento do returnDateRange
- [ ] Testar criação de radar com todas as combinações possíveis
- [ ] Testar edição de radar existente

---

## 11. Observações Importantes

1. **Migração de Dados**: Se já existem radares criados antes desta feature, eles terão:
   - `airline`: NULL
   - `tripType`: "ONE_WAY" (valor padrão)
   - `returnDateRange`: 15 (valor padrão)

2. **Compatibilidade**: O frontend antigo continuará funcionando, pois os novos campos são opcionais

3. **Performance**: O sistema de busca automática (radar routine) processa esses filtros para otimizar as buscas

4. **Notificações**: O usuário receberá SMS quando encontrar ofertas que atendam TODOS os critérios configurados (incluindo companhia aérea e tipo de viagem)

---

## 12. Próximos Passos Sugeridos

- [ ] Implementar UI no frontend para as novas features
- [ ] Adicionar listagem de companhias aéreas disponíveis (autocomplete)
- [ ] Implementar filtros na listagem de radares (filtrar por companhia, tipo de viagem)
- [ ] Adicionar estatísticas de radares por companhia
- [ ] Implementar preview de como funcionará o intervalo de volta antes de criar o radar

---

**Última Atualização**: 15/10/2025
**Versão da API**: v1
**Porta do Backend**: 3333 (http://localhost:3333)
