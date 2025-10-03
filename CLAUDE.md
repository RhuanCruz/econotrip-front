# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Econotrip PrimeVoyage** is a travel planning PWA/mobile app built with React, TypeScript, Vite, and Capacitor. The app provides intelligent travel itineraries, flight search/comparison (money and miles), deal radar, accessibility features, and social authentication.

## Development Commands

### Web Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server at localhost:8080
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Mobile Development (Capacitor)
```bash
npx cap sync android     # Sync web assets to Android
npx cap open android     # Open in Android Studio
```

## Environment Variables

Required in `.env.local`:
```
VITE_API_URL=https://<your-api>
VITE_PUSH_PUBLIC_KEY=<your-vapid-public-key>
```

## Architecture

### Routing & Layout
- **React Router v6** with nested routes
- **LayoutBase** wrapper provides header, footer, and bottom navigation for authenticated pages
- Public routes (login, register, password recovery) bypass LayoutBase
- Route structure in [src/App.tsx](src/App.tsx:75-120)

### State Management
- **Zustand** for global state (primarily authentication)
- **AuthStore** ([src/stores/authStore.ts](src/stores/authStore.ts)) manages user authentication, persisted to localStorage
- **React Query** (@tanstack/react-query) for server state management

### API Layer
- Centralized Axios client in [src/api/client.ts](src/api/client.ts)
- Service-oriented architecture:
  - `AuthService` - Login, social auth (Firebase Google Sign-In)
  - `FlightService` - Flight search and booking
  - `PlannerService` - Trip itinerary generation
  - `RadarService` - Deal alerts/radar
  - `UserService` - User profile management
  - `LocationService` - Airports and location data

### Component Organization
```
src/components/
├── ui/              # shadcn/ui components (Radix UI + Tailwind)
├── ui-custom/       # Custom reusable components (Button, Card, Input, etc.)
├── layout/          # Layout components (Header, Footer, BottomNavigation)
├── accessibility/   # AccessibilityBar (reading mode, high contrast, large font)
├── dashboard/       # Dashboard-specific components
├── search/          # Flight search form components
├── roteiro/         # Itinerary/trip planning components
└── [feature]/       # Other feature-specific components
```

### Pages
All screens in `src/pages/`, including:
- Authentication: WelcomeScreen, LoginScreen, RegisterScreen
- Flight Search: TelaBuscaVoos, ResultsScreen, FlightDetailsScreen
- Itinerary: NovaViagemScreen, RoteiroGeradoScreen, MeuRoteiroScreen
- Profile: ProfileScreen, EditProfileScreen, LoyaltyScreen
- Radar: RadarOfertasScreen, MeusRadaresScreen

### Key Features
- **Firebase Authentication** for Google Sign-In
- **Accessibility**: Reading mode, large fonts, high contrast (AccessibilityBar)
- **PWA**: Service worker in `public/service-worker.js` for offline support
- **Onboarding**: TourIntro component for first-time users (localStorage flag)
- **Global Components**: HumanSupportButton, AccessibilityBar rendered globally

### Styling
- **Tailwind CSS** with custom configuration
- **shadcn/ui** component library (Radix UI primitives)
- **Framer Motion** for animations
- Path alias: `@/` → `src/`

### Mobile (Capacitor)
- App ID: `econotrip.collabyt.com`
- Platforms: Android, iOS
- Keyboard plugin configured for dark theme and body resize
- Build output: `dist/`

## Important Notes

- Dev server runs on port **8080** (not default 5173)
- TypeScript strict checks are relaxed (noImplicitAny, strictNullChecks disabled)
- Package manager: **Yarn 1.22.22** (specified in package.json)
- Authentication tokens stored in localStorage via Zustand persist middleware
- Tour intro shows on first visit (check `econotrip_seen_tour` localStorage key)
