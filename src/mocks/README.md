# 🔧 Mocks do Econotrip Frontend

Este diretório contém **dados mockados** para permitir desenvolvimento e testes mesmo quando o backend não está disponível.

## 📋 O que está mockado?

### ✅ 1. Locations (Autocomplete de Aeroportos)
**Arquivo:** `locations.mock.ts`

- **70+ aeroportos** brasileiros e internacionais
- Busca por **código IATA** (ex: GRU, JFK)
- Busca por **cidade** (ex: São Paulo, Lisboa)
- Busca por **nome do aeroporto**
- Normalização automática (remove acentos)
- Limita resultados a 10 por busca

**Aeroportos incluídos:**
- 🇧🇷 **Brasil:** GRU, CGH, VCP, GIG, SDU, BSB, SSA, FOR, REC, CWB, POA, etc.
- 🇪🇺 **Europa:** LIS, MAD, BCN, CDG, LHR, FCO, FRA, AMS, etc.
- 🇺🇸 **América do Norte:** JFK, MIA, LAX, ORD, MEX, CUN, etc.
- 🌎 **América do Sul:** EZE, SCL, LIM, BOG, etc.
- 🌏 **Ásia/Oriente Médio:** DXB, DOH, NRT, HND, etc.

### ✅ 2. Feedback
**Arquivo:** `feedback.mock.ts`

- Simula envio de feedback com sucesso
- Valida campos obrigatórios
- Retorna ID mockado e timestamp
- Delay de rede simulado (500ms)

## 🔀 Como Ativar/Desativar Mocks

### Locations:
```typescript
// Em: src/mocks/locations.mock.ts
export const USE_MOCK_LOCATIONS = true;  // true = mock | false = API real
```

### Feedback:
```typescript
// Em: src/mocks/feedback.mock.ts
export const USE_MOCK_FEEDBACK = true;  // true = mock | false = API real
```

## 🧪 Como Testar

### 1. Testar Autocomplete de Locations

```bash
# 1. Certifique-se que USE_MOCK_LOCATIONS = true
# 2. Acesse: http://localhost:8081/busca-voos
# 3. Digite no campo "De Onde": São Paulo
# 4. Você verá no console:
#    🔧 [MOCK] Usando dados mockados para locations: São Paulo
#    🔧 [MOCK] Retornando 3 resultados
# 5. O dropdown mostrará: GRU, CGH, VCP
```

**Testes sugeridos:**
- Digite "São" → deve mostrar aeroportos de São Paulo
- Digite "GRU" → deve mostrar Guarulhos
- Digite "Rio" → deve mostrar GIG e SDU
- Digite "LIS" → deve mostrar Lisboa
- Digite "Paris" → deve mostrar CDG e ORY

### 2. Testar Feedback

```bash
# 1. Certifique-se que USE_MOCK_FEEDBACK = true
# 2. Acesse: http://localhost:8081/feedback
# 3. Preencha o formulário:
#    - Categoria: Bug
#    - Assunto: Teste de mock
#    - Mensagem: Testando sistema de feedback mockado
#    - Avaliação: 5 estrelas
# 4. Clique em "Enviar Feedback"
# 5. Você verá no console:
#    🔧 [MOCK] Usando feedback mockado
#    🔧 [MOCK FEEDBACK] Simulando envio de feedback: {...}
#    ✅ [MOCK FEEDBACK] Feedback mockado criado com sucesso
# 6. Mensagem de sucesso aparecerá na tela
```

## 🚀 Quando Remover os Mocks?

Quando o backend estiver funcionando:

1. **Altere as flags:**
   ```typescript
   // src/mocks/locations.mock.ts
   export const USE_MOCK_LOCATIONS = false;

   // src/mocks/feedback.mock.ts
   export const USE_MOCK_FEEDBACK = false;
   ```

2. **Verifique que a API real funciona:**
   ```bash
   # Locations
   curl -X POST http://localhost:8080/api/v1/locations/list \
     -H "Content-Type: application/json" \
     -d '{"keyword":"GRU"}'

   # Feedback
   curl -X POST http://localhost:8080/api/v1/feedback \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"category":"BUG","subject":"Teste","message":"Teste"}'
   ```

3. **Se tudo funcionar, você pode deletar os arquivos de mock (opcional)**

## 📊 Logs Úteis

Quando os mocks estão ativos, você verá logs no console do navegador:

### Locations:
```
🔧 [MOCK] Usando dados mockados para locations: São Paulo
🔧 [MOCK] Retornando 3 resultados
```

### Feedback:
```
🔧 [MOCK] Usando feedback mockado
🔧 [MOCK FEEDBACK] Simulando envio de feedback: {...}
✅ [MOCK FEEDBACK] Feedback mockado criado com sucesso: {...}
```

### Autocomplete (Debug):
```
🔍 [Origem] useEffect disparado: {origem: 'São', length: 3, ...}
⏱️ [Origem] Iniciando debounce...
📡 [Origem] Buscando: São
✅ [Origem] Resposta recebida: {locations: [...], status: true}
🏁 [Origem] Finalizando busca
```

## 🎯 Benefícios dos Mocks

✅ **Desenvolvimento independente** - Não precisa esperar o backend
✅ **Testes rápidos** - Sem latência de rede
✅ **Dados consistentes** - Sempre retorna os mesmos aeroportos
✅ **Debug facilitado** - Logs claros mostram o que está acontecendo
✅ **Demo/Apresentação** - Funciona offline para demonstrações

## ⚠️ Limitações dos Mocks

- ❌ Não salva dados no servidor (feedback não persiste)
- ❌ Lista de aeroportos é fixa (70+ aeroportos principais)
- ❌ Não testa integração real com backend
- ❌ Não testa autenticação/autorização
- ❌ Não testa casos de erro do servidor

## 📝 Adicionar Mais Aeroportos

Para adicionar mais aeroportos ao mock:

```typescript
// Em: src/mocks/locations.mock.ts
export const MOCK_LOCATIONS: StandardLocation[] = [
  // ... aeroportos existentes ...

  // Adicione novos aqui:
  {
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    country: 'USA',
    cityCode: 'SFO'
  },
  // ...
];
```

---

**Última atualização:** 2025-10-14
**Status:** ✅ Mocks ativos e funcionando
