# Real Estate System Client

Frontend client for a real estate browsing and inquiry application built with React, TypeScript, Vite, and Tailwind CSS.

## About

This app provides a property marketplace style interface where users can:

- browse property listings
- open individual property detail pages
- save listings to favorites
- send property inquiries
- view a protected dashboard, saved items, and settings
- explore the app in demo mode without creating an account

The frontend talks to a backend API through `VITE_API_URL`. When demo mode is active, several screens fall back to mock data so the UI can still be explored locally.

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- Radix UI

## Requirements

- Node.js `>= 18`
- npm `>= 9`

## Environment Setup

This project includes a sample environment file:

```env
VITE_API_URL=http://localhost:4000/api
```

Create a local env file from the example:

```powershell
Copy-Item .env.example .env
```

Update `VITE_API_URL` if your backend runs on a different host or port.

## How To Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:8080
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## Available Scripts

- `npm run dev` starts Vite on port `8080`
- `npm run build` creates a production build
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint

## Main Routes

- `/` landing page
- `/login` sign in / demo entry
- `/listings` property listings
- `/property` property details and inquiry flow
- `/dashboard` protected dashboard
- `/saved` protected saved listings page
- `/settings` protected settings page

## Project Structure

```text
client/
|-- public/
|   |-- css/                  # Bootstrap CSS assets
|   |-- js/                   # Bootstrap JS assets
|   |-- *.png, *.jpg, *.svg   # Static images and branding assets
|-- src/
|   |-- components/
|   |   |-- layouts/
|   |   |   `-- MainLayout.tsx
|   |   |-- ui/               # Reusable UI primitives
|   |   |-- Features.tsx
|   |   |-- Footer.tsx
|   |   |-- Header.tsx
|   |   |-- Hero.tsx
|   |   |-- LogoIcon.tsx
|   |   |-- Navigation.tsx
|   |   |-- PlatformSection.tsx
|   |   |-- PropertyTypes.tsx
|   |   |-- ProtectedRoute.tsx
|   |   `-- Stats.tsx
|   |-- contexts/
|   |   |-- AuthContext.tsx   # Demo auth and auth state
|   |   `-- WalletContext.tsx # Wallet state placeholder
|   |-- hooks/
|   |   |-- use-mobile.tsx
|   |   `-- use-toast.ts
|   |-- lib/
|   |   |-- utils.ts
|   |   `-- walletConfig.ts
|   |-- pages/
|   |   |-- Dashboard.tsx
|   |   |-- Index.tsx
|   |   |-- Listings.tsx
|   |   |-- Login.tsx
|   |   |-- NotFound.tsx
|   |   |-- Property.tsx
|   |   |-- Register.tsx
|   |   |-- Saved.tsx
|   |   `-- Settings.tsx
|   |-- services/
|   |   `-- api.ts            # Axios client, API methods, demo data
|   |-- App.tsx               # Route setup
|   |-- App.css
|   |-- index.css
|   |-- main.tsx              # App bootstrap
|   `-- vite-env.d.ts
|-- .env.example
|-- components.json
|-- eslint.config.js
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.js
```

## Notes

- Protected pages depend on the auth context and demo login flow.
- The Vite dev server is configured in `vite.config.js` to use port `8080`.
- API requests are centralized in `src/services/api.ts`.
- If no real backend is available, demo mode still allows exploring much of the UI.
