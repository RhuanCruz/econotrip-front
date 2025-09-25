# PrimeVoyage App

## Funcionalidades

- Simulação de roteiros de viagem inteligentes
- Busca e comparação de voos por continente, origem e destino
- Radar de ofertas (dinheiro e milhas)
- Histórico de simulações e gerenciamento de viagens
- Perfil do usuário e notificações push
- Acessibilidade: modo leitura, fonte grande, alto contraste
- Cadastro, login, recuperação de senha

## Execução do projeto

### Pré-requisitos

- Node.js 18+
- npm 9+
- Android Studio (para build mobile)
- Vite, React, TypeScript, Tailwind CSS

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```
VITE_API_URL=https://<sua-api>
VITE_PUSH_PUBLIC_KEY=<sua-vapid-public-key>
```

### Rodando localmente (Web)

```sh
npm install
npm run dev
```

Acesse: [http://localhost:8080](http://localhost:8080)

### Build para produção (Web)

```sh
npm run build
npm run preview
```

### Build para Android (PWA/Capacitor)

1. Instale o Capacitor:
   ```sh
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```
2. Adicione a plataforma Android:
   ```sh
   npx cap add android
   ```
3. Sincronize e abra no Android Studio:
   ```sh
   npm run build
   npx cap sync android
   npx cap open android
   ```

## Observações

- Para notificações push, configure o service worker e a VAPID public key.
- O app é responsivo e pode ser instalado como PWA.
- Para builds nativos, siga as instruções do Capacitor.

---