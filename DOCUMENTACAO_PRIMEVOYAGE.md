# PrimeVoyage - Documentação da Aplicação

## Visão Geral

PrimeVoyage é uma aplicação web moderna desenvolvida em React com TypeScript, focada em facilitar o planejamento e busca de viagens para usuários seniores. A aplicação oferece uma experiência otimizada com interfaces intuitivas, recursos de acessibilidade e funcionalidades personalizadas para o público 60+.

## Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Ferramenta de build e desenvolvimento
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animações e transições
- **React Router DOM** - Roteamento

### UI/UX Components
- **Radix UI** - Componentes acessíveis (accordion, dialog, select, etc.)
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Shadcn/ui** - Sistema de design

### Estado e Dados
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Gerenciamento de dados assíncronos
- **Axios** - Cliente HTTP
- **React Hook Form** - Formulários
- **Zod** - Validação de esquemas

### Outros
- **Firebase** - Autenticação e backend
- **Date-fns** - Manipulação de datas
- **Sonner** - Notificações toast
- **Service Workers** - Push notifications e cache

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos do sistema de design
│   ├── ui-custom/      # Componentes customizados
│   ├── layout/         # Componentes de layout
│   ├── search/         # Componentes de busca
│   └── [features]/     # Componentes específicos por funcionalidade
├── pages/              # Páginas da aplicação
├── stores/             # Estados globais (Zustand)
├── api/                # Serviços de API
├── hooks/              # Hooks customizados
└── lib/                # Utilitários e configurações
```

## Principais Funcionalidades

### 1. Autenticação e Perfil de Usuário
- **Login/Registro**: Sistema completo de autenticação
- **Perfil Personalizado**: Gestão de dados pessoais
- **Programa de Milhas Sênior**: Sistema de pontuação e benefícios

### 2. Busca de Voos
- **Busca Inteligente**: Interface otimizada para facilitar a pesquisa
- **Múltiplas Modalidades**: Voos pagos e com milhas
- **Filtros Avançados**: Por preço, acessibilidade, sustentabilidade
- **Autocompletar**: Busca inteligente de destinos

### 3. Simulador de Roteiros
- **Geração de Roteiros**: Criação automática de itinerários personalizados
- **Histórico de Simulações**: Visualização de simulações anteriores
- **Roteiros Personalizados**: Baseados no perfil do usuário

### 4. Radar de Ofertas
- **Monitoramento Automático**: Acompanhamento de preços em tempo real
- **Alertas Personalizados**: Notificações de ofertas relevantes
- **Filtragem Inteligente**: Por continentes e preferências

### 5. Recursos de Acessibilidade
- **Interface Adaptada**: Design otimizado para usuários seniores
- **Fontes Maiores**: Textos legíveis e contrastes adequados
- **Navegação Simplificada**: Fluxos intuitivos e diretos
- **Tooltips Contextuais**: Ajuda em tempo real

### 6. Viagem Sustentável
- **Turismo Responsável**: Opções de viagem ecológica
- **Badges Sustentáveis**: Identificação de opções verdes
- **Conscientização**: Dicas para viagens mais sustentáveis

### 7. Sistema de Notificações Push
- **Registro Automático**: Service Worker para receber notificações
- **Alertas Personalizados**: Notificações de ofertas e radar
- **Gestão de Permissões**: Solicitação de permissão no login
- **Navegação Inteligente**: Click nas notificações redireciona para conteúdo relevante

## Páginas Principais

### Dashboard (`/`)
Centro de controle principal onde o usuário:
- Visualiza dicas personalizadas de viagem
- Acessa funcionalidades principais
- Monitora programa de milhas
- Vê conquistas e estatísticas

### Busca de Voos (`/busca-voos`)
Interface principal para pesquisar passagens:
- Seleção de origem/destino com autocompletar
- Escolha de datas com calendário otimizado
- Configuração de passageiros e classes
- Filtros avançados (preço, acessibilidade, sustentabilidade)
- Opção de busca com milhas

### Simulador de Roteiros (`/meu-roteiro`)
Ferramenta de planejamento de viagens:
- Histórico de simulações realizadas
- Criação de novos roteiros personalizados
- Visualização detalhada de itinerários

### Radar de Ofertas (`/meus-radares`)
Sistema de monitoramento de preços:
- Criação de radares personalizados
- Visualização de ofertas encontradas
- Alertas de mudança de preço

### Programas de Milhas (`/programas-milhas`)
Central de programas de fidelidade:
- Comparação entre diferentes programas
- Visualização de custos em milhas + taxas
- Seleção de melhor opção por categoria

## Componentes Personalizados

### UI Custom
- **Button**: Botão customizado com variantes
- **Card**: Container padrão para conteúdo
- **LoadingSpinner**: Indicador de carregamento
- **StandardModal**: Modal padrão da aplicação
- **AlertBox**: Caixas de alerta e informação

### Funcionalidades Específicas
- **FlightSearchForm**: Formulário de busca de voos
- **DateSelector**: Seletor de datas otimizado
- **AutocompleteInput**: Campo com autocompletar
- **SustainableBadge**: Indicador de viagem sustentável

## Sistema de Design

### Cores Principais
```css
/* Cores do tema EconoTrip */
--econotrip-primary: #153D6B    /* Azul principal */
--econotrip-blue: #153D6B       /* Azul */
--econotrip-orange: #FF8C42     /* Laranja */
--econotrip-green: #5CB85C      /* Verde */
--econotrip-coral: #FF6B6B      /* Coral */
```

### Tipografia
- **Fonte Principal**: Font system padrão
- **Títulos**: Museo Moderno (quando disponível)
- **Tamanhos**: Escala responsiva otimizada

## APIs e Serviços

### Estrutura de Serviços
```typescript
api/
├── auth/           # Autenticação
├── flight/         # Busca de voos
├── radar/          # Radar de ofertas  
├── planner/        # Planejador de roteiros
└── miles/          # Programas de milhas
```

### Principais Endpoints
- **Autenticação**: Login, registro, recuperação de senha
- **Busca de Voos**: Pesquisa, detalhes, comparação
- **Radar**: Criação, monitoramento, ofertas
- **Roteiros**: Geração, histórico, detalhes

## Estados Globais (Zustand)

### AuthStore
Gerencia autenticação e dados do usuário:
```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}
```

## Recursos de Performance

### Otimizações Implementadas
- **Lazy Loading**: Carregamento tardio de componentes
- **Code Splitting**: Divisão do código por rotas
- **Caching**: Cache de dados com TanStack Query
- **Memoização**: Componentes otimizados com React.memo

### Bundle Optimization
- **Tree Shaking**: Remoção de código não utilizado
- **Minificação**: Compressão de assets
- **Image Optimization**: Otimização de imagens

## Acessibilidade

### Recursos Implementados
- **ARIA Labels**: Etiquetas para leitores de tela
- **Navegação por Teclado**: Suporte completo
- **Alto Contraste**: Cores adequadas para visibilidade
- **Tamanhos de Toque**: Botões otimizados para dispositivos móveis

### Diretrizes Seguidas
- **WCAG 2.1**: Conformidade com diretrizes de acessibilidade
- **Design Inclusivo**: Interface adaptada para usuários seniores

## Responsividade

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Abordagem Mobile-First
Interface projetada prioritariamente para dispositivos móveis, com adaptações progressivas para telas maiores.

## Deployment e Build

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Build de desenvolvimento
npm run build:dev

# Linting
npm run lint

# Preview
npm run preview
```

### Configuração de Build
- **Vite**: Build tool principal
- **TypeScript**: Verificação de tipos
- **ESLint**: Linting de código
- **PostCSS**: Processamento de CSS

## Monitoramento e Analytics

### Métricas Coletadas
- **Performance**: Core Web Vitals
- **Uso**: Interações e navegação
- **Erros**: Tracking de bugs e exceções

## Segurança

### Medidas Implementadas
- **Validação**: Entrada de dados com Zod
- **Sanitização**: Prevenção contra XSS
- **HTTPS**: Comunicação segura
- **Token JWT**: Autenticação segura

## Roadmap Futuro

### Próximas Funcionalidades
- **Integração com APIs de Pagamento**
- **Chat de Suporte em Tempo Real**
- **Modo Offline**
- **Integração com Calendários**

### Melhorias Planejadas
- **Performance**: Otimizações adicionais
- **UX**: Refinamentos na experiência
- **Acessibilidade**: Novos recursos inclusivos
- **Mobile**: App nativo (React Native)

## Contribuição

### Padrões de Código
- **ESLint**: Configuração strict
- **Prettier**: Formatação consistente
- **TypeScript**: Tipagem obrigatória
- **Commits**: Conventional Commits

### Estrutura de Branches
- **main**: Branch principal
- **develop**: Branch de desenvolvimento
- **feature/**: Features específicas
- **bugfix/**: Correções de bugs

## Suporte e Documentação

### Recursos Adicionais
- **Storybook**: Documentação de componentes
- **Testes**: Jest + Testing Library
- **E2E**: Cypress para testes de ponta a ponta

### Contato
Para dúvidas técnicas ou suporte:
- **GitHub Issues**: Reportar bugs
- **Documentação**: Wiki do projeto
- **Suporte**: Canal dedicado

---

*Esta documentação é mantida atualizada com as últimas versões da aplicação PrimeVoyage.*